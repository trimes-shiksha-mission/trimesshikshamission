import React, { useState, useRef } from 'react'
import { FiUser, FiMapPin, FiBriefcase, FiHeart, FiCamera, FiX, FiTrash } from 'react-icons/fi'
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
import { toast } from 'react-toastify'

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
    profilePhoto: string
    themeColor: string
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
  const themeColors = [
    { value: 'rose', label: 'Rose', preview: 'from-rose-500 to-pink-600' },
    { value: 'purple', label: 'Purple', preview: 'from-purple-500 to-indigo-600' },
    { value: 'blue', label: 'Blue', preview: 'from-blue-500 to-cyan-600' }
  ]
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

  // ? Mutations & Queries
  const { mutateAsync: register } = api.marriageProfile.register.useMutation()
  const { mutateAsync: update } = api.marriageProfile.update.useMutation()
  const { mutateAsync: deleteProfile } = api.marriageProfile.delete.useMutation()
  const { data: myProfiles, refetch: refetchProfiles } = api.marriageProfile.getUserProfiles.useQuery()

  // ? useStates
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
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
    gender: Gender.male,
    profilePhoto: '',
    themeColor: 'rose'
  })

  // ? Handler Functions
  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (512KB = 524288 bytes)
    if (file.size > 524288) {
      toast.error('Photo size must be 512KB or less')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    setPhotoFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleRemovePhoto = () => {
    setPhotoFile(null)
    setPhotoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this profile? This action cannot be undone.')) {
      try {
        await deleteProfile({ id })
        toast.success('Profile deleted successfully')
        refetchProfiles()
      } catch (error) {
        toast.error('Failed to delete profile')
        console.error(error)
      }
    }
  }

  const uploadPhoto = async (): Promise<string | null> => {
    if (!photoFile) return formData.profilePhoto || null

    setUploadingPhoto(true)
    try {
      const formDataToUpload = new FormData()
      formDataToUpload.append('file', photoFile)
      formDataToUpload.append('type', 'marriage-profiles')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataToUpload
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Upload failed')
      }

      const data = await response.json()
      return data.attachments?.[0]?.url || null
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload photo')
      return null
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleEdit = (profile: any) => {
    setFormData({
      name: profile.name,
      nativePlace: profile.nativePlace,
      currentCity: profile.currentCity,
      height: profile.height,
      bloodGroup: profile.bloodGroup,
      complexion: profile.complexion || Complexion.Fair,
      dob: new Date(profile.dob).toISOString().split('T')[0] ?? '',
      birthPlace: profile.birthPlace,
      qualification: profile.qualification,
      currentJobProfile: profile.currentJobProfile || '',
      annualIncome: profile.annualIncome,
      fatherName: profile.fatherName,
      fatherOccupation: profile.fatherOccupation,
      motherName: profile.motherName,
      motherOccupation: profile.motherOccupation,
      siblings: profile.siblings || [],
      parentsContact: profile.parentsContact.toString(),
      address: profile.address,
      manglic: profile.manglic,
      maritalStatus: profile.maritalStatus,
      gender: profile.gender,
      profilePhoto: profile.profilePhoto || '',
      themeColor: profile.themeColor || 'rose'
    })
    setPhotoPreview(profile.profilePhoto || null)
    setPhotoFile(null)
    setEditId(profile.id)
    setShowForm(true)
  }

  const handleAddNew = () => {
    setFormData({
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
      gender: Gender.male,
      profilePhoto: '',
      themeColor: 'rose'
    })
    setPhotoPreview(null)
    setPhotoFile(null)
    setEditId(null)
    setShowForm(true)
  }

  // List View
  if (!showForm && myProfiles && myProfiles.length > 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">My Marriage Profiles</h1>
              <button
                onClick={handleAddNew}
                className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors shadow-md"
              >
                Add New Profile
              </button>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {myProfiles.map((profile) => (
                <div key={profile.id} className="bg-white p-6 rounded-xl shadow-md border border-rose-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">{profile.name}</h2>
                      <p className="text-rose-500 text-sm font-medium">{profile.currentJobProfile}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      profile.gender === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                    }`}>
                      {profile.gender}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-gray-600 text-sm mb-6">
                    <div className="flex items-center gap-2">
                      <FiUser className="w-4 h-4" />
                      <span>{new Date().getFullYear() - new Date(profile.dob).getFullYear()} years old</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiMapPin className="w-4 h-4" />
                      <span>{profile.currentCity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiHeart className="w-4 h-4" />
                      <span>{profile.maritalStatus}</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => handleEdit(profile)}
                      className="flex-1 py-2 border-2 border-rose-500 text-rose-600 rounded-lg hover:bg-rose-50 transition-colors font-medium"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={() => handleDelete(profile.id)}
                      className="px-4 py-2 border-2 border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete Profile"
                    >
                      <FiTrash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <form
        onSubmit={async e => {
          e.preventDefault()
          try {
            // Upload photo first if there's a new one
            const photoUrl = await uploadPhoto()
            
            const payload = {
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
              gender: formData.gender,
              profilePhoto: photoUrl || undefined,
              themeColor: formData.themeColor
            }

            let response;
            if (editId) {
              response = await update({
                id: editId,
                data: payload
              })
            } else {
              response = await register(payload)
            }

            if (response?.success) {
              toast.success(editId ? 'Profile updated successfully!' : 'Marriage Profile created Successfully!')
              setShowForm(false)
              refetchProfiles()
            } else {
              console.error('Something went wrong. Please try again.')
              toast.error('Something went wrong. Please try again.')
            }
          } catch (e) {
            console.log(e)
            toast.error('An error occurred. Please check your inputs.')
          }
        }}
      >
        <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 py-8 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Button if in edit/add mode and profiles exist */}
            {myProfiles && myProfiles.length > 0 && (
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="mb-4 text-rose-600 hover:text-rose-800 font-medium flex items-center gap-2 transition-colors"
              >
                ← Back to Profiles
              </button>
            )}
            
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-rose-500 to-pink-600 px-8 py-6">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <FiHeart className="w-8 h-8" />
                  {editId ? 'Edit Marriage Profile' : 'Marriage Profile Registration'}
                </h1>
                <p className="text-rose-100 mt-2">
                  {editId ? 'Update your matrimonial profile details' : 'Create your detailed matrimonial profile'}
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

                {/* Profile Photo Section */}
                <div className="border-l-4 border-pink-400 pl-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                    <FiCamera className="w-6 h-6 text-pink-500" />
                    Profile Photo
                  </h2>

                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Upload a profile photo (Maximum size: 512KB)
                    </p>

                    {photoPreview ? (
                      <div className="relative inline-block">
                        <img
                          src={photoPreview}
                          alt="Profile preview"
                          className="w-40 h-40 object-cover rounded-lg border-2 border-pink-200 shadow-md"
                        />
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-40 h-40 border-2 border-dashed border-pink-300 rounded-lg bg-pink-50">
                        <FiCamera className="w-12 h-12 text-pink-300" />
                      </div>
                    )}

                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                        id="profile-photo-input"
                      />
                      <label
                        htmlFor="profile-photo-input"
                        className="inline-block px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors cursor-pointer shadow-md"
                      >
                        {photoPreview ? 'Change Photo' : 'Upload Photo'}
                      </label>
                      {uploadingPhoto && (
                        <span className="ml-3 text-sm text-pink-600">
                          Uploading...
                        </span>
                      )}
                    </div>
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
                </div>
              </div>

              {/* Theme Selection */}
              <div className="border-l-4 border-indigo-400 pl-6 mt-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <FiHeart className="w-6 h-6 text-indigo-500" />
                  Profile Theme
                </h2>
                <p className="text-gray-600 mb-4 text-sm">
                  Choose a color theme for your public profile card.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {themeColors.map(theme => (
                    <label
                      key={theme.value}
                      className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 ${
                        formData.themeColor === theme.value
                          ? 'border-indigo-500 bg-indigo-50 shadow-md transform scale-105'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div
                          className={`h-16 w-full rounded-lg bg-gradient-to-r ${theme.preview} shadow-sm`}
                        />
                        <div className="flex items-center justify-between w-full px-2">
                          <span className="font-semibold text-gray-700">
                            {theme.label}
                          </span>
                          <input
                            type="radio"
                            name="themeColor"
                            value={theme.value}
                            checked={formData.themeColor === theme.value}
                            onChange={handleInputChange}
                            className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-8">
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-lg hover:from-rose-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  {editId ? 'Update Marriage Profile' : 'Create Marriage Profile'}
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
