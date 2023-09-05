import { Area } from '@prisma/client'
import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Layout } from '~/components/Layout'
import { Spinner } from '~/components/Spinner'
import { getServerAuthSession } from '~/server/auth'
import { api } from '~/utils/api'


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx)
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
  return {
    props: {}
  }
}

const Register: NextPage = () => {
  const [registered, setIsRegistered] = useState(false)
  const router = useRouter()

  //? Queries
  const { data: areas, isLoading: getAreasLoading } = api.area.getAll.useQuery()

  //? Mutations
  const { mutateAsync: register, isLoading: registerLoading } = api.user.register.useMutation()

  return <Layout>
    {!registered ? (

      <div className="flex items-center justify-center py-8 bg-gray-100">
        <div className="px-8 py-6 mx-4 mt-4 text-left bg-white shadow-lg md:w-1/2 rounded-lg">
          <div className="flex justify-center"></div>
          <h3 className="text-2xl font-bold text-center">
            Join our Trimes Family
          </h3>
          <h3 className="text-xl text-red-500 font-bold text-center">
            ( यदि आप त्रिवेदी मेवाड़ा ब्राह्मण समाज से आते हैं,तो ही इस form को
            भरें। )
          </h3>
          <form
            onSubmit={async e => {
              e.preventDefault()
              const target = e.currentTarget as any
              if (target.password.value !== target.confirmPassword.value) {
                alert('Passwords do not match')
                return
              }
              if (target.password.value.length < 4) {
                alert('Password must be at least 4 characters')
                return
              }
              try {
                await register({
                  name: target.name.value,
                  email: target.email.value,
                  password: target.password.value,
                  maritalStatus: target.maritalStatus.value,
                  gender: target.gender.value,
                  birthday: new Date(target.birthday.value),
                  contact: target.contact.value,
                  occupation: target.occupation.value,
                  qualification: target.qualification.value,
                  gautra: target.gautra.value,
                  nativeTown: target.nativeTown.value,
                  bloodGroup: target.bloodGroup.value,
                  address: target.address.value,
                  isPrivateProperty: target.isPrivateProperty.checked,
                  areaId: target.areaId.value,
                  familyAnnualIncome: target.familyAnnualIncome.value,
                  fatherName: target.fatherName.value
                })
                setIsRegistered(true)
              } catch (error: any) {
                alert(error.message.includes('Unique') ? 'Email or Contact already exists!' : error.message || 'Something went wrong, please contact administrator')
              }
            }}
          >
            <div className="grid md:grid-cols-2 gap-4">
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
                <label className="block">
                  Email
                  <span className="text-red-600">*</span>
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  required
                />
              </div>
              <div>
                <label className="block">
                  Password
                  <span className="text-red-600">*</span>
                </label>
                <span className="text-red-600">
                  Head member द्वारा इस वेबसाइट पर रजिस्ट्रेशन के समय बनाए जाने
                  वाला पासवर्ड
                </span>
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
                <label className="block">
                  Father&apos;s / Husband&apos;s name<span className="text-red-600">*</span>
                </label>
                <span className="text-red-600">
                  विवाहित मातृशक्ति,इस कॉलम में कृपया अपने पति का ही नाम लिखें।
                </span>
                <input
                  type="text"
                  name="fatherName"
                  placeholder="Father's/Husband's Name"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  required
                />
              </div>
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
                <label className="cursor-pointer ml-2">
                  {' '}
                  <input
                    type="radio"
                    name="maritalStatus"
                    value="widowed"
                    className=" px-4 py-2 mt-2"
                  />{' '}
                  Widowed
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
                  Which area do you belong?
                  <span className="text-red-600">*</span>
                </label>
                <select
                  name="areaId"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  required
                >
                  <option value="">Select Area</option>
                  {getAreasLoading
                    ? 'Loading...'
                    : areas?.map((area: Area) => (
                      <option key={area.id} value={area.id}>
                        {area.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block">Family Annual Income (Optional)</label>

                <select
                  name="familyAnnualIncome"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  {[
                    'Up to 1 Lakh',
                    'Above 1 Lakh & Up to 2.5 Lakhs',
                    'Above 2.5 Lakhs & Up to 5 Lakhs',
                    'Above 5 Lakhs'
                  ].map(income => (
                    <option key={income} value={income}>
                      {income}
                    </option>
                  ))}
                </select>
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

                <select
                  name="gautra"
                  required
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  {[
                    'Others',
                    'पराशर',
                    'अत्रि',
                    'भृगु',
                    'कौशिक',
                    'गौतम',
                    'वशिष्ठ',
                    'भारद्वाज',
                    'कपिल',
                    'भार्गव',
                    'वत्स',
                    'अगत्स्य',
                    'मार्कण्डेय',
                    'कश्यप',
                    'शांडिल्य',
                    'कौण्डिन्य',
                    'अज',
                    'कुश',
                    'जम्दग्नि',
                    'याज्ञवल्क्य',
                    'पुलत्स्य'
                  ].map(gautra => (
                    <option key={gautra} value={gautra}>
                      {gautra}
                    </option>
                  ))}
                </select>
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
              <button
                disabled={registerLoading}
                className="w-full flex justify-center gap-2 items-center px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
              >
                <span>Create Account</span>
                <Spinner loading={registerLoading} />
              </button>
            </div>
            <div className="mt-6 text-grey-dark flex gap-2">
              Already have an account?
              <Link href="/login" className="text-blue-600 hover:underline">
                Log in
              </Link>
            </div>
          </form>
        </div>
      </div>

    ) : (

      <div className="flex items-center justify-center py-24 bg-gray-100">
        <div className="px-8 py-6 mx-4 mt-4 text-left bg-white shadow-lg md:w-1/3 lg:w-1/3 sm:w-1/3">
          <div className="flex justify-center"></div>
          <h3 className="text-2xl font-bold text-center">
            Thank you for registering!
          </h3>
          <h3 className="text-xl text-red-500 font-bold text-center">
            Your account will be activated soon.
          </h3>
          <div className="flex">
            <button
              onClick={() => router.push('/')}
              className="w-full flex justify-center gap-2 items-center px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
            >
              <span>Home</span>
            </button>
          </div>
        </div>
      </div>

    )}
  </Layout>
}
export default Register
