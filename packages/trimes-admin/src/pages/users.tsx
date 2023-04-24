import { User } from '@prisma/client'
import { Button, Form, Input, Modal, Select, Space, Table } from 'antd'
import { NextPage } from 'next'
import { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { ProtectedRoute } from '../components/ProtectedRoute'

const Users: NextPage = () => {
  const {
    data: users,
    isLoading: getUsersLoading,
    refetch
  } = useQuery('Users', async () => {
    const users = await fetch('/api/users')
    return (await users.json()) as User[]
  })

  const { mutateAsync: deleteUser, isLoading: deleteUserLoading } = useMutation(
    'deleteUser',
    async (id: string) => {
      return await fetch(`/api/users`, {
        method: 'DELETE',
        body: JSON.stringify({ id }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
    }
  )

  const { mutateAsync: verifyUser, isLoading: verifyUserLoading } = useMutation(
    'verifyUser',
    async (id: string) => {
      return await fetch(`/api/users/verify`, {
        method: 'PATCH',
        body: JSON.stringify({ id }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
    }
  )

  const [modalOpen, setModalOpen] = useState<User>()

  const [columns, setColumns] = useState([
    {
      title: 'Email',
      dataIndex: 'email',
      show: true
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      show: false
    },
    {
      title: 'Contact',
      dataIndex: 'contact',
      show: true
    },
    {
      title: 'Marital Status',
      dataIndex: 'maritalStatus',
      show: false
    },
    {
      title: 'Date of Birth',
      dataIndex: 'birthday',
      render: (birthday: string) => new Date(birthday).toLocaleDateString(),
      show: false
    },
    {
      title: 'Occupation',
      dataIndex: 'occupation',
      show: false
    },
    {
      title: 'Qualification',
      dataIndex: 'qualification',
      show: false
    },
    {
      title: 'Gautra',
      dataIndex: 'gautra',
      show: false
    },
    {
      title: 'Native Town',
      dataIndex: 'nativeTown',
      show: false
    },
    {
      title: 'Blood Group',
      dataIndex: 'bloodGroup',
      show: false
    },
    {
      title: 'Address',
      dataIndex: 'address',
      show: false
    },
    {
      title: 'Family Annual Income',
      dataIndex: 'familyAnnualIncome',
      show: false
    },
    {
      title: 'Private Property',
      dataIndex: 'isPrivateProperty',
      show: false,
      render: (isPrivateProperty: boolean) => (isPrivateProperty ? 'Yes' : 'No')
    },
    {
      title: 'Area',
      dataIndex: 'area',
      show: false,
      render: (area: any) => area?.name
    },
    {
      title: 'Head',
      dataIndex: 'head',
      show: false,
      render: (head: any) => head?.name
    },
    {
      title: 'Relation with Head',
      dataIndex: 'relationWithHead',
      show: false
    },
    {
      title: 'Registerd on',
      dataIndex: 'createdAt',
      render: (createdAt: string) =>
        new Date(createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
      show: false
    },
    {
      title: 'Verified',
      dataIndex: 'isVerified',
      render: (isVerified: boolean) => (isVerified ? 'Yes' : 'No'),
      show: true,
      filters: [
        {
          text: 'Yes',
          value: true
        },
        {
          text: 'No',
          value: false
        }
      ],
      onFilter: (value: boolean, record: any) => record.isVerified === value
    }
  ])

  return (
    <ProtectedRoute>
      <Select
        mode="multiple"
        style={{
          width: '100%',
          padding: 16
        }}
        placeholder="Select Columns:"
        defaultValue={columns.filter(c => c.show).map(c => c.dataIndex)}
        onChange={async (value: string[]) => {
          setColumns(
            columns.map(c => ({
              ...c,
              show: value.includes(c.dataIndex)
            }))
          )
        }}
      >
        {columns.map(column => (
          <Select.Option key={column.dataIndex} value={column.dataIndex}>
            {column.title}
          </Select.Option>
        ))}
      </Select>
      <Table
        style={{
          overflowX: 'scroll'
        }}
        columns={[
          {
            title: 'Sr. No.',
            dataIndex: 'index'
          },
          {
            title: 'Name',
            dataIndex: 'name'
          },
          ...(columns.filter(col => col.show) as any),
          {
            title: 'Action',
            dataIndex: 'action',
            render: (text, record) => (
              <Space size="middle">
                {/* view/edit button */}
                <Button
                  onClick={() => setModalOpen(record)}
                  type="primary"
                  disabled={getUsersLoading}
                >
                  View/Edit
                </Button>

                <Button
                  onClick={async () => {
                    // ask for confirmaion
                    if (confirm('Are you sure you want to delete this user?')) {
                      await deleteUser(record.id)
                      await refetch()
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                  disabled={deleteUserLoading}
                  danger
                >
                  Delete
                </Button>
              </Space>
            )
          }
        ]}
        dataSource={users?.map((user, index: number) => ({
          ...user,
          index: index + 1
        }))}
        rowKey="id"
      />

      {/* View/Edit modal */}

      <Modal
        title="View/Edit User"
        visible={modalOpen !== undefined}
        onCancel={() => setModalOpen(undefined)}
        footer={null}
        destroyOnClose
      >
        {/* form */}
        <Form
          layout="vertical"
          onFinish={async values => {
            console.log(values)
          }}
          initialValues={modalOpen}
        >
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
          {modalOpen && !modalOpen.isVerified && (
            <Form.Item>
              <Button
                type="primary"
                htmlType="button"
                onClick={async () => {
                  await verifyUser(modalOpen.id)
                  await refetch()
                  setModalOpen(undefined)
                }}
                loading={verifyUserLoading}
              >
                Verify User
              </Button>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </ProtectedRoute>
  )
}

export default Users
