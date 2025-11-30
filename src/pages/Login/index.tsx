import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Card, Typography, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useUserStore } from '../../stores/user'
import { login } from '../../api/auth'
import styles from './index.module.scss'

const { Title } = Typography

const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { setUser, setToken } = useUserStore()

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      setLoading(true)
      const response = await login(values)
      
      // 保存用户信息
      setUser(response.user)
      setToken(response.token)
      localStorage.setItem('token', response.token)
      
      message.success('登录成功！')
      navigate('/dashboard')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '登录失败'
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.auth}>
      <Card className={styles.card}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} className={styles.title}>用户登录</Title>
          <p style={{ color: '#4a4a4a' }}>欢迎回来，请输入您的账号信息</p>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名!' },
              { min: 3, message: '用户名至少3个字符' }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码!' },
              { min: 6, message: '密码至少6个字符' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} size="large" className={styles.submit}>登录</Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Button type="link" onClick={() => message.info('注册功能开发中...')}>还没有账号？立即注册</Button>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default Login
