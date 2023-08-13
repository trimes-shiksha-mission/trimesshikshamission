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
      : !['SUPERUSER', 'ADMIN'].includes(session.user.role)
      ? {
          destination: '/'
        }
      : undefined,
    props: {}
  }
}

const Editors: NextPage = () => {
  type EditorType = RouterOutputs['editors']['getAll']['editors'][0]
  const messageApi = useMessageApi()
  //? States
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
  const [addEditorModal, setAddEditorModal] = useState(false)
  const [editEditorModal, setEditEditorModal] = useState<EditorType | null>(
    null
  )
  const [resetPassword, setResetPassword] = useState(false)

  //? Queries
  const {
    data: editors,
    isLoading: getEditorsLoading,
    refetch,
    isRefetching
  } = api.editors.getAll.useQuery(variables)
  const { data: areas, isLoading: getAreasLoading } =
    api.areas.getAll.useQuery()

  //? Mutations
  const { mutateAsync: createEditor, isLoading: createEditorLoading } =
    api.editors.createOne.useMutation()
  const { mutateAsync: updateEditor, isLoading: updateEditorLoading } =
    api.editors.updateOne.useMutation()
  const { mutateAsync: deleteEditor, isLoading: deleteEditorLoading } =
    api.editors.deleteOne.useMutation()

  return (
    <Layout title="Editors" breadcrumbs={[{ label: 'Editors' }]}>
      <Button
        type="primary"
        className="mb-2"
        onClick={() => setAddEditorModal(true)}
      >
        Add Editor
      </Button>
      <Input.Search
        className="mb-2"
        placeholder="Search Editors"
        onSearch={value => {
          setVariables({ ...variables, search: value })
        }}
      />

      <Table
        loading={getEditorsLoading || isRefetching}
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
            title: 'Created At',
            dataIndex: 'createdAt',
            render: (_, record) => new Date(record.createdAt).toLocaleString(),
            sorter: true
          },
          {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            render: (_, record) => new Date(record.updatedAt).toLocaleString(),
            sorter: true
          },
          {
            title: 'Actions',
            render: (_, record) => (
              <Space>
                <Button
                  onClick={() => {
                    setEditEditorModal(record)
                  }}
                  type="link"
                >
                  <EditOutlined />
                </Button>
                <Button
                  onClick={async () => {
                    await deleteEditor(record.id)
                    await refetch()
                    messageApi.success('Editor deleted successfully!')
                  }}
                  danger
                  type="link"
                  loading={deleteEditorLoading}
                >
                  <DeleteOutlined />
                </Button>
              </Space>
            )
          }
        ]}
        dataSource={editors?.editors}
        rowKey={'id'}
      />

      <Modal
        open={addEditorModal || !!editEditorModal}
        onCancel={() => {
          setEditEditorModal(null)
          setAddEditorModal(false)
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          initialValues={editEditorModal ?? {}}
          onFinish={async values => {
            if (editEditorModal) {
              await updateEditor({ id: editEditorModal.id, ...values })
              setEditEditorModal(null)
              messageApi.success('Editor updated successfully!')
            } else {
              await createEditor(values)
              setAddEditorModal(false)
              messageApi.success('Editor created successfully!')
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
            <Select loading={getAreasLoading}>
              {areas?.map((area: any) => (
                <Select.Option key={area.id} value={area.id}>
                  {area.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {editEditorModal ? (
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
              loading={createEditorLoading || updateEditorLoading}
            >
              {addEditorModal ? 'Add' : 'Update'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  )
}

export default Editors
