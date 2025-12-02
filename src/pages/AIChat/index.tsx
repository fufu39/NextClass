import { useState, useEffect, useRef } from 'react'
import { Button, Input, message, Spin } from 'antd'
import { RobotOutlined, UserOutlined, SendOutlined, ImportOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import styles from './index.module.scss'
import { getScheduleImportStatus, askScheduleAI } from '../../api/schedule'

const { TextArea } = Input

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
}

const AIChat = () => {
  const navigate = useNavigate()
  const [isImported, setIsImported] = useState<boolean | null>(null)
  const [checkingStatus, setCheckingStatus] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    checkImportStatus()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const checkImportStatus = async () => {
    try {
      const res = await getScheduleImportStatus()
      console.log(res);

      if (res.code === 200) {
        setIsImported(res.data)
      }
    } catch (error) {
      console.error('Failed to check import status:', error)
      const errorMessage = error instanceof Error ? error.message : (typeof error === 'string' ? error : '检查课表导入状态失败')
      message.error(errorMessage)
    } finally {
      setCheckingStatus(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async () => {
    if (!inputValue.trim() || loading) return

    const question = inputValue.trim()
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: question
    }

    setMessages(prev => [...prev, newMessage])
    setInputValue('')
    setLoading(true)

    try {
      const date = dayjs().format('YYYY-MM-DD')
      const res = await askScheduleAI({ question, date })
      console.log(res);

      if (res.code === 200) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: res.data
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        message.error(res.message || 'AI 响应失败')
      }
    } catch (error) {
      console.error('AI request failed:', error)
      message.error('发送失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (checkingStatus) {
    return (
      <div className={styles.container} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Spin size="large" tip="正在初始化 AI 助手..." />
      </div>
    )
  }

  if (!isImported) {
    return (
      <div className={styles.container}>
        <div className={styles.notImported}>
          <RobotOutlined style={{ fontSize: 64, color: '#333', opacity: 0.6, marginBottom: 24 }} />
          <h2>NextClass 智能学习助手</h2>
          <div className={styles.description}>
            <p>面向电子科技大学的智能课表与学习助手。</p>
            <p>系统对电子科大教务系统的课表截图定制化解析：经 Qwen-VL 带理解的 OCR + 本地规则解析自动结构化入库，支持自然语言查询「明天/本周有什么课」，并通过邮件推送提醒课程与任务。</p>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<ImportOutlined />}
            onClick={() => navigate('/dashboard/schedule')}
            className={styles.importBtn}
          >
            前往智能课表导入
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.chatContainer}>
        <div className={styles.messageList}>
          {messages.length === 0 && (
            <div className={styles.emptyPrompt}>
              <RobotOutlined className={styles.emptyIcon} />
              <p className={styles.emptyTitle}>你好！我是你的智能课表助手。</p>
              <p className={styles.emptySub}>你可以问我："今天有什么课？" 或 "明天上午有课吗？"</p>
            </div>
          )}

          {messages.map(msg => (
            <div key={msg.id} className={`${styles.messageItem} ${styles[msg.type]}`}>
              {msg.type === 'ai' && (
                <div className={`${styles.avatar} ${styles.aiAvatar}`}>
                  <RobotOutlined />
                </div>
              )}
              <div className={styles.messageContent}>
                {msg.content}
              </div>
              {msg.type === 'user' && (
                <div className={`${styles.avatar} ${styles.userAvatar}`}>
                  <UserOutlined />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className={`${styles.messageItem} ${styles.ai}`}>
              <div className={`${styles.avatar} ${styles.aiAvatar}`}>
                <RobotOutlined />
              </div>
              <div className={styles.messageContent}>
                <div className={styles.loadingDots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.inputArea}>
          <div className={styles.inputWrapper}>
            <TextArea
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入你的问题，例如：今天下午有什么课？"
              autoSize={{ minRows: 1, maxRows: 4 }}
            />
          </div>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            disabled={!inputValue.trim() || loading}
            style={{ height: 'auto', padding: '10px 20px', margin: '2.5px 0' }}
          >
            发送
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AIChat
