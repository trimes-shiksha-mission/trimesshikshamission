import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, Modal, Table } from 'antd'
import { GetServerSideProps, NextPage } from 'next'
import { useState } from 'react'
import { Layout } from '~/components/Layout'
import { useMessageApi } from '~/context/messageApi'
import { getServerAuthSession } from '~/server/auth'
import { RouterOutputs, api } from '~/utils/api'

export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getServerAuthSession(ctx)
  return {
    redirect: !session
      ? {
          destination: '/auth'
        }
      : session.user.role !== 'SUPERUSER'
      ? { destination: '/' }
      : undefined,
    props: {}
  }
}

const Admins: NextPage = () => {
  type Admin = RouterOutputs['admins']['getAll']['admins'][0]
  const [addAdminModal, setAddAdminModal] = useState(false)
  const [editAdminModal, setEditAdminModal] = useState<Admin | null>(null)
  const [resetPassword, setResetPassword] = useState(false)
  const messageApi = useMessageApi()
  const [variables, setVariables] = useState<{
    page: number
    limit: number
    sort?: {
      by: string
      order: 'asc' | 'desc'
    }
    search?: string
  }>({
    page: 1,
    limit: 10,
    sort: {
      by: 'createdAt',
      order: 'desc'
    },
    search: ''
  })

  //? Queries
  const {
    data: admins,
    isLoading: getAdminsLoading,
    refetch
  } = api.admins.getAll.useQuery(variables)

  //? Mutations
  const { mutateAsync: deleteAdmin, isLoading: deleteAdminLoading } =
    api.admins.deleteOne.useMutation()
  const { mutateAsync: createAdmin, isLoading: createAdminLoading } =
    api.admins.createOne.useMutation()
  const { mutateAsync: updateAdmin, isLoading: editLoading } =
    api.admins.updateOne.useMutation()

  return (
    <Layout
      title="Admins"
      breadcrumbs={[
        {
          label: 'Admins'
        }
      ]}
    >
      <Button
        type="primary"
        className="mb-2"
        onClick={() => setAddAdminModal(true)}
      >
        Add Admin
      </Button>

      <Input.Search
        className="mb-2"
        placeholder="Search Admins"
        onSearch={value => {
          setVariables({ ...variables, search: value })
        }}
      />

      <Table
        loading={getAdminsLoading}
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
          {
            title: 'Email',
            dataIndex: 'email'
          },
          {
            title: 'Created By',
            render: (_, row) => row.createdBy?.name || 'N/A'
          },
          {
            title: 'Updated By',
            render: (_, row) => row.updatedBy?.name || 'N/A'
          },
          {
            title: 'Created At',
            dataIndex: 'createdAt',
            render: (_, row) => new Date(row.createdAt).toLocaleString(),
            sorter: true
          },
          {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            render: (_, row) => new Date(row.updatedAt).toLocaleString(),
            sorter: true
          },
          {
            title: 'Actions',
            render: (_, record) => (
              <>
                <Button
                  onClick={() => {
                    setEditAdminModal(record)
                  }}
                  type="link"
                >
                  <EditOutlined />
                </Button>
                <Button
                  onClick={async () => {
                    await deleteAdmin(record.id)
                    await refetch()
                  }}
                  type="link"
                  loading={deleteAdminLoading}
                  danger
                >
                  <DeleteOutlined />
                </Button>
              </>
            )
          }
        ]}
        dataSource={admins?.admins}
        rowKey={'id'}
        pagination={{
          current: variables.page,
          pageSize: variables.limit,
          total: admins?.count,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50]
        }}
        onChange={(tablePagination, _filters, sorter: any) => {
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

      <Modal
        open={addAdminModal || !!editAdminModal}
        onCancel={() => {
          setEditAdminModal(null)
          setAddAdminModal(false)
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          initialValues={editAdminModal ?? {}}
          onFinish={async (values: any) => {
            if (editAdminModal) {
              await updateAdmin({ id: editAdminModal.id, ...values })
              setEditAdminModal(null)
              messageApi.success('Admin updated successfully')
            } else {
              await createAdmin(values)
              setAddAdminModal(false)
              messageApi.success('Admin created successfully')
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
          {editAdminModal ? (
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
              loading={createAdminLoading || editLoading}
            >
              {addAdminModal ? 'Add' : 'Update'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  )
}

export default Admins
