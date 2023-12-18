import { DeleteOutlined, EyeOutlined, FileAddOutlined } from '@ant-design/icons'
import { Button, Form, Input, Modal, Space, Table } from 'antd'
import dynamic from 'next/dynamic'
import { FC, useState } from 'react'
import { useMessageApi } from '~/context/messageApi'
import { RouterOutputs, api } from '~/utils/api'

const Editor = dynamic(() => import('~/components/Editor/Editor'), {
  ssr: false
})

export const Blog: FC<{ type: string }> = ({ type }) => {
  const messageApi = useMessageApi()
  const [addBlogModal, setAddBlogModal] = useState(false)
  const [previewModal, setPreviewModal] = useState<
    RouterOutputs['blogs']['getAll']['blogs'][0] | null
  >(null)
  const [variables, setVariables] = useState({
    page: 1,
    limit: 10
  })

  const {
    data: blogs,
    isLoading: getBlogsLoading,
    refetch
  } = api.blogs.getAll.useQuery({
    type,
    ...variables
  })

  const { mutateAsync: createBlog, isLoading: createBlogLoading } =
    api.blogs.createOne.useMutation()
  const { mutateAsync: deleteBlog, isLoading: deleteBlogLoading } =
    api.blogs.deleteOne.useMutation()

  return (
    <div>
      <Button
        icon={<FileAddOutlined />}
        className="mb-2"
        onClick={() => setAddBlogModal(true)}
      >
        Create
      </Button>

      <Table
        dataSource={blogs?.blogs}
        loading={getBlogsLoading}
        rowKey="id"
        pagination={{
          current: variables.page,
          pageSize: variables.limit,
          total: blogs?.count,
          onChange: (page, limit) => {
            setVariables({
              page,
              limit
            })
          }
        }}
        columns={[
          {
            title: 'Title',
            dataIndex: 'title'
          },
          {
            title: 'Created By',
            render: (_, row) => row.createdBy.name
          },
          {
            title: 'Created At',
            dataIndex: 'createdAt',
            render: value => new Date(value).toLocaleString()
          },
          {
            title: 'Action',
            render: (_, record) => (
              <Space>
                <Button
                  onClick={() => setPreviewModal(record)}
                  icon={<EyeOutlined />}
                />
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={async () => {
                    await deleteBlog(record.id)
                    messageApi.success(`${type} deleted successfully`)
                    await refetch()
                  }}
                  loading={deleteBlogLoading}
                />
              </Space>
            )
          }
        ]}
      />

      <Modal
        open={addBlogModal}
        maskClosable
        onCancel={() => setAddBlogModal(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={async values => {
            if (!values.body || !values.title) {
              return messageApi.error('Please fill all the fields')
            }
            await createBlog({
              type,
              body: values.body,
              title: values.title
            })
            setAddBlogModal(false)
            messageApi.success(`${type} added successfully`)
            return await refetch()
          }}
        >
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Content" name="body" rules={[{ required: true }]}>
            <Editor type={type} placeholder={'Write something...'} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={createBlogLoading}
            >
              Add
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={!!previewModal}
        footer={null}
        onCancel={() => setPreviewModal(null)}
      >
        <h1>{previewModal?.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: previewModal?.body || '' }} />
      </Modal>
    </div>
  )
}
