import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, Modal, Space, Table } from 'antd'
import { NextPage } from 'next'
import { useState } from 'react'
import { useQuery } from 'react-query'

const Admins: NextPage = () => {
  const [addAdminModal, setAddAdminModal] = useState(false)
  const [editAdminModal, setEditAdminModal] = useState('')
  const { data: admins, isLoading } = useQuery('admins', () =>
    fetch('/api/admins').then(res => res.json())
  )
  const [resetPassword, setResetPassword] = useState(false)

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
                  <EditOutlined
                    onClick={() => {
                      console.log(record)
                      setEditAdminModal(record.id)
                    }}
                  />
                  <DeleteOutlined />
                </Space>
              )
            }
          ]}
          dataSource={admins.map((admin: any, i: number) => ({
            ...admin,
            sr: i + 1
          }))}
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
            await fetch('/api/admins', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(values)
            })
            setAddAdminModal(false)
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
            <Button type="primary" htmlType="submit">
              {addAdminModal ? 'Add' : 'Update'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default Admins
