import { DeleteOutlined } from '@ant-design/icons'
import { Button, Form, Input, message, Modal, Row, Table } from 'antd'
import { NextPage } from 'next'
import { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { Editor } from '../components/Editor'
import { ProtectedRoute } from '../components/ProtectedRoute'

const Editorial: NextPage = () => {
  const { mutateAsync: addEditorial, isLoading: addEditorialLoading } =
    useMutation(async (editorial: { title: string; body: string }) => {
      try {
        const res = await fetch('/api/editorial', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(editorial)
        })
        message.success('Editorial added successfully')
      } catch (error) {
        message.error((error as any).message)
      }
    })
  const {
    data: editorials,
    isLoading: getEditorialLoading,
    refetch
  } = useQuery('editorial', async () => {
    const res = await fetch('/api/editorial')
    const data = await res.json()
    if (data.error) {
      return []
    }
    return data
  })

  const { mutateAsync: deleteEditorial, isLoading: deleteEditorialLoading } =
    useMutation(async id => {
      try {
        await fetch('/api/editorial', {
          method: 'DELETE',
          body: JSON.stringify({ id }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        message.success('Editorial deleted successfully')
      } catch (error) {
        message.error((error as any).message)
      }
    })

  const [addEditorialModal, setAddEditorialModal] = useState(false)
  const [editorValue, setEditorValue] = useState('')

  if (getEditorialLoading) {
    return <div>Loading...</div>
  }
  return (
    <ProtectedRoute role={['SUPERUSER']}>
      <Row>
        <Button onClick={() => setAddEditorialModal(true)}>Add New</Button>
      </Row>

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
            title: 'Action',
            render: (_, row) => (
              <Button
                onClick={async () => {
                  await deleteEditorial(row.id)
                }}
                loading={deleteEditorialLoading}
              >
                <DeleteOutlined style={{ color: 'red' }} />
              </Button>
            )
          }
        ]}
        dataSource={
          editorials?.map((editorial: any, index: number) => ({
            ...editorial,
            sr: index + 1
          })) as any[] | []
        }
        rowKey="sr"
      />

      <Modal
        open={addEditorialModal}
        maskClosable
        onCancel={() => setAddEditorialModal(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={async values => {
            await addEditorial({
              title: values.title,
              body: editorValue
            })
            await refetch()
          }}
        >
          <Form.Item label="Title:" name="title" rules={[{ required: true }]}>
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Content:">
            <Editor
              key={'editorial'}
              placeholder={'Write something...'}
              editorHtml={editorValue}
              setEditorHtml={setEditorValue}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={addEditorialLoading}
            >
              Add
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </ProtectedRoute>
  )
}

export default Editorial
