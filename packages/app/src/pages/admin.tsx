import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import 'react-quill/dist/quill.snow.css'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

const Admin: NextPage = () => {
  const [editorialContent, setEditorialContent] = useState('')

  return (
    <div className="border h-[500px] w-full px-28 py-8">
      <ReactQuill
        onBlur={(_val, _src, stx) => setEditorialContent(stx.getHTML())}
        value={editorialContent}
        onChange={val => setEditorialContent(val)}
      />

      <button
        type="submit"
        className="p-2 bg-blue-600 text-white px-4 rounded-lg mt-4"
        onClick={async () => {}}
      >
        Save
      </button>
    </div>
  )
}

export default Admin
