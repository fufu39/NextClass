import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { BulbOutlined, CloseOutlined, InfoCircleOutlined, ToolOutlined, AppstoreOutlined, HourglassOutlined, MailOutlined } from '@ant-design/icons'
import { motion, AnimatePresence } from 'framer-motion'
import dayjs from 'dayjs'
import styles from './index.module.scss'

export const TipsButton = ({ id }: { id?: string }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div id={id} className={styles.triggerWrapper} onClick={() => setIsOpen(true)}>
        <div className={styles.triggerBtn}>
          <div className={styles.icon}>
            <BulbOutlined />
          </div>
          <span className={styles.text}>Tips & Guides</span>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <TipsOverlay onClose={() => setIsOpen(false)} />
        )}
      </AnimatePresence>
    </>
  )
}

const TipsOverlay = ({ onClose }: { onClose: () => void }) => {
  const [lastUpdate, setLastUpdate] = useState<string>('Loading...')

  useEffect(() => {
    const fetchRepoInfo = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/fufu39/NextClass')
        if (response.ok) {
          const data = await response.json()
          // GitHub API returns UTC, we format it nicely
          if (data.pushed_at) {
            setLastUpdate(dayjs(data.pushed_at).locale('en').format('MM.DD，hh:mm A'))
          } else {
            setLastUpdate('Unknown')
          }
        } else {
          setLastUpdate('Offline')
        }
      } catch (error) {
        console.error('Failed to fetch repo info:', error)
        setLastUpdate('Offline')
      }
    }

    fetchRepoInfo()
  }, [])

  return createPortal(
    <motion.div
      className={styles.overlayWrapper}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.paperContainer}
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{
          scale: 1,
          opacity: 1,
          y: 0,
          transition: {
            type: "spring",
            damping: 20,
            stiffness: 300,
            mass: 0.8
          }
        }}
        exit={{ scale: 0.95, opacity: 0, y: 20, transition: { duration: 0.2 } }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.closeBtn} onClick={onClose}>
          <CloseOutlined />
        </div>

        <div className={styles.content}>
          <h1>💡 Tips & Guides</h1>

          <blockquote>
            NextClass 致力于为您提供智能、高效的课程管理体验。如果您在使用过程中遇到任何问题，可以随时查阅本指南，或者联系我们。
          </blockquote>

          <h2><InfoCircleOutlined style={{ marginRight: 8 }} /> 温馨提示</h2>

          <ul>
            <li><strong>课表导入：</strong> 建议截取高清大图，放大课表界面至 <i>120%~150%</i> 截取效果更佳</li>
            <li><strong>操作频繁：</strong> 如果报错提示<span style={{ color: '#e44830ff' }}>操作频繁</span>，表示请求频率过高，请稍后重试</li>
          </ul>

          <h2><ToolOutlined style={{ marginRight: 8 }} /> 开发中功能</h2>

          <ul>
            <li style={{ textDecoration: 'line-through', color: '#666' }}><strong>课程邮件提醒：</strong> 系统设置界面通知设置内添加课程邮件提醒逻辑，实现每日订阅推送</li>
            <li style={{ textDecoration: 'line-through', color: '#666' }}><strong>清空课表按钮：</strong> 智能课表界面内添加清空课表按钮，以及显著的截图优化提示信息</li>
            <li style={{ textDecoration: 'line-through', color: '#666' }}><strong>修改密码：</strong> 系统设置界面账号安全内重构界面，修改为获取邮件验证码以重置密码</li>
            <li style={{ textDecoration: 'line-through', color: '#666' }}><strong>黑暗模式：</strong> 系统设置界面其他设置内添加黑暗模式，通过全局色调反转实现</li>
            <li style={{ textDecoration: 'line-through', color: '#666' }}><strong>响应式布局：</strong> 所有界面添加响应式布局设计，适配移动端屏幕</li>
          </ul>

          <h2><HourglassOutlined style={{ marginRight: 8 }} /> 未开发功能</h2>
          <p style={{ marginBottom: 0, lineHeight: '1.6' }}>
            个人资料修改，本周课程时长统计
          </p>

          <h2><AppstoreOutlined style={{ marginRight: 8 }} /> 系统状态</h2>
          <div className={styles.systemStatus}>
            <div className={styles.statusItem}>
              <div className={styles.label}>System Status</div>
              <div className={styles.operational}>
                <div className={styles.dot}></div>
                Operational
              </div>
            </div>
            <div className={styles.statusItem}>
              <div className={styles.label}>Last Update</div>
              <div className={styles.value}>{lastUpdate}</div>
            </div>
          </div>

          <h2><MailOutlined style={{ marginRight: 8 }} /> 联系方式</h2>
          <p style={{ marginBottom: 12 }}>
            如果您在使用过程中遇到任何Bug，欢迎通过以下方式联系我们：
          </p>
          <ul>
            <li>通过 <a href="https://github.com/fufu39/NextClass/issues" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>GitHub Issues</a> 报告Bug</li>
            <li>发送邮件到 2090660718@qq.com</li>
          </ul>

          <p style={{ marginTop: 60, textAlign: 'right', color: '#9ca3af', fontStyle: 'italic' }}>
            NextClass Team / 2025.11.30 - Now
          </p>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  )
}
