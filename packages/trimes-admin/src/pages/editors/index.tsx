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
import { useQuery } from 'react-query'

const Editors: NextPage = () => {
  const [addEditorModal, setAddEditorModal] = useState(false)
  const [editEditorModal, setEditEditorModal] = useState('')
  const {
    data: editors,
    isLoading,
    refetch
  } = useQuery('editors', () => fetch('/api/editors').then(res => res.json()))
  const { data: areas, isLoading: isLoadingAreas } = useQuery('areas', () =>
    fetch('/api/areas').then(res => res.json())
  )
  const [resetPassword, setResetPassword] = useState(false)

  return (
    <>
      <h3>Editors</h3>
      <Button onClick={() => setAddEditorModal(true)}>Add Editor</Button>
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
              title: 'Actions',
              render: (_, record) => (
                <Space>
                  <EditOutlined
                    onClick={() => {
                      console.log(record)
                      setEditEditorModal(record.id)
                    }}
                  />
                  <DeleteOutlined />
                </Space>
              )
            }
          ]}
          dataSource={editors.map((editor: any, i: number) => ({
            ...editor,
            sr: i + 1
          }))}
        />
      )}

      <Modal
        visible={addEditorModal || editEditorModal !== ''}
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
              await fetch('/api/editors', {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: editEditorModal, ...values })
              })
              await refetch()
              setEditEditorModal('')
            } else {
              await fetch('/api/editors', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
              })
              await refetch()
              setAddEditorModal(false)
            }
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
            <Button type="primary" htmlType="submit">
              {addEditorModal ? 'Add' : 'Update'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default Editors
