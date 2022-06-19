import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import {
  useCheckVerifiedNumberLazyQuery,
  useVerifyNumberMutation
} from '../generated/graphql'

const Register: NextPage = () => {
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [otp, setOtp] = useState<number | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()
  const [checkPhoneNumberVerified] = useCheckVerifiedNumberLazyQuery()
  const [verifyNumber] = useVerifyNumberMutation()

  return (
    <div className="">
      <h3 className="font-bold text-3xl">Register</h3>
      <form
        className="p-2"
        onSubmit={async e => {
          e.preventDefault()

          if (!e.currentTarget.phone.value)
            return setErrorMsg('Phone number not entered!')
          const number = parseInt(e.currentTarget.phone.value)
          const { data } = await checkPhoneNumberVerified({
            variables: {
              number: number
            }
          })
          if (data?.checkVerifiedNumber) {
            return alert('Number already exists!')
          }
          if (!showOtpInput) {
            const otpGenerated = Math.floor(100000 + Math.random() * 900000)
            setOtp(otpGenerated)
            alert(('Enter this in OTP: ' + otpGenerated) as string)
            setShowOtpInput(true)
          } else {
            setErrorMsg('')

            const enteredOtp = parseInt(e.currentTarget.otp.value)
            if (otp === enteredOtp) {
              const { data } = await verifyNumber({
                variables: {
                  number,
                  otp
                }
              })
              if (data?.verifyNumber) return router.push('/register')
              setErrorMsg('Some error occurred!')
            } else {
              setErrorMsg('Wrong OTP entered!')
            }
          }
        }}
      >
        <label htmlFor="phone" className="block">
          Phone:
        </label>
        <input
          placeholder="Phone Number"
          required
          id="phone"
          type="tel"
          name="phone"
          className="border p-1"
        ></input>
        {showOtpInput && (
          <div>
            <label htmlFor="otp" className="block mt-2">
              Enter OTP:
            </label>
            <input type="number" name="otp" className="border p-1" />
          </div>
        )}
        {errorMsg && (
          <span className="text-red-600 text-sm font-semibold mt-1">
            {errorMsg}
          </span>
        )}
        <button
          type="submit"
          className="block bg-blue-700 px-4 font-bold mt-2 rounded-md text-white"
        >
          {showOtpInput ? 'Submit' : 'Verify'}
        </button>
      </form>
    </div>
  )
}
export default Register
