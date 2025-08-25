import React from 'react'
// import {
  // Search,
  // Filter,
  // ArrowUpDown,
  // ArrowUp,
  // ArrowDown,
  // Eye,
  // Edit,
  // Trash2
// } from 'lucide-react'
import { GetServerSideProps, NextPage } from 'next'
import { api } from '~/utils/api'
import { Layout } from '~/components/Layout'
import { getServerAuthSession } from '~/server/auth'

// Enums based on your Prisma schema
// enum BloodGroup {
//   A_POSITIVE = 'A_POSITIVE',
//   A_NEGATIVE = 'A_NEGATIVE',
//   B_POSITIVE = 'B_POSITIVE',
//   B_NEGATIVE = 'B_NEGATIVE',
//   AB_POSITIVE = 'AB_POSITIVE',
//   AB_NEGATIVE = 'AB_NEGATIVE',
//   O_POSITIVE = 'O_POSITIVE',
//   O_NEGATIVE = 'O_NEGATIVE'
// }

// enum Complexion {
//   FAIR = 'FAIR',
//   WHEATISH = 'WHEATISH',
//   DARK = 'DARK'
// }

// enum IncomeBracket {
//   BELOW_2_LAKHS = 'BELOW_2_LAKHS',
//   RANGE_2_5_LAKHS = 'RANGE_2_5_LAKHS',
//   RANGE_5_10_LAKHS = 'RANGE_5_10_LAKHS',
//   RANGE_10_15_LAKHS = 'RANGE_10_15_LAKHS',
//   RANGE_15_25_LAKHS = 'RANGE_15_25_LAKHS',
//   ABOVE_25_LAKHS = 'ABOVE_25_LAKHS'
// }

// enum MaritalStatus {
//   SINGLE = 'SINGLE',
//   MARRIED = 'MARRIED',
//   DIVORCED = 'DIVORCED',
//   WIDOWED = 'WIDOWED'
// }

// enum Gender {
//   MALE = 'MALE',
//   FEMALE = 'FEMALE',
//   OTHER = 'OTHER'
// }


// Column configuration types
// type ColumnType = 'text' | 'select' | 'date' | 'boolean' | 'number'

// interface Column {
//   key: keyof User
//   label: string
//   type: ColumnType
//   filterable: boolean
//   options?: string[]
// }

// interface SortConfig {
//   key: keyof User | null
//   direction: 'asc' | 'desc'
// }

// interface Filters {
//   [key: string]: string
// }

// // Mock data
// const mockData: User[] = [
//   {
//     id: '123e4567-e89b-12d3-a456-426614174000',
//     name: 'John Doe',
//     nativePlace: 'Mumbai',
//     currentCity: 'Delhi',
//     height: '5\'8"',
//     bloodGroup: BloodGroup.O_POSITIVE,
//     complexion: Complexion.FAIR,
//     dob: '1990-05-15T00:00:00Z',
//     birthPlace: 'Mumbai',
//     qualification: 'B.Tech Computer Science',
//     currentJobProfile: 'Software Engineer',
//     annualIncome: IncomeBracket.RANGE_5_10_LAKHS,
//     fatherName: 'Robert Doe',
//     fatherOccupation: 'Business',
//     motherName: 'Mary Doe',
//     motherOccupation: 'Teacher',
//     parentsContact: BigInt(9876543210),
//     address: '123 Main Street, Delhi',
//     manglic: false,
//     maritalStatus: MaritalStatus.SINGLE,
//     gender: Gender.MALE,
//     createdAt: '2024-01-15T10:30:00Z',
//     updatedAt: '2024-01-15T10:30:00Z'
//   },
//   {
//     id: '456e7890-e89b-12d3-a456-426614174001',
//     name: 'Jane Smith',
//     nativePlace: 'Pune',
//     currentCity: 'Bangalore',
//     height: '5\'4"',
//     bloodGroup: BloodGroup.A_POSITIVE,
//     complexion: Complexion.WHEATISH,
//     dob: '1992-08-22T00:00:00Z',
//     birthPlace: 'Pune',
//     qualification: 'MBA Finance',
//     currentJobProfile: 'Financial Analyst',
//     annualIncome: IncomeBracket.RANGE_10_15_LAKHS,
//     fatherName: 'David Smith',
//     fatherOccupation: 'Doctor',
//     motherName: 'Sarah Smith',
//     motherOccupation: 'Nurse',
//     parentsContact: BigInt(9876543211),
//     address: '456 Park Avenue, Bangalore',
//     manglic: true,
//     maritalStatus: MaritalStatus.SINGLE,
//     gender: Gender.FEMALE,
//     createdAt: '2024-01-16T09:15:00Z',
//     updatedAt: '2024-01-16T09:15:00Z'
//   }
// ]

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

const ViewMatrimonials: NextPage = () => {
  // const [data, setData] = useState<User[]>(mockData)
  // const [filteredData, setFilteredData] = useState<User[]>(mockData)
  // const [searchTerm, setSearchTerm] = useState<string>('')
  // const [sortConfig, setSortConfig] = useState<SortConfig>({
  //   key: null,
  //   direction: 'asc'
  // })
  // const [filters, setFilters] = useState<Filters>({})
  // // const [showFilters, setShowFilters] = useState<boolean>(false)
  // const [currentPage, setCurrentPage] = useState<number>(1)
  // const itemsPerPage = 10

  // // Column definitions with proper typing
  // const columns: Column[] = [
  //   { key: 'name', label: 'Name', type: 'text', filterable: true },
  //   {
  //     key: 'nativePlace',
  //     label: 'Native Place',
  //     type: 'text',
  //     filterable: true
  //   },
  //   {
  //     key: 'currentCity',
  //     label: 'Current City',
  //     type: 'text',
  //     filterable: true
  //   },
  //   { key: 'height', label: 'Height', type: 'text', filterable: false },
  //   {
  //     key: 'bloodGroup',
  //     label: 'Blood Group',
  //     type: 'select',
  //     filterable: true,
  //     options: Object.values(BloodGroup)
  //   },
  //   {
  //     key: 'complexion',
  //     label: 'Complexion',
  //     type: 'select',
  //     filterable: true,
  //     options: Object.values(Complexion)
  //   },
  //   { key: 'dob', label: 'Date of Birth', type: 'date', filterable: true },
  //   {
  //     key: 'qualification',
  //     label: 'Qualification',
  //     type: 'text',
  //     filterable: true
  //   },
  //   {
  //     key: 'currentJobProfile',
  //     label: 'Job Profile',
  //     type: 'text',
  //     filterable: true
  //   },
  //   {
  //     key: 'annualIncome',
  //     label: 'Annual Income',
  //     type: 'select',
  //     filterable: true,
  //     options: Object.values(IncomeBracket)
  //   },
  //   { key: 'fatherName', label: 'Father Name', type: 'text', filterable: true },
  //   { key: 'motherName', label: 'Mother Name', type: 'text', filterable: true },
  //   {
  //     key: 'maritalStatus',
  //     label: 'Marital Status',
  //     type: 'select',
  //     filterable: true,
  //     options: Object.values(MaritalStatus)
  //   },
  //   {
  //     key: 'gender',
  //     label: 'Gender',
  //     type: 'select',
  //     filterable: true,
  //     options: Object.values(Gender)
  //   },
  //   { key: 'manglic', label: 'Manglic', type: 'boolean', filterable: true }
  // ]

  // Apply filters and search
  // useEffect(() => {
  //   let filtered = data.filter(item => {
  //     // Search filter
  //     const searchMatch = Object.values(item).some(value => {
  //       if (typeof value === 'bigint') {
  //         return value.toString().includes(searchTerm)
  //       }
  //       return value
  //         ?.toString()
  //         .toLowerCase()
  //         .includes(searchTerm.toLowerCase())
  //     })

  //     // Column filters
  //     const filterMatch = Object.entries(filters).every(
  //       ([key, filterValue]) => {
  //         if (!filterValue || filterValue === '') return true

  //         const itemValue = item[key as keyof User]

  //         if (typeof itemValue === 'boolean') {
  //           return itemValue.toString() === filterValue
  //         }

  //         if (typeof itemValue === 'bigint') {
  //           return itemValue.toString().includes(filterValue)
  //         }

  //         if (key === 'dob') {
  //           return new Date(itemValue as string)
  //             .toDateString()
  //             .includes(filterValue)
  //         }

  //         return itemValue
  //           ?.toString()
  //           .toLowerCase()
  //           .includes(filterValue.toLowerCase())
  //       }
  //     )

  //     return searchMatch && filterMatch
  //   })

  //   // Apply sorting
  //   if (sortConfig.key) {
  //     filtered.sort((a, b) => {
  //       const aValue = a[sortConfig.key!]
  //       const bValue = b[sortConfig.key!]

  //       // Handle different data types
  //       if (typeof aValue === 'bigint' && typeof bValue === 'bigint') {
  //         const diff = aValue < bValue ? -1 : aValue > bValue ? 1 : 0
  //         return sortConfig.direction === 'asc' ? diff : -diff
  //       }

  //       if (typeof aValue === 'bigint' && typeof bValue === 'bigint') {
  //         const diff = aValue < bValue ? -1 : aValue > bValue ? 1 : 0
  //         return sortConfig.direction === 'asc' ? diff : -diff
  //       }

  //       const aStr = aValue?.toString() || ''
  //       const bStr = bValue?.toString() || ''

  //       if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1
  //       if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1
  //       return 0
  //     })
  //   }

  //   setFilteredData(filtered)
  //   setCurrentPage(1)
  // }, [data, searchTerm, filters, sortConfig])

  // const handleSort = (key: keyof User): void => {
  //   setSortConfig(prev => ({
  //     key,
  //     direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
  //   }))
  // }

  // const handleFilterChange = (key: string, value: string): void => {
  //   setFilters(prev => ({
  //     ...prev,
  //     [key]: value
  //   }))
  // }

  // const clearFilters = (): void => {
  //   setFilters({})
  //   setSearchTerm('')
  // }

  // const formatValue = (value: any, type: ColumnType): string => {
  //   if (value === null || value === undefined) return '-'

  //   switch (type) {
  //     case 'date':
  //       return new Date(value).toLocaleDateString('en-IN')
  //     case 'boolean':
  //       return value ? 'Yes' : 'No'
  //     case 'number':
  //       if (typeof value === 'bigint') {
  //         return value.toString()
  //       }
  //       return value.toString()
  //     default:
  //       return value.toString().replace(/_/g, ' ')
  //   }
  // }

  // const getSortIcon = (key: keyof User): JSX.Element => {
  //   if (sortConfig.key !== key) return <ArrowUpDown className="w-4 h-4" />
  //   return sortConfig.direction === 'asc' ? (
  //     <ArrowUp className="w-4 h-4" />
  //   ) : (
  //     <ArrowDown className="w-4 h-4" />
  //   )
  // }

  // Pagination
  // const paginatedData = useMemo(() => {
  //   const startIndex = (currentPage - 1) * itemsPerPage
  //   return filteredData.slice(startIndex, startIndex + itemsPerPage)
  // }, [filteredData, currentPage])

  // const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Action handlers
  // const handleView = (user: User): void => {
  //   console.log('View user:', user)
  //   // Implement view logic
  // }

  // const handleEdit = (user: User): void => {
  //   console.log('Edit user:', user)
  //   // Implement edit logic
  // }

  // const handleDelete = (userId: string): void => {
  //   console.log('Delete user:', userId)
  //   // Implement delete logic
  // }

  // ? Queries
  const { data: matrionials, isLoading: getMatrimonialsLoading } =
    api.marriageProfile.getMarriageProfiles.useQuery({
      page: 1,
      limit: 10
    })

  return (
    <Layout loading={getMatrimonialsLoading}>
      {/*<div className="p-6 bg-white">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Matrimonial Profiles
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search across all fields..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Clear All
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
              {columns
                .filter(col => col.filterable)
                .map(column => (
                  <div key={column.key} className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      {column.label}
                    </label>
                    {column.type === 'select' ? (
                      <select
                        value={filters[column.key] || ''}
                        onChange={e =>
                          handleFilterChange(column.key, e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="">All</option>
                        {column.options?.map(option => (
                          <option key={option} value={option}>
                            {option.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                    ) : column.type === 'boolean' ? (
                      <select
                        value={filters[column.key] || ''}
                        onChange={e =>
                          handleFilterChange(column.key, e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="">All</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    ) : (
                      <input
                        type={column.type === 'date' ? 'date' : 'text'}
                        value={filters[column.key] || ''}
                        onChange={e =>
                          handleFilterChange(column.key, e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder={`Filter by ${column.label.toLowerCase()}`}
                      />
                    )}
                  </div>
                ))}
            </div>
          )}

          <div className="text-sm text-gray-600 mb-4">
            Showing {paginatedData.length} of {filteredData.length} records
            {filteredData.length !== data.length &&
              ` (filtered from ${data.length} total)`}
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map(column => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {getSortIcon(column.key)}
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map(row => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {columns.map(column => (
                    <td
                      key={column.key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {formatValue(row[column.key], column.type)}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(row)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(row)}
                        className="p-1 text-green-600 hover:text-green-800"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(row.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, currentPage - 2) + i
                if (pageNum <= totalPages) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 text-sm border rounded-md ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                }
                return null
              })}

              <button
                onClick={() =>
                  setCurrentPage(prev => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>*/}
      <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
        <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Sr. No.
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Parents Contact
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Native Place
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Current City
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Height
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Blood Group
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Complexion
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date of Birth
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Qualification
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Current Job Profile
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Annual Income
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Father Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Father Occupation
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Address
                </th>
              </tr>
            </thead>
            <tbody>
              {matrionials?.data.map((matrimonial) => (
                <tr key={matrimonial.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {/* <p className="text-gray-900 whitespace-no-wrap">
                      {index + 1 + (variables.page - 1) * variables.limit}
                    </p> */}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {matrimonial.name}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {matrimonial.parentsContact.toString()}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {matrimonial.nativePlace}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {matrimonial.currentCity}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {matrimonial.height}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {matrimonial.bloodGroup}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {matrimonial.complexion}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {matrimonial.gender}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {matrimonial.dob.toISOString()}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {matrimonial.qualification}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {matrimonial.currentJobProfile}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {matrimonial.annualIncome}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {matrimonial.fatherName}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {matrimonial.fatherOccupation}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {matrimonial.address}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}

export default ViewMatrimonials
