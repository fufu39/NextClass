import { SettingOutlined } from '@ant-design/icons'

const Settings = () => {
  return (
     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#9ca3af' }}>
       <div style={{ textAlign: 'center' }}>
          <SettingOutlined style={{ fontSize: 48, marginBottom: 16 }} />
          <p>系统设置功能开发中...</p>
       </div>
    </div>
  )
}

export default Settings
