import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import {
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table
} from 'antd'
import { NextPage } from 'next'
import { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import useUser from '../../lib/useUser'

const Editors: NextPage = () => {
  const [addEditorModal, setAddEditorModal] = useState(false)
  const [editEditorModal, setEditEditorModal] = useState('')
  const {
    data: editors,
    isLoading,
    refetch
  } = useQuery('editors', async () => {
    const res = await fetch('/api/editors')
    const data = await res.json()
    if (data.error) {
      return []
    }
    return data
  })
  const { data: areas, isLoading: isLoadingAreas } = useQuery(
    'areas',
    async () => {
      const res = await fetch('/api/areas')
      const data = await res.json()
      if (data.error) return []
      return data
    }
  )
  const { mutateAsync: deleteEditor, isLoading: deleteLoading } = useMutation(
    async id => {
      return await fetch('/api/editors', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
  )
  const { mutateAsync: addEditor, isLoading: addLoading } = useMutation(
    async data => {
      return await fetch('/api/editors', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
  )
  const { mutateAsync: editEditor, isLoading: editLoading } = useMutation(
    async data => {
      return await fetch('/api/editors', {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
  )
  const [resetPassword, setResetPassword] = useState(false)

  const { user } = useUser()

  return (
    <>
      <h3>Editors</h3>
      {user?.role !== 'EDITOR' && (
        <Button onClick={() => setAddEditorModal(true)}>Add Editor</Button>
      )}
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <Table
          columns={[
            {
              title: 'Sr. No.',
              dataIndex: 'sr'
            },
            {
              title: 'Name',
              dataIndex: 'name'
            },
            {
              title: 'Email',
              dataIndex: 'email'
            },
            {
              title: 'Area',
              render: (_, record) => record.area?.name
            },
            {
              title: 'Created By',
              render: (_, record) => record.createdBy?.name
            },
            {
              title: 'Updated By',
              render: (_, record) => record.updatedBy?.name
            },
            {
              title: 'Actions',
              render: (_, record) => (
                <Space>
                  <Button
                    onClick={() => {
                      setEditEditorModal(record.id)
                    }}
                  >
                    <EditOutlined />
                  </Button>
                  <Button
                    onClick={async () => {
                      await deleteEditor(record.id)
                      await refetch()
                    }}
                    loading={deleteLoading}
                  >
                    <DeleteOutlined />
                  </Button>
                </Space>
              )
            }
          ]}
          dataSource={
            editors.map((editor: any, i: number) => ({
              ...editor,
              sr: i + 1
            })) as any[]
          }
          rowKey={'sr'}
        />
      )}

      <Modal
        open={addEditorModal || editEditorModal !== ''}
        onCancel={() => {
          setEditEditorModal('')
          setAddEditorModal(false)
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          initialValues={
            editEditorModal !== ''
              ? editors.find((a: any) => a.id === editEditorModal)
              : {}
          }
          onFinish={async (values: any) => {
            if (editEditorModal !== '') {
              await editEditor({ id: editEditorModal, ...values })
              setEditEditorModal('')
            } else {
              await addEditor(values)
              setAddEditorModal(false)
            }
            await refetch()
          }}
        >
          <Form.Item
            label="Name:"
            required
            name="name"
            rules={[{ required: true, message: 'Please input name!' }]}
          >
            <Input type="text" required />
          </Form.Item>
          <Form.Item
            label="Email:"
            required
            name="email"
            rules={[{ required: true, message: 'Please enter Email!' }]}
          >
            <Input type="text" required />
          </Form.Item>
          <Form.Item
            label="Area:"
            required
            name="areaId"
            rules={[{ required: true, message: 'Please select an Area!' }]}
          >
            <Select loading={isLoadingAreas}>
              {areas?.map((area: any) => (
                <Select.Option key={area.id} value={area.id}>
                  {area.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {editEditorModal !== '' ? (
            <Form.Item label="Reset Password?">
              <Checkbox onChange={e => setResetPassword(e.target.checked)} />
            </Form.Item>
          ) : null}
          {((editEditorModal && resetPassword) || addEditorModal) && (
            <Form.Item
              label="Password:"
              required
              name="password"
              rules={[{ required: true, message: 'Please enter Password!' }]}
            >
              <Input type="password" required />
            </Form.Item>
          )}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={addLoading || editLoading}
            >
              {addEditorModal ? 'Add' : 'Update'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default Editors
