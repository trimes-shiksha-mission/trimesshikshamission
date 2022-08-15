import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, Modal, Space, Table } from 'antd'
import { NextPage } from 'next'
import { useState } from 'react'
import { useMutation, useQuery } from 'react-query'

const Admins: NextPage = () => {
  const [addAdminModal, setAddAdminModal] = useState(false)
  const [editAdminModal, setEditAdminModal] = useState('')
  const {
    data: admins,
    isLoading,
    refetch
  } = useQuery('admins', () => fetch('/api/admins').then(res => res.json()))
  const [resetPassword, setResetPassword] = useState(false)
  const { mutateAsync: deleteAdmin, isLoading: deleteLoading } = useMutation(
    async id =>
      await fetch('/api/admins', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
  )
  const { mutateAsync: addAdmin, isLoading: addLoading } = useMutation(
    async admin =>
      await fetch('/api/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(admin)
      })
  )
  const { mutateAsync: editAdmin, isLoading: editLoading } = useMutation(
    async admin =>
      await fetch('/api/admins', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(admin)
      })
  )

  return (
    <>
      <h3>Admins</h3>
      <Button onClick={() => setAddAdminModal(true)}>Add Admin</Button>
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
              title: 'Actions',
              render: (_, record) => (
                <Space>
                  <Button
                    onClick={() => {
                      setEditAdminModal(record.id)
                    }}
                  >
                    <EditOutlined />
                  </Button>
                  <Button
                    onClick={async () => {
                      await deleteAdmin(record.id)
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
          dataSource={admins.map((admin: any, i: number) => ({
            ...admin,
            sr: i + 1
          }))}
          rowKey={'sr'}
        />
      )}

      <Modal
        visible={addAdminModal || editAdminModal !== ''}
        onCancel={() => {
          setEditAdminModal('')
          setAddAdminModal(false)
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          initialValues={
            editAdminModal !== ''
              ? admins.find((a: any) => a.id === editAdminModal)
              : {}
          }
          onFinish={async (values: any) => {
            if (editAdminModal !== '') {
              await editAdmin({ id: editAdminModal, ...values })
              setEditAdminModal('')
            } else {
              await addAdmin(values)
              setAddAdminModal(false)
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
          {editAdminModal !== '' ? (
            <Form.Item label="Reset Password?">
              <Checkbox onChange={e => setResetPassword(e.target.checked)} />
            </Form.Item>
          ) : null}
          {((editAdminModal && resetPassword) || addAdminModal) && (
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
              {addAdminModal ? 'Add' : 'Update'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default Admins
