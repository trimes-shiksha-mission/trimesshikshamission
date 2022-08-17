import { Role } from '@prisma/client'
import { Button, Form, Input, Select } from 'antd'
import { useState } from 'react'
import { useMutation } from 'react-query'
import fetchJson, { FetchError } from '../lib/fetchJson'
import useUser from '../lib/useUser'

export default function Login() {
  // here we just check if user is already logged in and redirect to profile
  const { mutateUser } = useUser({
    redirectTo: '/',
    redirectIfFound: true
  })
  const {
    mutateAsync: login,
    isLoading: loginLoading,
    data: loginData
  } = useMutation(
    async data =>
      await fetchJson('/api/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })
  )
  const [errorMsg, setErrorMsg] = useState('')

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80vh'
      }}
    >
      <div
        style={{
          width: '40%',
          padding: 16,
          border: '1px solid #ccc',
          borderRadius: 12
        }}
      >
        <Form
          layout="vertical"
          onFinish={async values => {
            try {
              await login({ ...values, role: values.role as Role })
              mutateUser(loginData as any)
            } catch (error) {
              if (error instanceof FetchError) {
                setErrorMsg(error.data.message)
              } else {
                console.error('An unexpected error happened:', error)
              }
            }
          }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please select a role!' }]}
          >
            <Select>
              <Select.Option value="ADMIN">Admin</Select.Option>
              <Select.Option value="EDITOR">Editor</Select.Option>
              <Select.Option value="SUPERUSER">Super Admin</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" loading={loginLoading}>
              Login
            </Button>
          </Form.Item>
        </Form>
        {errorMsg ? (
          <span style={{ color: 'red', fontSize: '12px' }}>{errorMsg}!</span>
        ) : null}
      </div>
    </div>
  )
}
