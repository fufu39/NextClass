import { useState } from 'react'
import type { ComponentProps } from 'react'
import { Tour } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import styles from './index.module.scss'

const AppTour = () => {
  const [open, setOpen] = useState(false)

  const steps: ComponentProps<typeof Tour>['steps'] = [
    {
      title: '使用指南',
      description: '这里是帮助中心。您可以查看使用技巧、更新日志以及联系方式。',
      target: () => document.getElementById('tips-btn') as HTMLElement,
    },
    {
      title: '智能课表',
      description: '在这里查看和管理您的课程表。支持导入课表、周视图切换。',
      target: () => document.getElementById('nav-item-/dashboard/schedule') as HTMLElement,
    },
    {
      title: 'AI 助理',
      description: '询问课程时间相关问题。AI 助理随时为您提供解答。',
      target: () => document.getElementById('nav-item-/dashboard/ai-chat') as HTMLElement,
    },
    {
      title: '仪表板',
      description: '您的主控台。快速概览日期时间、今日课程',
      target: () => document.getElementById('nav-item-/dashboard') as HTMLElement,
    },
    {
      title: '系统设置',
      description: '个性化您的账户和应用设置。支持订阅、修改密码、黑暗模式。',
      target: () => document.getElementById('nav-item-/dashboard/settings') as HTMLElement,
    },
  ]

  return (
    <div className={styles.tourWrapper}>
      <div className={styles.tourBtn} onClick={() => setOpen(true)}>
        <QuestionCircleOutlined />
      </div>
      <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
    </div>
  )
}

export default AppTour
