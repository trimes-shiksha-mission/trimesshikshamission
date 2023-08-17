import { Button, Form, Input, Modal, Select, Space, Table } from 'antd'
import { GetServerSideProps, NextPage } from 'next'
import { useState } from 'react'
import { Layout } from '~/components/Layout'
import { getServerAuthSession } from '~/server/auth'
import { RouterOutputs, api } from '~/utils/api'

export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getServerAuthSession(ctx)
  return {
    redirect: !session
      ? {
          destination: '/auth'
        }
      : undefined,
    props: {}
  }
}

const Users: NextPage = () => {
  type UserType = RouterOutputs['users']['getAll']['users'][0]

  // const filterDropdown = (variableName: string) => (
  //   <div className="p-2">
  //     <Input.Search
  //       placeholder={`Search ${variableName}`}
  //       onSearch={searchText => {
  //         setVariables({
  //           ...variables,
  //           [variableName]: searchText
  //         })
  //       }}
  //     />
  //     <Button
  //       type="primary"
  //       onClick={() => {
  //         setVariables({
  //           ...variables,
  //           [variableName]: undefined
  //         })
  //       }}
  //       className="mt-2"
  //     >
  //       Clear
  //     </Button>
  //   </div>
  // )

  //? States
  const [userModalOpen, setUserModalOpen] = useState<UserType | null>(null)
  const [columns, setColumns] = useState([
    {
      title: 'Email',
      dataIndex: 'email',
      show: true
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      show: false,
      filters: [
        {
          text: 'Male',
          value: 'male'
        },
        {
          text: 'Female',
          value: 'female'
        },
        {
          text: 'Other',
          value: 'other'
        }
      ]
    },
    {
      title: 'Contact',
      dataIndex: 'contact',
      show: true
    },
    {
      title: 'Marital Status',
      dataIndex: 'maritalStatus',
      show: false,
      filters: [
        {
          text: 'Married',
          value: 'married'
        },
        {
          text: 'Unmarried',
          value: 'unmarried'
        },
        {
          text: 'Divorced',
          value: 'divorced'
        },
        {
          text: 'Widowed',
          value: 'widowed'
        }
      ]
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
      show: false,
      filters: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => ({
        text: bg,
        value: bg
      }))
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
      show: false,
      sorter: true
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
      ]
    }
  ])
  const [variables, setVariables] = useState<{
    page: number
    limit: number
    sort?: {
      by: string
      order: 'asc' | 'desc'
    }
    verified?: boolean
    search?: string
    gender?: 'male'
    maritalStatus?: 'married' | 'unmarried' | 'divorced' | 'widowed'
    bloodGroup?: 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-'
  }>({
    page: 1,
    limit: 10
  })

  //? Queries
  const {
    data: users,
    isLoading: getUsersLoading,
    refetch,
    isRefetching
  } = api.users.getAll.useQuery(variables)

  //? Mutations
  const { mutateAsync: verifyUser, isLoading: verifyUserLoading } =
    api.users.verify.useMutation()

  return (
    <Layout title="Users" breadcrumbs={[{ label: 'Users' }]}>
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

      <Input.Search
        className="mb-2"
        placeholder="Search Users"
        onSearch={value => {
          setVariables({ ...variables, search: value })
        }}
      />

      <Table
        loading={getUsersLoading || isRefetching}
        style={{
          overflowX: 'scroll'
        }}
        columns={[
          {
            title: 'Sr. No.',
            render: (_, __, index) =>
              (variables.page - 1) * variables.limit + index + 1
          },
          {
            title: 'Name',
            dataIndex: 'name'
          },
          ...(columns.filter(col => col.show) as any),
          {
            title: 'Action',
            dataIndex: 'action',
            render: (_, record) => (
              <Space size="middle">
                {/* view/edit button */}
                <Button onClick={() => setUserModalOpen(record)} type="primary">
                  View/Edit
                </Button>

                <Button
                  onClick={async () => {
                    // ask for confirmaion
                    if (confirm('Are you sure you want to delete this user?')) {
                      // await deleteUser(record.id)
                      await refetch()
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                  // loading={deleteUserLoading}
                  danger
                >
                  Delete
                </Button>
              </Space>
            )
          }
        ]}
        dataSource={users?.users}
        rowKey="id"
        pagination={{
          current: variables.page,
          pageSize: variables.limit,
          total: users?.count,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50]
        }}
        onChange={(tablePagination, filters, sorter: any) => {
          const newVariables = {
            ...variables,
            page: tablePagination.current || 1,
            limit: tablePagination.pageSize || 10
          }

          if (sorter.column?.dataIndex && sorter.order) {
            newVariables.sort = {
              by: sorter.column.dataIndex,
              order: sorter.order === 'descend' ? 'desc' : 'asc'
            }
          } else {
            newVariables.sort = undefined
          }

          setVariables(newVariables)
        }}
      />

      {/* View/Edit modal */}

      <Modal
        title="View/Edit User"
        open={!!userModalOpen}
        onCancel={() => setUserModalOpen(null)}
        footer={null}
        destroyOnClose
      >
        {/* form */}
        <Form
          layout="vertical"
          // onFinish={async values => {}}
          initialValues={userModalOpen ?? {}}
        >
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
          {userModalOpen && !userModalOpen.isVerified && (
            <Form.Item>
              <Button
                type="primary"
                htmlType="button"
                onClick={async () => {
                  await verifyUser(userModalOpen.id)
                  await refetch()
                  setUserModalOpen(null)
                }}
                loading={verifyUserLoading}
              >
                Verify User
              </Button>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </Layout>
  )
}

export default Users
