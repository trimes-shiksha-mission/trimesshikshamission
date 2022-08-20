import { DeleteOutlined, InboxOutlined } from '@ant-design/icons'
import { Blog } from '@prisma/client'
import { Button, Form, Input, message, Modal, Space, Table, Upload } from 'antd'
// import FormData from 'form-data'
import { NextPage } from 'next'
import { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { ProtectedRoute } from '../components/ProtectedRoute'

const Student: NextPage = () => {
  const [newsModal, setNewsModal] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const { mutateAsync: createNews, isLoading: createNewsLoading } = useMutation(
    async (studentData: any) => {
      const formData = new FormData()
      formData.append('title', studentData.title)
      formData.append('body', studentData.body)
      formData.append('type', 'STUDENT')
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i], files[i].name)
      }

      await fetch('/api/blogs', {
        method: 'POST',
        body: formData
      })
      setFiles([])
      message.success('News added successfully')
    }
  )

  const { mutateAsync: deleteNews, isLoading: deleteLoading } = useMutation(
    async id => {
      await fetch(`/api/blogs?id=${id}`, {
        method: 'DELETE'
      })
      message.success('News deleted successfully')
    }
  )

  const { data: news, refetch } = useQuery('news', async () => {
    const data = await fetch('/api/blogs?type=STUDENT', {
      method: 'GET'
    })
    return await data.json()
  })
  return (
    <ProtectedRoute>
      <h1>Student Portal</h1>
      <Button
        onClick={() => {
          setNewsModal(true)
        }}
      >
        Add News
      </Button>

      <Table
        columns={[
          {
            title: 'Sr. No.',
            dataIndex: 'sr'
          },
          {
            title: 'Title',
            dataIndex: 'title'
          },
          {
            title: 'Created At',
            render: (_, row) => new Date(row.createdAt).toLocaleString()
          },
          {
            title: 'Created By',
            dataIndex: 'createdBy',
            render: (_, row) => row.createdBy.name
          },
          {
            title: 'Actions',
            render: (_, row) => (
              <Space>
                <Button
                  loading={deleteLoading}
                  onClick={async () => {
                    await deleteNews(row.id)
                    await refetch()
                  }}
                >
                  <DeleteOutlined />
                </Button>
              </Space>
            )
          }
        ]}
        dataSource={news?.map((news: Blog, index: number) => ({
          ...news,
          sr: index + 1
        }))}
        rowKey="sr"
      />

      <Modal
        visible={newsModal}
        onCancel={() => setNewsModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          onFinish={async values => {
            await createNews(values)
            await refetch()
            setNewsModal(false)
          }}
          layout={'vertical'}
        >
          <Form.Item label="Title" name="title">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Content" name="body">
            <Input.TextArea />
          </Form.Item>

          <Upload.Dragger
            accept=".png, .jpg, .jpeg"
            maxCount={3}
            multiple={true}
            customRequest={(e: any) => {
              if (e && e.file) {
                setFiles([...files, e.file])
                e.onSuccess('ok')
                return
              }
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibit from
              uploading company data or other band files
            </p>
          </Upload.Dragger>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={createNewsLoading}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </ProtectedRoute>
  )
}
export default Student
