import { NextPage } from 'next'
import Link from 'next/link'
import React from 'react'
import { useState } from 'react'

const Register: NextPage = () => {
  const [isverified, setisverified] = useState(false)
  const [isbuttonclicked, setisbuttonclicked] = useState(false)
  const [addMember, setaddMember] = useState(false)

  const otpButtonHandler = () => {
    setisbuttonclicked(true)
  }
  return isverified ? (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="px-8 py-6 mx-4 mt-4 text-left bg-white shadow-lg md:w-1/3 lg:w-1/3 sm:w-1/3">
          <div className="flex justify-center"></div>
          <h3 className="text-2xl font-bold text-center">
            Join our Trimes Family
          </h3>
          <form action="">
            <div className="mt-4">
              <div>
                <label className="block">
                  Name<span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  required
                />
              </div>
              <div className="mt-4">
                <label className="block">Email</label>
                <input
                  type="text"
                  placeholder="Email"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div className="mt-4">
                <label className="block">
                  Password
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div className="mt-4">
                <label className="block">
                  Confirm Password
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <span className="text-xs text-red-400 hidden">
                Password must be same!
              </span>
              <div className="mt-4">
                <label className="block">
                  Marital Status
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type="checkbox"
                  placeholder="Password"
                  className=" px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <label className="pr-4"> Married</label>
                <input
                  type="checkbox"
                  placeholder="Password"
                  className=" px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <label className="pr-4"> Unmarried</label>
                <input
                  type="checkbox"
                  placeholder="Password"
                  className=" px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <label> Divorced</label>
              </div>
              <div className="mt-4">
                <label className="block">
                  Gender
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type="checkbox"
                  placeholder="Password"
                  className=" px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <label className="pr-4"> Male</label>
                <input
                  type="checkbox"
                  placeholder="Password"
                  className=" px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <label className="pr-4"> Female</label>
                <input
                  type="checkbox"
                  placeholder="Password"
                  className=" px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <label> Other</label>
              </div>
              <div className="mt-4">
                <label className="block">
                  Date of Birth
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  id="birthday"
                  name="birthday"
                  placeholder="DD/MM/YYYY"
                ></input>
              </div>

              <div className="flex">
                <button className="w-full px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
                  Add Member
                </button>
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
            </div>
          </form>
        </div>
      </div>
    </>
  ) : (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="px-8 py-6 mx-4 mt-4 text-left bg-white shadow-lg md:w-1/3 lg:w-1/3 sm:w-1/3">
          <div className="flex justify-center"></div>
          <h3 className="text-2xl font-bold text-center">
            Enter Your Phone Number
          </h3>
          <form action="">
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
                  onClick={otpButtonHandler}
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
