import React, { useState } from 'react'
import { FiUser, FiMapPin, FiBriefcase, FiHeart } from 'react-icons/fi'
import { Layout } from '~/components/Layout'
import { NextPage } from 'next'
import { api } from '~/utils/api'
import {
  BloodGroup,
  Complexion,
  Gender,
  IncomeBracket,
  MaritalStatus
} from '@prisma/client'
import router from 'next/router'

const MarriageProfileForm: NextPage = () => {
  // ? Interfaces
  interface Siblings {
    name: string
    age: number
    occupation: string
    maritalStatus: MaritalStatus
  }

  interface FormData {
    name: string
    nativePlace: string
    currentCity: string
    height: string
    bloodGroup: BloodGroup
    complexion: Complexion
    dob: string
    birthPlace: string
    qualification: string
    currentJobProfile: string
    annualIncome: IncomeBracket
    fatherName: string
    fatherOccupation: string
    motherName: string
    motherOccupation: string
    siblings: Siblings[]
    parentsContact: string
    address: string
    manglic: boolean
    maritalStatus: MaritalStatus
    gender: Gender
  }

  // ? Predefined Arrays
  const bloodGroups = [
    'A_Positive',
    'A_Negative',
    'B_Positive',
    'B_Negative',
    'AB_Positive',
    'AB_Negative',
    'O_Positive',
    'O_Negative'
  ]
  const complexions = ['Fair', 'Dark', 'Wheatish']
  const incomeBrackets = [
    'BELOW_3_LAKHS',
    'Three_TO_Five_LAKHS',
    'Five_TO_Ten_LAKHS',
    'Ten_TO_Fifteen_LAKHS',
    'Fifteen_TO_TwentyFive_LAKHS',
    'ABOVE_25_LAKHS'
  ]
  const maritalStatuses = ['unmarried', 'divorced', 'widowed', 'married']
  const genders = ['male', 'female', 'other']

  // ? useStates
  const [formData, setFormData] = useState<FormData>({
    name: '',
    nativePlace: '',
    currentCity: '',
    height: '',
    bloodGroup: BloodGroup.AB_Negative,
    complexion: Complexion.Fair,
    dob: '',
    birthPlace: '',
    qualification: '',
    currentJobProfile: '',
    annualIncome: IncomeBracket.Three_TO_Five_LAKHS,
    fatherName: '',
    fatherOccupation: '',
    motherName: '',
    motherOccupation: '',
    siblings: [],
    parentsContact: '',
    address: '',
    manglic: false,
    maritalStatus: MaritalStatus.unmarried,
    gender: Gender.male
  })

  // const [currentSibling, setCurrentSibling] = useState({
  //   name: '',
  //   age: '',
  //   occupation: '',
  //   maritalStatus: ''
  // })

  // ? Handler Functions
  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // const handleSiblingChange = (e: any) => {
  //   const { name, value } = e.target
  //   setCurrentSibling(prev => ({
  //     ...prev,
  //     [name]: value
  //   }))
  // }

  // const addSibling = () => {
  //   if (currentSibling.name && currentSibling.age) {
  //     setFormData(prev => ({
  //       ...prev,
  //       siblings: [
  //         ...prev.siblings,
  //         { ...currentSibling, age: parseInt(currentSibling.age) }
  //       ]
  //     }))
  //     setCurrentSibling({
  //       name: '',
  //       age: '',
  //       occupation: '',
  //       maritalStatus: ''
  //     })
  //   }
  // }

  // const removeSibling = (index: any) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     siblings: prev.siblings.filter((_, i) => i !== index)
  //   }))
  // }

  // ? Mutations
  // Add marriage profile mutation
  const { mutateAsync: register } = api.marriageProfile.register.useMutation()

  return (
    <Layout>
      <form
        onSubmit={async e => {
          e.preventDefault()
          console.log(formData, 'Eakansh')
          try {
            const response = await register({
              name: formData.name,
              nativePlace: formData.nativePlace,
              currentCity: formData.currentCity,
              height: formData.height,
              bloodGroup: formData.bloodGroup,
              complexion: formData.complexion,
              dob: new Date(formData.dob),
              birthPlace: formData.birthPlace,
              qualification: formData.qualification,
              currentJobProfile: formData.currentJobProfile,
              annualIncome: formData.annualIncome,
              fatherName: formData.fatherName,
              fatherOccupation: formData.fatherOccupation,
              motherName: formData.motherName,
              motherOccupation: formData.motherOccupation,
              // siblings: formData.siblings,
              parentsContact: BigInt(formData.parentsContact) as bigint,
              address: formData.address,
              manglic: formData.manglic,
              maritalStatus: formData.maritalStatus,
              gender: formData.gender
            })

            if (response?.success) {
              router.push('/viewMatrimonials')
            } else {
              console.error('Something went wrong. Please try again.')
            }
          } catch (e) {
            console.log(e)
          }
        }}
      >
        <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-rose-500 to-pink-600 px-8 py-6">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <FiHeart className="w-8 h-8" />
                  Marriage Profile Registration
                </h1>
                <p className="text-rose-100 mt-2">
                  Create your detailed matrimonial profile
                </p>
              </div>

              <div className="p-8 space-y-8">
                <div className="border-l-4 border-rose-400 pl-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                    <FiUser className="w-6 h-6 text-rose-500" />
                    Personal Information
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender *
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Gender</option>
                        {genders.map(gender => (
                          <option key={gender} value={gender}>
                            {gender.charAt(0) + gender.slice(1).toLowerCase()}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Birth Place *
                      </label>
                      <input
                        type="text"
                        name="birthPlace"
                        value={formData.birthPlace}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Height *
                      </label>
                      <input
                        type="text"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        placeholder="e.g., 5'6&quot;"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Blood Group *
                      </label>
                      <select
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Blood Group</option>
                        {bloodGroups.map(bg => (
                          <option key={bg} value={bg}>
                            {bg.replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Complexion
                      </label>
                      <select
                        name="complexion"
                        value={formData.complexion}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      >
                        <option value="">Select Complexion</option>
                        {complexions.map(comp => (
                          <option key={comp} value={comp}>
                            {comp.charAt(0) + comp.slice(1).toLowerCase()}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Marital Status *
                      </label>
                      <select
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Status</option>
                        {maritalStatuses.map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0) + status.slice(1).toLowerCase()}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="manglic"
                        checked={formData.manglic}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Manglic
                      </span>
                    </label>
                  </div>
                </div>

                {/* Location Information */}
                <div className="border-l-4 border-blue-400 pl-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                    <FiMapPin className="w-6 h-6 text-blue-500" />
                    Location Details
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Native Place *
                      </label>
                      <input
                        type="text"
                        name="nativePlace"
                        value={formData.nativePlace}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current City *
                      </label>
                      <input
                        type="text"
                        name="currentCity"
                        value={formData.currentCity}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Professional Information */}
                <div className="border-l-4 border-green-400 pl-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                    <FiBriefcase className="w-6 h-6 text-green-500" />
                    Professional Details
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Qualification *
                      </label>
                      <input
                        type="text"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Job Profile
                      </label>
                      <input
                        type="text"
                        name="currentJobProfile"
                        value={formData.currentJobProfile}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Annual Income *
                      </label>
                      <select
                        name="annualIncome"
                        value={formData.annualIncome}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Income Range</option>
                        {incomeBrackets.map(income => (
                          <option key={income} value={income}>
                            {income
                              .replace(/_/g, ' ')
                              .toLowerCase()
                              .replace(/\b\w/g, l => l.toUpperCase())}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Family Information */}
                <div className="border-l-4 border-purple-400 pl-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    Family Details
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fathers Name *
                      </label>
                      <input
                        type="text"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fathers Occupation *
                      </label>
                      <input
                        type="text"
                        name="fatherOccupation"
                        value={formData.fatherOccupation}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mothers Name *
                      </label>
                      <input
                        type="text"
                        name="motherName"
                        value={formData.motherName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mothers Occupation *
                      </label>
                      <input
                        type="text"
                        name="motherOccupation"
                        value={formData.motherOccupation}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parents Contact *
                      </label>
                      <input
                        type="tel"
                        name="parentsContact"
                        value={formData.parentsContact}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  {/* <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Siblings Information
                    </h3>

                    <div className="bg-gray-50 p-6 rounded-lg mb-4">
                      <h4 className="font-medium text-gray-700 mb-4">
                        Add Sibling
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="name"
                          placeholder="Sibling Name"
                          value={currentSibling.name}
                          onChange={handleSiblingChange}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          name="age"
                          placeholder="Age"
                          value={currentSibling.age}
                          onChange={handleSiblingChange}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          name="occupation"
                          placeholder="Occupation"
                          value={currentSibling.occupation}
                          onChange={handleSiblingChange}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <select
                          name="maritalStatus"
                          value={currentSibling.maritalStatus}
                          onChange={handleSiblingChange}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                         {maritalStatuses.map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0) + status.slice(1).toLowerCase()}
                          </option>
                        ))}

                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={addSibling}
                        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Add Sibling
                      </button>
                    </div>

                    {formData.siblings.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-700">
                          Added Siblings:
                        </h4>
                        {formData.siblings.map((sibling, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-white p-4 rounded-lg border"
                          >
                            <div>
                              <span className="font-medium">
                                {sibling.name}
                              </span>{' '}
                              -
                              <span className="text-gray-600">
                                {' '}
                                Age: {sibling.age}
                              </span>
                              {sibling.occupation && (
                                <span className="text-gray-600">
                                  , {sibling.occupation}
                                </span>
                              )}
                              {sibling.maritalStatus && (
                                <span className="text-gray-600">
                                  , {sibling.maritalStatus}
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeSibling(index)}
                              className="text-red-600 hover:text-red-800 font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div> */}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-8">
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-lg hover:from-rose-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Create Marriage Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Layout>
  )
}

export default MarriageProfileForm
