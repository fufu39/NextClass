import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Checkbox, App } from 'antd'
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
  HomeOutlined,
  UserAddOutlined,
  LoginOutlined,
  SendOutlined
} from '@ant-design/icons'
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { useUserStore } from '../../stores/user'
import { login, register, askCode, type RegisterParams } from '../../api/auth'
import styles from './index.module.scss'

const Login = () => {
  const navigate = useNavigate()
  const { message } = App.useApp()
  const [loading, setLoading] = useState(false)
  const { setUser, setToken } = useUserStore()
  const [isRegister, setIsRegister] = useState(false)
  const [form] = Form.useForm()

  // Timer state for verification code
  const [countdown, setCountdown] = useState(0)
  const [isSendingCode, setIsSendingCode] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const initialRemember = useMemo(() => localStorage.getItem('rememberMe') === 'true', [])

  // Login form values state
  const [loginInitialValues, setLoginInitialValues] = useState({
    username: localStorage.getItem('rememberUsername') || '',
    password: '',
    remember: localStorage.getItem('rememberMe') === 'true'
  })

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

  const onLoginFinish = async (values: { username: string; password: string; remember?: boolean }) => {
    try {
      setLoading(true)
      const response = await login({
        username: values.username,
        password: values.password
      })
      console.log(response)

      if (response.code === 200) {
        const authData = response.data

        // 保存用户信息
        setUser({
          username: authData.username,
          role: authData.role,
          expire: authData.expire
        })
        setToken(authData.token)
        localStorage.setItem('token', authData.token)

        if (values.remember) {
          localStorage.setItem('rememberMe', 'true')
          localStorage.setItem('rememberUsername', values.username)
        } else {
          localStorage.removeItem('rememberMe')
          localStorage.removeItem('rememberUsername')
        }

        message.success('登录成功！')
        navigate('/dashboard')
      } else {
        message.error(response.message || '登录失败')
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '登录失败'
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const onRegisterFinish = async (values: RegisterParams) => {
    try {
      setLoading(true)
      const response = await register(values)
      console.log(response)
      if (response.code === 200) {
        message.success('注册成功，请登录')
        setLoginInitialValues({
          username: values.email,
          password: values.password,
          remember: loginInitialValues.remember
        })
        setIsRegister(false)
      } else {
        message.error(response.message || '注册失败')
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '注册失败'
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSendCode = async () => {
    try {
      // Validate email field only
      const email = form.getFieldValue('email')
      if (!email) {
        message.warning('请输入邮箱')
        return
      }

      // Validate email format using regex or form validation
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!emailRegex.test(email)) {
        message.warning('请输入有效的邮箱地址')
        return
      }

      setIsSendingCode(true)
      const response = await askCode(email, 'register')
      console.log(response)
      if (response.code === 200) {
        message.success('验证码已发送')
        setCountdown(60)
      } else {
        message.error(response.message || '发送失败')
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '发送失败'
      message.error(errorMessage)
    } finally {
      setIsSendingCode(false)
    }
  }

  return (
    <div className={styles.container} onMouseMove={handleMouseMove}>
      {/* Home Button */}
      <motion.button
        className={styles.homeBtn}
        onClick={() => navigate('/')}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <HomeOutlined /> Back to Home
      </motion.button>

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

      {/* Login/Register Card */}
      <motion.div
        className={styles.loginBox}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className={styles.switchIcon}
          onClick={() => setIsRegister(!isRegister)}
          title={isRegister ? "Switch to Login" : "Switch to Register"}
        >
          {isRegister ? <LoginOutlined /> : <UserAddOutlined />}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {!isRegister ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%' }}
            >
              <h1 className={styles.title}>Login.</h1>

              <Form
                name="login"
                onFinish={onLoginFinish}
                autoComplete="off"
                layout="vertical"
                size="large"
                className={styles.form}
                initialValues={loginInitialValues}
              >
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: '请输入用户名' },
                    { min: 3, message: '用户名至少3个字符' }
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Username / Email" />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: '请输入密码' },
                    { min: 6, message: '密码至少6个字符' }
                  ]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                </Form.Item>

                <div className={styles.actions}>
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>
                  <Button type="link" className={styles.forgot} onClick={() => message.info('请联系管理员重置密码')}>
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
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%' }}
            >
              <h1 className={styles.title}>Register.</h1>

              <Form
                form={form}
                name="register"
                onFinish={onRegisterFinish}
                autoComplete="off"
                layout="vertical"
                size="large"
                className={styles.form}
              >
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: '请输入邮箱' },
                    { pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: '请输入有效的邮箱地址' }
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="Email" />
                </Form.Item>

                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: '请输入用户名' },
                    { min: 3, message: '用户名至少3个字符' }
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Username" />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: '请输入密码' },
                    { min: 6, message: '密码至少6个字符' }
                  ]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                </Form.Item>

                <Form.Item
                  name="code"
                  rules={[
                    { required: true, message: '请输入验证码' }
                  ]}
                >
                  <Input
                    prefix={<SafetyCertificateOutlined />}
                    placeholder="Verification Code"
                    suffix={
                      <Button
                        type="text"
                        onClick={handleSendCode}
                        disabled={countdown > 0 || isSendingCode}
                        loading={isSendingCode}
                        className={styles.codeBtn}
                        icon={countdown === 0 && <SendOutlined />}
                      >
                        {countdown > 0 ? `${countdown}s` : 'Send'}
                      </Button>
                    }
                  />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                  <button
                    type="submit"
                    className={`${styles.submitBtn} ${loading ? styles.loading : ''}`}
                    disabled={loading}
                  >
                    {loading ? 'Registering...' : 'Register'}
                  </button>
                </Form.Item>
              </Form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default Login
