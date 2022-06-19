import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import 'react-quill/dist/quill.snow.css'
import { fetchJson } from '../lib/fetchJson'
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
        onClick={async () => {
          if (!editorialContent) return
          await fetchJson('/api/editorial', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              editorialContent
            })
          })
        }}
      >
        Save
      </button>
    </div>
  )
}

export default Admin
