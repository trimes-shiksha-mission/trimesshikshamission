import { NextPage } from 'next'
import { Layout } from '~/components/Layout'

const matrimonial: NextPage = () => {
  return (
    <Layout>
      <h1>Matrimonial</h1>
      <div className="flex items-center justify-center py-24 bg-gray-100">
        <div className="px-8 py-6 mx-4 mt-4 text-left bg-white shadow-lg md:w-1/3 lg:w-1/3 sm:w-1/3">
          <div className="flex justify-center"></div>
          <h3 className="text-2xl font-bold text-center">
            Please Enter your personal Details
          </h3>
          <form
          onSubmit={async e=>{
            e.preventDefault()
          }}>
            <div className="mt-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Name
              </label>
              <input
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Name"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Native place
              </label>
              <input
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Native Place"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Current City
              </label>
              <input
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Current City"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Height (inches)
              </label>
              <input
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Height"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Blood Group
              </label>
              <input
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Blood Group"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Complexion
              </label>
              <input
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Complexion"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Dietary Habits
              </label>
              <select
                id="dietaryHabits"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option selected>choose dietary habit</option>
                <option value="veg">Vegetarian</option>
                <option value="non-veg">Non-Vegetarian</option>
                <option value="vegna">Vegan</option>
              </select>
            </div>
            <div className="mt-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Habits
              </label>
              <input
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Habits"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Date of Birth
              </label>
              <input
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="date"
                placeholder="Habits"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Birth Place
              </label>
              <input
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Birth Place"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Religion
              </label>
              <input
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Religion"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Caste
              </label>
              <input
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Caste"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Graduation (if any)
              </label>
              <input
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Graduation"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Post-Graduation (if any)
              </label>
              <input
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Post-Graduation"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Current Job Profile
              </label>
              <input
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Current Job Profile"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Father Name
              </label>
              <input
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Father Name"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Fathers Occupation
              </label>
              <input
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Father's Occupation"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Mother Name
              </label>
              <input
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Mother Name"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Mothers Occupation
              </label>
              <input
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Mothers's Occupation"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Sibling Name (if any)
              </label>
              <input
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Mothers's Occupation"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Phone Number
              </label>
              <input
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="tel"
                placeholder="Phone Number"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Address
              </label>
              <input
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Address"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Mangal Dos
              </label>
              <input
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                type="checkbox"
                placeholder="Address"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Marital Status
              </label>
              <select
                id="dietaryHabits"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option selected>choose your Marital status</option>
                <option value="veg">Single (अविवाहित)</option>
                <option value="non-veg">Divorced (तलाक शुदा)</option>
                <option value="vegna">Widow/Widower</option>
              </select>
            </div>
            <div className="mt-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Upload a picture
              </label>
              <input
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="file"
                placeholder="Profile-Picture"
              />
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default matrimonial
