import { useEffect, useState } from 'react'
import { Card, Typography, Row, Col, Statistic, Button, message } from 'antd'
import { UserOutlined, DashboardOutlined, LogoutOutlined } from '@ant-design/icons'
import { useUserStore } from '../../stores/user'
import { useNavigate } from 'react-router-dom'

const { Title } = Typography

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useUserStore()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      message.warning('请先登录')
      navigate('/login')
    }
  }, [user, navigate])

  const handleLogout = () => {
    setLoading(true)
    setTimeout(() => {
      logout()
      message.success('退出登录成功')
      navigate('/login')
      setLoading(false)
    }, 1000)
  }

  if (!user) {
    return null
  }

  return (
    <div className="neon-bg">
      <div className="neon-container">
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2} className="neon-title">课表仪表板</Title>
            <p>欢迎回来，{user.username}！</p>
          </div>
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            loading={loading}
          >
            退出登录
          </Button>
        </div>

        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable className="neon-card">
              <Statistic
                title="用户总数"
                value={1234}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable className="neon-card">
              <Statistic
                title="今日访问"
                value={567}
                prefix={<DashboardOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable className="neon-card">
              <Statistic
                title="订单数量"
                value={89}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable className="neon-card">
              <Statistic
                title="收入金额"
                value={12800}
                precision={2}
                prefix="¥"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="用户信息" hoverable className="neon-card">
              <div>
                <div style={{ marginBottom: 8 }}>
                  <span>用户名：</span>
                  <span className="font-medium">{user.username}</span>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <span>邮箱：</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <span>用户ID：</span>
                  <span className="font-medium">{user.id}</span>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="系统信息" hoverable className="neon-card">
              <div>
                <div style={{ marginBottom: 8 }}>
                  <span>系统版本：</span>
                  <span className="font-medium">v1.0.0</span>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <span>前端框架：</span>
                  <span className="font-medium">React 18</span>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <span>UI组件库：</span>
                  <span className="font-medium">Ant Design 5</span>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <span>构建工具：</span>
                  <span className="font-medium">Vite</span>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        <div style={{ marginTop: 24 }}>
          <Card title="本周课表" hoverable className="neon-card">
            <div className="grid-timetable">
              <div className="neon-cell">节次</div>
              <div className="neon-cell">周一</div>
              <div className="neon-cell">周二</div>
              <div className="neon-cell">周三</div>
              <div className="neon-cell">周四</div>
              <div className="neon-cell">周五</div>
              <div className="neon-cell">周六</div>
              <div className="neon-cell">周日</div>

              {Array.from({ length: 6 }).map((_, pIdx) => (
                <div key={`row-${pIdx}`} style={{ display: 'contents' }}>
                  <div className="neon-cell">第{pIdx + 1}节</div>
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={`cell-${pIdx}-${i}`} className="neon-cell">待安排</div>
                  ))}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
