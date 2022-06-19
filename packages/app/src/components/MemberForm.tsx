import { FC, useState } from 'react'

export const MemberForm: FC<{ memberNumber: number }> = ({ memberNumber }) => {
  const [addressSame, setAddressSame] = useState(false)
  return (
    <div className="flex flex-col justify-center items-center mt-4 border-b-2">
      <h1>{`Member ${memberNumber}`}</h1>
      <form>
        <div className="grid grid-cols-2">
          <label htmlFor="firstname">Firstname</label>
          <input className="border mt-2" name="firstname" required></input>
          <label htmlFor="lastname">Lastname</label>
          <input className="border mt-2" name="lastname" required></input>
          <label htmlFor="contact">Contact</label>
          <input className="border mt-2" name="Contact" type="number"></input>
          <label htmlFor="qualification">Qualification</label>
          <input className="border mt-2" name="qualification" required></input>
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
          <select name="gender" required>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Others</option>
          </select>
          <label htmlFor="SameAsHead">Same as head</label>
          <input
            className="border mt-2"
            type="checkbox"
            onChange={e => setAddressSame(e.target.checked)}
          ></input>
          {!addressSame && (
            <>
              <label htmlFor="currAddress">Current Address</label>
              <input
                className="border mt-2"
                name="currAddress"
                required
              ></input>
            </>
          )}
        </div>
      </form>
    </div>
  )
}
