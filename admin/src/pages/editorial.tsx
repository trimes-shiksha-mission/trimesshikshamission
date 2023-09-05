import { DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { Button, Form, Input, Modal, Table } from 'antd'
import { GetServerSideProps, NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Layout } from '~/components/Layout'
import { useMessageApi } from '~/context/messageApi'
import { getServerAuthSession } from '~/server/auth'
import { RouterOutputs, api } from '~/utils/api'

const Editor = dynamic(() => import('~/components/Editor/Editor'), { ssr: false })

export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getServerAuthSession(ctx)
  return {
    redirect: !session
      ? {
        destination: '/auth'
      }
      : session.user.role !== 'SUPERUSER'
        ? {
          destination: '/'
        }
        : undefined,
    props: {}
  }
}

const Editorial: NextPage = () => {
  type EditorialType = RouterOutputs['editorials']['getAll']['editorials'][0]

  const messageApi = useMessageApi()
  const [addEditorialModal, setAddEditorialModal] = useState(false)
  const [previewModal, setPreviewModal] = useState<EditorialType | null>(null)
  const [variables, setVariables] = useState<{
    page: number
    limit: number
    sort?: {
      by: string
      order: 'asc' | 'desc'
    }
  }>({
    page: 1,
    limit: 10,
    sort: {
      by: 'createdAt',
      order: 'desc'
    }
  })

  //? Queries
  const {
    data: editorials,
    isLoading: getEditorialLoading,
    refetch,
    isRefetching
  } = api.editorials.getAll.useQuery(variables)

  //? Mutations
  const { mutateAsync: deleteEditorial, isLoading: deleteEditorialLoading } =
    api.editorials.deleteOne.useMutation()
  const { mutateAsync: addEditorial, isLoading: addEditorialLoading } =
    api.editorials.createOne.useMutation()

  return (
    <Layout
      title="Mann Ki baat"
      breadcrumbs={[
        {
          label: 'Editorial'
        }
      ]}
    >
      <Button
        className="mb-2"
        type="primary"
        onClick={() => setAddEditorialModal(true)}
      >
        Add New
      </Button>

      <Table
        loading={getEditorialLoading || isRefetching}
        columns={[
          {
            title: 'Sr. No.',
            render: (_, __, index: number) =>
              (variables.page - 1) * variables.limit + index + 1
          },
          {
            title: 'Title',
            dataIndex: 'title'
          },
          {
            title: 'Created At',
            dataIndex: 'createdAt',
            render: (_, row) => new Date(row.createdAt).toLocaleString(),
            sorter: true
          },
          {
            title: 'Action',
            render: (_, row) => (
              <>
                <Button
                  onClick={async () => {
                    await deleteEditorial(row.id)
                    messageApi.success('Editorial deleted successfully')
                    await refetch()
                  }}
                  loading={deleteEditorialLoading}
                  type="link"
                  danger
                >
                  <DeleteOutlined />
                </Button>
                <Button onClick={() => setPreviewModal(row)} type="link">
                  <EyeOutlined />
                </Button>
              </>
            )
          }
        ]}
        dataSource={editorials?.editorials}
        rowKey="id"
        pagination={{
          current: variables.page,
          pageSize: variables.limit,
          total: editorials?.count,
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
        open={addEditorialModal}
        maskClosable
        onCancel={() => setAddEditorialModal(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={async values => {
            await addEditorial(values)
            setAddEditorialModal(false)
            messageApi.success('Editorial added successfully')
            return await refetch()
          }}
        >
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Content" name="body" rules={[{ required: true }]}>
            <Editor type='Editorial' key={'editorial'} placeholder={'Write something...'} />
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

      <Modal
        open={!!previewModal}
        footer={null}
        onCancel={() => setPreviewModal(null)}
      >
        <h1>{previewModal?.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: previewModal?.body || '' }} />
      </Modal>
    </Layout>
  )
}

export default Editorial
