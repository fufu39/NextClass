import { Outlet } from 'react-router-dom'
import { ConfigProvider, theme, App as AntdApp } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import 'antd/dist/reset.css'

function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#333333',
          colorSuccess: '#2ed573',
          colorWarning: '#ffa502',
          colorError: '#ff4757',
          colorInfo: '#333333',
          colorBgBase: '#ffffff',
          colorBgLayout: '#f5f7f9',
          colorTextBase: '#101010',
          colorLink: '#101010',
          borderRadius: 16,
          fontFamily: "Poppins, Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif"
        }
      }}
    >
      <AntdApp>
        <Outlet />
      </AntdApp>
    </ConfigProvider>
  )
}

export default App
