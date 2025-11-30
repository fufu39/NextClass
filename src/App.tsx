import { Outlet } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import 'antd/dist/reset.css'

function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          colorSuccess: '#2ed573',
          colorWarning: '#ffa502',
          colorError: '#ff4757',
          colorInfo: '#1890ff',
          colorBgBase: '#ffffff',
          colorBgLayout: '#f8f9fa',
          colorTextBase: '#101010',
          colorLink: '#1890ff',
          borderRadius: 16,
          fontFamily: "Poppins, Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif"
        }
      }}
    >
      <Outlet />
    </ConfigProvider>
  )
}

export default App
