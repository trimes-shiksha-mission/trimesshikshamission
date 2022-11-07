import { Select, Space, Table } from 'antd'
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
    return await fetch('/api/users').then(res => res.json())
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
          ...columns.filter(col => col.show),
          {
            title: 'Action',
            dataIndex: 'action',
            render: (text, record) => (
              <Space size="middle">
                <button
                  onClick={async () => {
                    // ask for confirmaion
                    if (confirm('Are you sure you want to delete this user?')) {
                      await deleteUser(record.id)
                      await refetch()
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                  disabled={deleteUserLoading}
                >
                  Delete
                </button>
              </Space>
            )
          }
        ]}
        dataSource={users?.map((user: any, index: number) => ({
          ...user,
          index: index + 1
        }))}
        rowKey="id"
      />
    </ProtectedRoute>
  )
}

export default Users
