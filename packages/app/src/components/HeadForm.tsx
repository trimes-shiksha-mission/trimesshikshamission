import { FC } from 'react'

export const HeadForm: FC = () => {
  return (
    <div>
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-xl text-semibold">Head Info</h1>
        <form className="" onChange={e => console.log(e.currentTarget)}>
          <div className="grid grid-cols-2">
            <label htmlFor="firstname">Firstname</label>
            <input className="border mt-2" name="firstname" required></input>
            <label htmlFor="lastname">Lastname</label>
            <input className="border mt-2" name="lastname" required></input>
            <label htmlFor="contact">Contact</label>
            <input
              className="border mt-2"
              name="Contact"
              type="number"
              required
            ></input>
            <label htmlFor="qualification">Qualification</label>
            <input
              className="border mt-2"
              name="qualification"
              required
            ></input>
            <label htmlFor="occupation">Occupation</label>
            <input className="border mt-2" name="occupation" required></input>
            <label htmlFor="age">Age</label>
            <input
              className="border mt-2"
              name="age"
              type="number"
              min="0"
              max="100"
              required
            ></input>
            <label htmlFor="gender">Gender</label>
            <select className="mt-2" name="gender" required>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Others</option>
            </select>
            <label htmlFor="currAddress">Current Address</label>
            <input className="border mt-2" name="currAddress" required></input>
            <label htmlFor="addressType">Address Type</label>
            <select className="mt-2" name="addressType" required>
              <option value="tenant">Tenant</option>
              <option value="private">Private Property</option>
            </select>
            <label htmlFor="nativeTown">Native Town</label>
            <input className="border mt-2" name="nativeTown" required></input>
            <label htmlFor="tribe">Tribe(gautra)</label>
            <input className="border mt-2" name="tribe" required></input>
          </div>
        </form>
      </div>
    </div>
  )
}
