import { NextPage } from 'next'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { Loading } from '../components/Loading'

const Register: NextPage = () => {
  const [isverified, setisverified] = useState(true)
  const [isbuttonclicked, setisbuttonclicked] = useState(false)

  const {
    data: user,
    mutateAsync: register,
    isLoading: registerLoading
  } = useMutation(async (values: any) => {
    const user = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    })
    return await user.json()
  })
  useEffect(() => {
    if (user?.id) {
      window.location.href = '/'
    }
  }, [user])

  return isverified ? (
    <>
      <div className="flex items-center justify-center py-8 bg-gray-100">
        <div className="px-8 py-6 mx-4 mt-4 text-left bg-white shadow-lg w-1/2 rounded-lg">
          <div className="flex justify-center"></div>
          <h3 className="text-2xl font-bold text-center">
            Join our Trimes Family
          </h3>
          <form
            onSubmit={async e => {
              e.preventDefault()
              const target = e.currentTarget as any
              if (target.password.value !== target.confirmPassword.value) {
                alert('Passwords do not match')
                return
              }

              await register({
                name: target.name.value,
                email: target.email.value,
                password: target.password.value,
                maritalStatus: target.maritalStatus.value,
                gender: target.gender.value,
                birthday: target.birthday.value,
                contact: target.contact.value,
                occupation: target.occupation.value,
                qualification: target.qualification.value,
                gautra: target.gautra.value,
                nativeTown: target.nativeTown.value,
                bloodGroup: target.bloodGroup.value,
                address: target.address.value,
                isPrivateProperty: target.isPrivateProperty.checked
              })
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block">
                  Name<span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  required
                />
              </div>
              <div>
                <label className="block">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block">
                  Password
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  required
                />
              </div>
              <div>
                <label className="block">
                  Confirm Password
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm  Password"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  required
                />
              </div>
              <span className="text-xs text-red-400 hidden">
                Password must be same!
              </span>
              <div>
                <div className="block">
                  Marital Status
                  <span className="text-red-600">*</span>
                </div>

                <label className="cursor-pointer ">
                  <input
                    type="radio"
                    name="maritalStatus"
                    value="married"
                    className=" px-4 py-2 mt-2"
                    defaultChecked
                  />{' '}
                  Married
                </label>

                <label className="cursor-pointer ml-2">
                  <input
                    type="radio"
                    name="maritalStatus"
                    value="unmarried"
                    className=" px-4 py-2 mt-2"
                  />{' '}
                  Unmarried
                </label>

                <label className="cursor-pointer ml-2">
                  {' '}
                  <input
                    type="radio"
                    name="maritalStatus"
                    value="divorced"
                    className=" px-4 py-2 mt-2"
                  />{' '}
                  Divorced
                </label>
              </div>
              <div>
                <div className="block">
                  Gender
                  <span className="text-red-600">*</span>
                </div>

                <label className="pr-4 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    className="px-4 py-2 mt-2"
                    defaultChecked
                  />{' '}
                  Male
                </label>

                <label className="pr-4 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    className="px-4 py-2 mt-2"
                  />{' '}
                  Female
                </label>

                <label className="pr-4 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    className="px-4 py-2 mt-2"
                  />{' '}
                  Other
                </label>
              </div>
              <div>
                <label className="block">
                  Date of Birth
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  id="birthday"
                  name="birthday"
                  placeholder="DD/MM/YYYY"
                  required
                ></input>
              </div>
              <div>
                <label className="block">
                  Contact
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  name="contact"
                  placeholder="+91-1234567890"
                  required
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block">
                  Occupation
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="occupation"
                  placeholder="Occupation"
                  required
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block">
                  Qualification
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="qualification"
                  required
                  placeholder="Qualification"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block">
                  Gautra
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="gautra"
                  placeholder="Gautra"
                  required
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block">
                  Native Town
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="nativeTown"
                  required
                  placeholder="Native Town"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block">Blood Group</label>
                <select
                  name="bloodGroup"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  <option value="">Select</option>
                  <option value="O-">O-</option>
                  <option value="O+">O+</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
              <div>
                <label className="block">
                  Address
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  required
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    name="isPrivateProperty"
                    className="mr-2"
                  />
                  Do you own the house where you live?
                </label>
              </div>
            </div>
            <div className="flex">
              <button className="w-full px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
                Create Account
              </button>
            </div>
            <div className="mt-6 text-grey-dark">
              Already have an account?
              <Link href="/login">
                <a className="text-blue-600 hover:underline">Log in</a>
              </Link>
            </div>
          </form>
        </div>
      </div>
      {registerLoading && <Loading />}
    </>
  ) : (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="px-8 py-6 mx-4 mt-4 text-left bg-white shadow-lg md:w-1/3 lg:w-1/3 sm:w-1/3">
          <div className="flex justify-center"></div>
          <h3 className="text-2xl font-bold text-center">
            Enter Your Phone Number
          </h3>
          <form onSubmit={e => e.preventDefault()}>
            <div className="mt-4">
              <div className="mt-4">
                <label className="block">Phone Number</label>
                <input
                  type="text"
                  placeholder="Number"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              {isbuttonclicked ? (
                <div className="mt-4">
                  <label className="block">OTP</label>
                  <input
                    type="text"
                    placeholder="OTP"
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              ) : null}

              <div className="flex">
                <button
                  className="w-full px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900 "
                  onClick={() => setisbuttonclicked(true)}
                >
                  Send OTP
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
export default Register
