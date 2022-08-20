import { Button, Form, Input, message, Modal, Row, Table } from 'antd'
import { NextPage } from 'next'
import { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { ProtectedRoute } from '../components/ProtectedRoute'

const Schools: NextPage = () => {
  const {
    data: schools,
    isLoading: getSchoolsLoading,
    refetch
  } = useQuery('schools', async () => {
    return await fetch('/api/school').then(res => res.json())
  })

  const { mutateAsync: addSchool, isLoading: addSchoolLoading } = useMutation(
    async school => {
      try {
        await fetch('/api/school', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(school)
        })
        message.success('School added successfully')
      } catch (error) {
        message.error((error as any).message)
      }
    }
  )

  const { mutateAsync: deleteSchool, isLoading: deleteSchoolLoading } =
    useMutation(async id => {
      try {
        await fetch(`/api/school`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id })
        })
        message.success('School deleted successfully')
      } catch (error) {
        message.error((error as any).message)
      }
    })

  const [addSchoolModal, setAddSchoolModal] = useState(false)
  return (
    <ProtectedRoute role={['ADMIN', 'SUPERUSER']}>
      <Row
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <h1>Schools</h1>
        <Button
          type="primary"
          onClick={() => {
            setAddSchoolModal(true)
          }}
        >
          Add School
        </Button>
      </Row>

      <Table
        columns={[
          {
            title: 'Name',
            dataIndex: 'name'
          },
          {
            title: 'Address',
            dataIndex: 'address'
          },
          {
            title: 'Actions',
            render: (text, record) => (
              <>
                <Button>Edit</Button>
                <Button
                  loading={deleteSchoolLoading}
                  onClick={async () => {
                    await deleteSchool(record.id)
                    await refetch()
                  }}
                >
                  Delete
                </Button>
              </>
            )
          }
        ]}
        dataSource={schools}
        rowKey="id"
      />

      <Modal
        visible={addSchoolModal}
        onCancel={() => setAddSchoolModal(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={async values => {
            await addSchool(values)
            await refetch()
            setAddSchoolModal(false)
          }}
        >
          <Form.Item
            label="Name"
            name={'name'}
            rules={[{ required: true, message: 'School Name is required!' }]}
          >
            <Input type="text" />
          </Form.Item>

          <Form.Item
            label="Address"
            name={'address'}
            rules={[{ required: true, message: 'Address is required!' }]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={addSchoolLoading}>
              Add
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </ProtectedRoute>
  )
}

export default Schools
