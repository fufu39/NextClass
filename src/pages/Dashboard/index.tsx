import { useEffect } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import {
  AppstoreOutlined,
  CalendarOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  RobotOutlined
} from '@ant-design/icons'
import { App, Avatar, Breadcrumb } from 'antd'
import { useUserStore } from '../../stores/user'
import styles from './index.module.scss'
import logo from '../../assets/logo.svg'

const DashboardLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useUserStore()
  const { message } = App.useApp()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const handleLogout = () => {
    logout()
    message.success('退出登录成功')
    navigate('/login')
  }

  const menuItems = [
    { key: '/dashboard', icon: <AppstoreOutlined />, label: '仪表板' },
    { key: '/dashboard/schedule', icon: <CalendarOutlined />, label: '智能课表' },
    { key: '/dashboard/ai-chat', icon: <RobotOutlined />, label: 'AI 助理' },
    { key: '/dashboard/settings', icon: <SettingOutlined />, label: '系统设置' },
  ]

  // Find active menu item based on current path
  // Match exact path or start with path (for nested routes if any)
  // For /dashboard, we want exact match or if it's the root of dashboard
  const activeMenu = menuItems.find(item => {
    if (item.key === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/dashboard/'
    }
    return location.pathname.startsWith(item.key)
  }) || menuItems[0]

  if (!user) return null

  return (
    <div className={styles.dashboardContainer}>
      {/* Floating Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <img src={logo} alt="NextClass" />
        </div>

        <div className={styles.menu}>
          {menuItems.map(item => (
            <div
              key={item.key}
              className={`${styles.menuItem} ${activeMenu.key === item.key ? styles.active : ''}`}
              onClick={() => navigate(item.key)}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.userSection}>
          <div
            className={styles.menuItem}
            onClick={handleLogout}
            style={{ color: '#ef4444' }}
          >
            <span className={styles.icon}><LogoutOutlined /></span>
            <span>退出登录</span>
          </div>
        </div>
      </div>

      {/* Floating Content */}
      <div className={styles.mainContent}>
        <div className={styles.contentHeader}>
          <div>
            <Breadcrumb
              items={[
                { title: 'NextClass' },
                { title: activeMenu.label }
              ]}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontWeight: 500 }}>{user.username}</span>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/dashboard/settings')}
            >
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#101010' }} />
            </div>
          </div>
        </div>
        <div className={styles.contentBody}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
