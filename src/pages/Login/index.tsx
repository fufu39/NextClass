import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Checkbox, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useUserStore } from '../../stores/user'
import { login } from '../../api/auth'
import styles from './index.module.scss'

const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { setUser, setToken } = useUserStore()

  const initialRemember = useMemo(() => localStorage.getItem('rememberMe') === 'true', [])
  const initialUsername = useMemo(() => localStorage.getItem('rememberUsername') || '', [])

  // Parallax mouse values (Same as Home)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 10, stiffness: 120, mass: 0.5 }
  const mouseXSpring = useSpring(mouseX, springConfig)
  const mouseYSpring = useSpring(mouseY, springConfig)

  const x1 = useTransform(mouseXSpring, [0, window.innerWidth], [-30, 30])
  const y1 = useTransform(mouseYSpring, [0, window.innerHeight], [-30, 30])

  const x2 = useTransform(mouseXSpring, [0, window.innerWidth], [40, -40])
  const y2 = useTransform(mouseYSpring, [0, window.innerHeight], [40, -40])

  const x3 = useTransform(mouseXSpring, [0, window.innerWidth], [-20, 20])
  const y3 = useTransform(mouseYSpring, [0, window.innerHeight], [-20, 20])

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
  }

  const onFinish = async (values: { username: string; password: string; remember?: boolean }) => {
    try {
      setLoading(true)
      const response = await login(values)

      // 保存用户信息
      setUser(response.user)
      setToken(response.token)
      localStorage.setItem('token', response.token)

      if (values.remember) {
        localStorage.setItem('rememberMe', 'true')
        localStorage.setItem('rememberUsername', values.username)
      } else {
        localStorage.removeItem('rememberMe')
        localStorage.removeItem('rememberUsername')
      }

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
    <div className={styles.container} onMouseMove={handleMouseMove}>
      {/* Background Effects */}
      <div className={styles.noise} />
      <div className={styles.gridOverlay} />

      {/* Animated Blobs */}
      <div className={styles.visuals}>
        <motion.div
          className={`${styles.blob} ${styles.blobRed}`}
          style={{ x: x1, y: y1 }}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        />
        <motion.div
          className={`${styles.blob} ${styles.blobGreen}`}
          style={{ x: x2, y: y2 }}
          animate={{
            scale: [1.1, 1, 1.1],
          }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        />
        <motion.div
          className={`${styles.blob} ${styles.blobOrange}`}
          style={{ x: x3, y: y3 }}
          animate={{
            scale: [0.9, 1.15, 0.9],
          }}
          transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
        />
      </div>

      {/* Login Card */}
      <motion.div
        className={styles.loginBox}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className={styles.title}>Login.</h1>

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
          className={styles.form}
          initialValues={{
            username: initialUsername,
            remember: initialRemember,
          }}
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名!' },
              { min: 3, message: '用户名至少3个字符' }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码!' },
              { min: 6, message: '密码至少6个字符' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <div className={styles.actions}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <Button type="link" className={styles.forgot} onClick={() => message.info('找回功能待实现...')}>
              Forgot password?
            </Button>
          </div>

          <Form.Item style={{ marginBottom: 0 }}>
            <button
              type="submit"
              className={`${styles.submitBtn} ${loading ? styles.loading : ''}`}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </Form.Item>
        </Form>
      </motion.div>
    </div>
  )
}

export default Login
