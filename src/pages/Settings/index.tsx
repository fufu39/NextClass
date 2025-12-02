import { useState, useEffect } from 'react'
import { Form, Input, Button, message, Switch, Tabs, Tag, Modal, Select, TimePicker } from 'antd'
import { UserOutlined, LockOutlined, BellOutlined, SafetyOutlined, SettingOutlined } from '@ant-design/icons'
import { getUserProfile, updateUserProfile } from '../../api/user'
import { getSubscriptionPreferences, subscribe, unsubscribe } from '../../api/subscription'
import { useUserStore } from '../../stores/user'
import dayjs from 'dayjs'
import styles from './index.module.scss'

const Settings = () => {
  const [form] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [subscribeForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { user: storeUser, setUser: setStoreUser } = useUserStore()
  const [emailSubscription, setEmailSubscription] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)

  // Initialize form with store data immediately
  useEffect(() => {
    if (storeUser) {
      form.setFieldsValue({
        username: storeUser.username || '无法修改用户名',
        email: storeUser.email || '无法修改邮箱'
      })
    }
  }, [storeUser, form])

  // Fetch latest profile and subscription from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch User Profile
        const userData = await getUserProfile()
        // console.log('userData', userData);
        form.setFieldsValue({
          username: userData.username || storeUser?.username,
          email: userData.email || storeUser?.email,
        })

        // Update store with latest data
        if (storeUser) {
          setStoreUser({
            ...storeUser,
            email: userData.email || storeUser.email,
            avatar: userData.avatar || storeUser.avatar
          })
        }
      } catch (error) {
        console.error('Failed to fetch profile', error)
      }

      try {
        // Fetch Subscription Preferences
        const subData = await getSubscriptionPreferences()
        console.log('subData', subData);
        if (subData) {
          setEmailSubscription(subData.subscribed)
          // Pre-fill the form for better UX when reopening
          subscribeForm.setFieldsValue({
            timezone: subData.timezone || 'Asia/Shanghai',
            dailyTime: subData.dailyTime ? dayjs(subData.dailyTime, 'HH:mm:ss') : dayjs('08:00:00', 'HH:mm:ss')
          })
        }
      } catch (error) {
        console.error('Failed to fetch subscription preferences', error)
      }
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount

  const handleUpdateProfile = async (values: { username: string, email: string }) => {
    setLoading(true)
    try {
      // Simulate API or Real API
      await updateUserProfile({ username: values.username, email: values.email })

      // Update store
      if (storeUser) {
        setStoreUser({
          ...storeUser,
          username: values.username,
          email: values.email
        })
      }
      message.success('个人资料更新成功')
    } catch {
      message.error('更新失败')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    // 暂时禁用API调用
    // try {
    //   await changePassword({
    //     oldPassword: values.oldPassword,
    //     newPassword: values.newPassword
    //   })
    //   message.success('密码修改成功')
    //   passwordForm.resetFields()
    // } catch {
    //   message.error('密码修改失败')
    // }
    message.info('修改密码接口待开放')
  }

  const handleSubscriptionChange = async (checked: boolean) => {
    if (checked) {
      setIsModalOpen(true)
      // Set default values if form is empty
      if (!subscribeForm.getFieldValue('timezone')) {
        subscribeForm.setFieldsValue({
          timezone: 'Asia/Shanghai',
          dailyTime: dayjs('08:00', 'HH:mm')
        })
      }
    } else {
      try {
        const res = await unsubscribe()
        console.log(res);
        setEmailSubscription(false)
        message.success('已关闭课程邮件提醒')
      } catch {
        message.error('关闭失败')
        setEmailSubscription(true) // Revert
      }
    }
  }

  const handleSubscribeSubmit = async () => {
    try {
      const values = await subscribeForm.validateFields()
      setModalLoading(true)

      const res = await subscribe({
        timezone: values.timezone,
        dailyTime: values.dailyTime.format('HH:mm:ss'),
        channels: 'email'
      })
      console.log(res);

      message.success('已开启课程邮件提醒')
      setEmailSubscription(true)
      setIsModalOpen(false)

      // Refresh preferences to ensure sync
      const subData = await getSubscriptionPreferences()
      console.log(subData);
      if (subData) {
        subscribeForm.setFieldsValue({
          timezone: subData.timezone,
          dailyTime: dayjs(subData.dailyTime, 'HH:mm:ss')
        })
      }

    } catch (error) {
      console.error(error)
      message.error('开启失败')
    } finally {
      setModalLoading(false)
    }
  }

  const items = [
    {
      key: 'notification',
      label: <div className={styles.tabLabel}><BellOutlined /> <span>通知设置</span></div>,
      children: (
        <div className={styles.tabContent}>
          <div className={styles.sectionTitle}>
            <h2>通知偏好</h2>
            <p>选择您希望接收的通知类型</p>
          </div>

          <div className={`${styles.notificationItem} ${emailSubscription ? styles.active : ''} ${styles.recommended}`}>
            <div className={styles.info}>
              <h4>
                课程邮件提醒
                <Tag color="red" style={{ marginLeft: 8 }}>推荐开启</Tag>
              </h4>
              <p>开启后，系统将在指定时间发送邮件提醒，确保您不会错过今日课程。</p>
            </div>
            <Switch checked={emailSubscription} onChange={handleSubscriptionChange} />
          </div>

          <div className={styles.notificationItem} style={{ opacity: 0.6 }}>
            <div className={styles.info}>
              <h4>系统公告通知</h4>
              <p>接收关于系统维护、新功能上线等重要通知。</p>
            </div>
            <Switch disabled />
          </div>
        </div>
      ),
    },
    {
      key: 'security',
      label: <div className={styles.tabLabel}><SafetyOutlined /> <span>账号安全</span></div>,
      children: (
        <div className={styles.tabContent}>
          <div className={styles.sectionTitle}>
            <h2>账号安全</h2>
            <p>更新密码以保护您的账户安全</p>
          </div>

          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handlePasswordChange}
            className={styles.formSection}
          >
            <Form.Item
              label="当前密码"
              name="oldPassword"
              rules={[{ required: true, message: '请输入当前密码' }]}
            >
              <Input.Password size="large" prefix={<LockOutlined />} placeholder="请输入当前密码" />
            </Form.Item>

            <Form.Item
              label="新密码"
              name="newPassword"
              rules={[{ required: true, message: '请输入新密码' }, { min: 6, message: '密码至少6位' }]}
            >
              <Input.Password size="large" prefix={<LockOutlined />} placeholder="请输入新密码" />
            </Form.Item>

            <Form.Item
              label="确认新密码"
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: '请确认新密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password size="large" prefix={<LockOutlined />} placeholder="请再次输入新密码" />
            </Form.Item>

            <Form.Item style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit">
                修改密码
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      key: 'general',
      label: <div className={styles.tabLabel}><UserOutlined /> <span>个人资料</span></div>,
      children: (
        <div className={styles.tabContent}>
          <div className={styles.sectionTitle}>
            <h2>个人资料（待开放）</h2>
            <p>管理您的个人信息和账户详情</p>
          </div>

          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              {storeUser?.avatar ? <img src={storeUser.avatar} alt="avatar" style={{ width: '100%', borderRadius: '50%' }} /> : <UserOutlined />}
            </div>
            <div className={styles.avatarInfo}>
              <h3>{storeUser?.username || 'User'}</h3>
              {/* <Button type="link" className={styles.uploadBtn}>更换头像</Button> */}
            </div>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdateProfile}
            className={styles.formSection}
          >
            <Form.Item
              label="用户名"
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
              help="如需更改用户名，请联系管理员"
            >
              <Input size="large" disabled placeholder="您的用户名" />
            </Form.Item>

            <Form.Item
              label="邮箱地址"
              name="email"
              rules={[{ required: true, message: '请输入邮箱' }]}
              help="如需更改邮箱，请联系管理员"
            >
              <Input size="large" disabled placeholder="您的邮箱" />
            </Form.Item>

            <Form.Item style={{ marginTop: 40 }}>
              <Button type="primary" loading={loading}>
                保存更改
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      key: 'other',
      label: <div className={styles.tabLabel}><SettingOutlined /> <span>其他设置</span></div>,
      children: (
        <div className={styles.tabContent}>
          <div className={styles.sectionTitle}>
            <h2>其他设置</h2>
            <p>更多个性化选项</p>
          </div>
          <div style={{ padding: '40px 0', textAlign: 'center', color: '#ccc' }}>
            更多功能正在开发中......
          </div>
        </div>
      )
    }
  ]

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.settingsWrapper}>
          <Tabs
            tabPlacement="left"
            items={items}
            defaultActiveKey="notification"
            style={{ height: '100%' }}
          />
        </div>

        <Modal
          title="开启邮件提醒"
          open={isModalOpen}
          onOk={handleSubscribeSubmit}
          onCancel={() => setIsModalOpen(false)}
          confirmLoading={modalLoading}
          destroyOnClose
          style={{ marginTop: 150 }}
        >
          <Form form={subscribeForm} layout="vertical" preserve={false}>
            <Form.Item name="timezone" label="时区" initialValue="Asia/Shanghai" rules={[{ required: true, message: '请选择时区' }]}>
              <Select
                showSearch
                placeholder="请选择时区"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (String(option?.label ?? '')).toLowerCase().includes(input.toLowerCase())
                }
                options={[
                  { label: '上海 (Asia/Shanghai)', value: 'Asia/Shanghai' },
                  { label: '伦敦 (Europe/London)', value: 'Europe/London' },
                  { label: '纽约 (America/New_York)', value: 'America/New_York' },
                  { label: '东京 (Asia/Tokyo)', value: 'Asia/Tokyo' },
                  { label: '悉尼 (Australia/Sydney)', value: 'Australia/Sydney' },
                  { label: 'UTC', value: 'UTC' },
                ]}
              />
            </Form.Item>
            <Form.Item name="dailyTime" label="提醒时间" initialValue={dayjs('08:00', 'HH:mm')} rules={[{ required: true, message: '请选择提醒时间' }]}>
              <TimePicker format="HH:mm" style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  )
}

export default Settings
