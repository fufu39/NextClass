// 主界面骨架
import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import {
  AppstoreOutlined,
  CalendarOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  RobotOutlined,
  MenuOutlined
} from '@ant-design/icons'
import { App, Avatar, Breadcrumb, Button } from 'antd'
import { useUserStore } from '../../stores/user'
import { TipsButton } from '../../components/Tips'
import AppTour from '../../components/AppTour'
import styles from './index.module.scss'
import logo from '../../assets/logo.png'

const DashboardLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useUserStore()
  const { message } = App.useApp()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

  const handleMenuClick = (key: string) => {
    navigate(key)
    setMobileMenuOpen(false)
  }

  if (!user) return null

  return (
    <div className={styles.dashboardContainer}>
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className={styles.overlay}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Floating Sidebar */}
      <div className={`${styles.sidebar} ${mobileMenuOpen ? styles.mobileOpen : ''}`}>
        <div className={styles.logo}>
          <img src={logo} alt="NextClass" />
        </div>

        <div className={styles.menu}>
          {menuItems.map(item => (
            <div
              key={item.key}
              id={`nav-item-${item.key}`}
              className={`${styles.menuItem} ${activeMenu.key === item.key ? styles.active : ''}`}
              onClick={() => handleMenuClick(item.key)}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Button
                type="text"
                icon={<MenuOutlined />}
                className={styles.mobileMenuBtn}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              />
              <div className={styles.breadcrumbWrapper}>
                <Breadcrumb
                  items={[
                    { title: 'NextClass' },
                    { title: activeMenu.label }
                  ]}
                />
              </div>
              <AppTour />
              <TipsButton id="tips-btn" />
            </div>
          </div>
          <div
            className={styles.userProfile}
            onClick={() => navigate('/dashboard/settings')}
          >
            <span className={styles.username}>{user.username}</span>
            <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#101010' }} />
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
