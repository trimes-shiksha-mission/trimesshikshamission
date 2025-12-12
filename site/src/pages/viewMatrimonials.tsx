import React, { useState, useMemo } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { api } from '~/utils/api'
import { Layout } from '~/components/Layout'
import { getServerAuthSession } from '~/server/auth'
import { FiEye, FiX, FiFilter } from 'react-icons/fi'
import { MarriageProfile } from '@prisma/client'

export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getServerAuthSession(ctx)
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }
  return { props: {} }
}

interface Filters {
  name: string
  parentsContact: string
  dob: string
  annualIncome: string
  address: string
}

const ViewMatrimonials: NextPage = () => {
  const [selectedProfile, setSelectedProfile] = useState<MarriageProfile | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    name: '',
    parentsContact: '',
    dob: '',
    annualIncome: '',
    address: ''
  })

  const { data: matrimonials, isLoading } =
    api.marriageProfile.getMarriageProfiles.useQuery({
      page: 1,
      limit: 100
    })

  // Filter the data based on filter inputs
  const filteredData = useMemo(() => {
    if (!matrimonials?.data) return []
    
    return matrimonials.data.filter(profile => {
      const nameMatch = profile.name.toLowerCase().includes(filters.name.toLowerCase())
      const contactMatch = profile.parentsContact.toString().includes(filters.parentsContact)
      const dobMatch = filters.dob ? new Date(profile.dob).toLocaleDateString('en-IN').includes(filters.dob) : true
      const incomeMatch = profile.annualIncome.toLowerCase().includes(filters.annualIncome.toLowerCase())
      const addressMatch = profile.address.toLowerCase().includes(filters.address.toLowerCase())
      
      return nameMatch && contactMatch && dobMatch && incomeMatch && addressMatch
    })
  }, [matrimonials?.data, filters])

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const clearFilters = () => {
    setFilters({
      name: '',
      parentsContact: '',
      dob: '',
      annualIncome: '',
      address: ''
    })
  }

  const formatIncome = (income: string) => {
    return income.replace(/_/g, ' ').replace(/TO/g, 'to')
  }

  return (
    <Layout loading={isLoading}>
      <div className="p-6 bg-gradient-to-br from-rose-50 to-pink-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Matrimonial Profiles</h1>
            <p className="text-gray-600">Browse and filter marriage profiles</p>
          </div>

          {/* Filter Toggle Button */}
          <div className="mb-4 flex justify-between items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors shadow-md"
            >
              <FiFilter className="w-4 h-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            {(filters.name || filters.parentsContact || filters.dob || filters.annualIncome || filters.address) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Filters Section */}
          {showFilters && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={filters.name}
                    onChange={(e) => handleFilterChange('name', e.target.value)}
                    placeholder="Search by name..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Parent's Contact</label>
                  <input
                    type="text"
                    value={filters.parentsContact}
                    onChange={(e) => handleFilterChange('parentsContact', e.target.value)}
                    placeholder="Search by contact..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="text"
                    value={filters.dob}
                    onChange={(e) => handleFilterChange('dob', e.target.value)}
                    placeholder="DD/MM/YYYY"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income</label>
                  <input
                    type="text"
                    value={filters.annualIncome}
                    onChange={(e) => handleFilterChange('annualIncome', e.target.value)}
                    placeholder="Search by income..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={filters.address}
                    onChange={(e) => handleFilterChange('address', e.target.value)}
                    placeholder="Search by address..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredData.length} of {matrimonials?.data.length || 0} profiles
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-rose-500 to-pink-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Sr. No.
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Parent's Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Date of Birth
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Annual Income
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        No profiles found matching your filters
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((profile, index) => (
                      <tr key={profile.id} className="hover:bg-rose-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {profile.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {profile.parentsContact.toString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(profile.dob).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatIncome(profile.annualIncome)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {profile.address}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => setSelectedProfile(profile)}
                            className="inline-flex items-center justify-center p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="View Details"
                          >
                            <FiEye className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Profile Details */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-4 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white">Profile Details</h2>
              <button
                onClick={() => setSelectedProfile(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <FiX className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div className="border-l-4 border-rose-400 pl-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-gray-900 font-medium">{selectedProfile.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Gender</label>
                    <p className="text-gray-900 font-medium capitalize">{selectedProfile.gender}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                    <p className="text-gray-900 font-medium">
                      {new Date(selectedProfile.dob).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Birth Place</label>
                    <p className="text-gray-900 font-medium">{selectedProfile.birthPlace}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Height</label>
                    <p className="text-gray-900 font-medium">{selectedProfile.height}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Blood Group</label>
                    <p className="text-gray-900 font-medium">{selectedProfile.bloodGroup.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Complexion</label>
                    <p className="text-gray-900 font-medium">{selectedProfile.complexion || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Marital Status</label>
                    <p className="text-gray-900 font-medium capitalize">{selectedProfile.maritalStatus}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Manglic</label>
                    <p className="text-gray-900 font-medium">{selectedProfile.manglic ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="border-l-4 border-blue-400 pl-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Location Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Native Place</label>
                    <p className="text-gray-900 font-medium">{selectedProfile.nativePlace}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Current City</label>
                    <p className="text-gray-900 font-medium">{selectedProfile.currentCity}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-gray-900 font-medium">{selectedProfile.address}</p>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="border-l-4 border-green-400 pl-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Professional Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Qualification</label>
                    <p className="text-gray-900 font-medium">{selectedProfile.qualification}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Current Job Profile</label>
                    <p className="text-gray-900 font-medium">{selectedProfile.currentJobProfile || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Annual Income</label>
                    <p className="text-gray-900 font-medium">{formatIncome(selectedProfile.annualIncome)}</p>
                  </div>
                </div>
              </div>

              {/* Family Information */}
              <div className="border-l-4 border-purple-400 pl-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Family Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Father's Name</label>
                    <p className="text-gray-900 font-medium">{selectedProfile.fatherName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Father's Occupation</label>
                    <p className="text-gray-900 font-medium">{selectedProfile.fatherOccupation}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Mother's Name</label>
                    <p className="text-gray-900 font-medium">{selectedProfile.motherName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Mother's Occupation</label>
                    <p className="text-gray-900 font-medium">{selectedProfile.motherOccupation}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Parent's Contact</label>
                    <p className="text-gray-900 font-medium">{selectedProfile.parentsContact.toString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end rounded-b-2xl border-t">
              <button
                onClick={() => setSelectedProfile(null)}
                className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default ViewMatrimonials
