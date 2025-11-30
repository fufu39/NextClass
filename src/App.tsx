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
          colorPrimary: '#ff005c',
          colorInfo: '#0066ff',
          colorBgBase: '#ffffff',
          colorTextBase: '#101010',
          borderRadius: 16
        }
      }}
    >
      <Outlet />
    </ConfigProvider>
  )
}

export default App
