import dynamic from 'next/dynamic'
import { Dispatch, FC, SetStateAction } from 'react'
import 'react-quill/dist/quill.snow.css'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

/*
 * Simple editor component that takes placeholder text as a prop
 */
export const Editor: FC<{
  placeholder: string
  editorHtml: string
  setEditorHtml: Dispatch<SetStateAction<string>>
}> = ({ placeholder, editorHtml, setEditorHtml }) => {
  const handleChange = (html: string) => {
    setEditorHtml(html)
  }
  return (
    <div>
      <ReactQuill
        theme={'snow'}
        onChange={handleChange}
        value={editorHtml}
        modules={{
          toolbar: [
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
              { list: 'ordered' },
              { list: 'bullet' },
              { indent: '-1' },
              { indent: '+1' }
            ],
            ['link'],
            [{ color: [] }]
          ],
          clipboard: {
            // toggle to add extra line breaks when pasting HTML:
            matchVisual: false
          }
        }}
        formats={[
          'font',
          'bold',
          'italic',
          'underline',
          'strike',
          'blockquote',
          'list',
          'bullet',
          'indent',
          'link',
          'color'
        ]}
        bounds={'.app'}
        placeholder={placeholder}
      />
    </div>
  )
}
