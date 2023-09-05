// @ts-ignore
import BlotFormatter from 'quill-blot-formatter/dist/BlotFormatter'
import htmlEditButton from 'quill-html-edit-button'
import { FC, useCallback, useMemo, useRef } from 'react'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import CustomImage from './CustomImageFormat'

Quill.register('modules/blotFormatter', BlotFormatter)
Quill.register('modules/htmlEditButton', htmlEditButton)
Quill.register({
  'formats/image': CustomImage
})

const Editor: FC<{
  placeholder?: string
  value?: string
  onChange?: any
  type: string
}> = ({ placeholder, value, onChange, type }) => {
  // const [uploadResource] = useUploadResourceMutation()
  const quillRef = useRef<any>(null)
  const imageHandler = useCallback(() => {
    const input = document.createElement('input')

    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()
    input.onchange = async () => {
      var file: any = input && input.files ? input.files[0] : null
      if (!file) return
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const uploadedUrl = (await res.json())?.attachments?.[0]?.url
      if (!uploadedUrl) return
      let quillObj = quillRef.current.getEditor()
      const range = quillObj.getSelection()
      quillObj.editor.insertEmbed(
        range.index,
        'image',
        uploadedUrl
      )
      const currentValue = quillRef.current.props.value
      quillObj.setSelection(range.index + 2)

      onChange!(
        (currentValue || '') +
        `<img src="${uploadedUrl}" />`
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' }
          ],
          ['link'],
          ['image'],
          [{ color: [] }]
        ],
        handlers: {
          image: imageHandler
        }
      },
      clipboard: {
        matchVisual: false
      },
      blotFormatter: {},
      htmlEditButton: {}
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <div>
      <ReactQuill
        ref={quillRef}
        theme={'snow'}
        onChange={onChange}
        value={value}
        modules={modules}
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
          'image',
          'color',
          'height',
          'width',
          'class',
          'style'
        ]}
        bounds={'.app'}
        placeholder={placeholder}
      />
    </div>
  )
}

export default Editor