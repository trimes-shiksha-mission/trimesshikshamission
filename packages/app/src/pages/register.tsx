import { NextPage } from 'next'
import { useState } from 'react'
import { HeadForm } from '../components/HeadForm'
import { MemberForm } from '../components/MemberForm'

const Register: NextPage = () => {
  const [members, addMembers] = useState(0)

  return (
    <div className="">
      <HeadForm />

      {[...Array(members).keys()].map(i => (
        <MemberForm memberNumber={i + 1} key={i} />
      ))}
      <div className="flex justify-center items-center space-x-2 mt-4 mb-8">
        <button
          className="bg-blue-700 text-white p-2 text-base text-center "
          onClick={() => {
            addMembers(members + 1)
          }}
        >
          + Add Member
        </button>
        {members > 0 && (
          <button
            className="bg-blue-700 text-white p-2 text-base text-center "
            onClick={() => {
              addMembers(members - 1)
            }}
          >
            - Delete Member
          </button>
        )}
        <button className="bg-blue-400 p-2 text-white" type="submit">
          Submit
        </button>
      </div>
    </div>
  )
}

export default Register
