import { useState, useEffect, useCallback } from 'react'
import { Row, Col, Card, Typography, Tag, Avatar, Progress, Calendar, App } from 'antd'
import type { Dayjs } from 'dayjs'
import {
    ClockCircleOutlined,
    EnvironmentOutlined,
    BookOutlined,
    RightOutlined,
    FireOutlined,
    InboxOutlined
} from '@ant-design/icons'
import { useUserStore } from '../../stores/user'
import { motion } from 'framer-motion'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import styles from './index.module.scss'
import { getScheduleByDate, type CourseVO } from '../../api/schedule'

dayjs.locale('zh-cn')

const { Title, Text } = Typography

const SECTION_TIMES: Record<number, { start: string; end: string }> = {
    1: { start: '08:30', end: '09:15' },
    2: { start: '09:20', end: '10:05' },
    3: { start: '10:20', end: '11:05' },
    4: { start: '11:10', end: '11:55' },
    5: { start: '14:30', end: '15:15' },
    6: { start: '15:20', end: '16:05' },
    7: { start: '16:20', end: '17:05' },
    8: { start: '17:10', end: '17:55' },
    9: { start: '19:30', end: '20:15' },
    10: { start: '20:20', end: '21:05' },
    11: { start: '21:10', end: '21:55' }
}

// Helper to get time in minutes for comparison
const getTimeInMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number)
    return h * 60 + m
}

const DashboardHome = () => {
    const { user } = useUserStore()
    const { message } = App.useApp()
    const [currentTime, setCurrentTime] = useState(dayjs())
    const [selectedDate, setSelectedDate] = useState(dayjs())
    const [scheduleList, setScheduleList] = useState<CourseVO[]>([])
    const [loading, setLoading] = useState(false)

    const fetchSchedule = useCallback(async (date: Dayjs) => {
        try {
            setLoading(true)
            const res = await getScheduleByDate(date.format('YYYY-MM-DD'))
            console.log(res);
            if (res.code === 200) {
                const sorted = (res.data || []).sort((a, b) => a.sectionStart - b.sectionStart)
                setScheduleList(sorted)
            } else {
                message.error(res.message || '获取课表失败')
            }
        } catch (error) {
            console.error('Fetch schedule error:', error)
            message.error('获取课表失败')
        } finally {
            setLoading(false)
        }
    }, [message])

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(dayjs()), 1000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        fetchSchedule(selectedDate)
    }, [selectedDate, fetchSchedule])

    const onDateSelect = (date: Dayjs) => {
        setSelectedDate(date)
    }

    if (!user) return null

    const getHeroClass = () => {
        if (scheduleList.length === 0) return null

        const isToday = selectedDate.isSame(dayjs(), 'day')
        if (!isToday) return scheduleList[0]

        const currentTotalMinutes = currentTime.hour() * 60 + currentTime.minute()

        // Find first class that starts after now
        const upcoming = scheduleList.find(c => {
            const timeInfo = SECTION_TIMES[c.sectionStart]
            if (!timeInfo) return false
            return getTimeInMinutes(timeInfo.start) > currentTotalMinutes
        })

        // If no upcoming class, and we have classes today, maybe show the last one (finished)? 
        // Or just the first one of the day if everything is finished?
        // Let's show the next upcoming, or the first one if all finished (to keep it simple)
        // Or better: if all finished, show the last one with "Finished" status.
        if (!upcoming) {
            // If all classes are finished, show the last one
            return scheduleList[scheduleList.length - 1]
        }
        return upcoming
    }

    const heroClass = getHeroClass()

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring" as const,
                stiffness: 100,
                damping: 12
            }
        }
    }

    const formatTime = (sectionStart: number, sectionCount: number) => {
        const startInfo = SECTION_TIMES[sectionStart]
        if (startInfo) {
            // Calculate end time based on section count? 
            // For simplicity, let's assume standard blocks or just use the mapped end if count is 2
            // If count > 2, we might need more logic.
            // Let's just use the start time and a calculated end time.
            // A section is usually 45 mins + 5 mins break?
            // Let's stick to the map for start, and approximate end.

            // Better approach: Use start of sectionStart and end of (sectionStart + sectionCount - 1)
            const endSection = sectionStart + sectionCount - 1

            // If we have explicit map for the end section
            if (SECTION_TIMES[endSection]) {
                return `${startInfo.start} - ${SECTION_TIMES[endSection].end}`
            }

            // Fallback calculation
            return `${startInfo.start} - ${startInfo.end}`
        }

        // Total fallback
        return `${String(8 + Math.floor(sectionStart / 2)).padStart(2, '0')}:00 - ${String(9 + Math.floor(sectionStart / 2)).padStart(2, '0')}:35`
    }

    const getStatus = (sectionStart: number, sectionCount: number) => {
        const isToday = selectedDate.isSame(dayjs(), 'day')
        if (!isToday) {
            return selectedDate.isBefore(dayjs(), 'day') ? 'finished' : 'upcoming'
        }

        const now = dayjs()
        const timeStr = formatTime(sectionStart, sectionCount)
        const [start, end] = timeStr.split(' - ')
        const [sh, sm] = start.split(':').map(Number)
        const [eh, em] = end.split(':').map(Number)

        const startTime = dayjs().hour(sh).minute(sm)
        const endTime = dayjs().hour(eh).minute(em)

        if (now.isAfter(endTime)) return 'finished'
        if (now.isBefore(startTime)) return 'upcoming'
        return 'ongoing'
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className={styles.container}
        >
            {/* Header Section */}
            <motion.div variants={itemVariants} className={styles.header}>
                <div>
                    <Text className={styles.date}>
                        {selectedDate.format('YYYY年MM月DD日 dddd')}
                    </Text>
                    <div className={styles.greeting}>
                        <Title level={2} style={{ margin: 0, fontWeight: 600 }}>
                            {getTimeGreeting()}，{user.username}
                        </Title>
                        <span className={styles.clock}>
                            {currentTime.format('HH:mm:ss')}
                        </span>
                    </div>
                </div>
            </motion.div>

            <Row gutter={[24, 24]}>
                {/* Left Column: Main Schedule */}
                <Col xs={24} lg={16}>
                    {/* Next Class Hero Card */}
                    <motion.div variants={itemVariants}>
                        <Card variant="borderless" className={styles.nextClassCard}>
                            <div className={styles.decorationCircle} />
                            <div className={styles.cardContent}>
                                {heroClass ? (
                                    <>
                                        <div className={styles.cardHeader}>
                                            <Tag className={styles.statusTag}>
                                                Next Class
                                            </Tag>
                                            <Text className={styles.timeText}>
                                                {formatTime(heroClass.sectionStart, heroClass.sectionCount).split(' - ')[0]}
                                            </Text>
                                        </div>

                                        <Title level={2} className={styles.courseTitle}>
                                            {heroClass.courseName}
                                        </Title>

                                        <div className={styles.cardFooter}>
                                            <span>
                                                <EnvironmentOutlined /> {heroClass.classroom}
                                            </span>
                                            <span>
                                                <Avatar size="small" style={{ backgroundColor: '#f56a00' }}>{heroClass.teacherName?.[0]}</Avatar> {heroClass.teacherName}
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                        <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>
                                            <InboxOutlined />
                                        </div>
                                        <Title level={3} style={{ color: 'white', margin: 0 }}>今天暂无课程</Title>
                                        <Text style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8, display: 'block' }}>好好休息，享受生活</Text>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Today's Schedule List */}
                    <motion.div variants={itemVariants}>
                        <div className={styles.sectionHeader}>
                            <Title level={4}>{selectedDate.isSame(dayjs(), 'day') ? '今日课程' : '课程列表'}</Title>
                            <Text className={styles.viewAll}>查看全部 <RightOutlined /></Text>
                        </div>
                        <Card variant="borderless" className={styles.scheduleListCard}>
                            {scheduleList.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    {scheduleList.map((item, index) => {
                                        const status = getStatus(item.sectionStart, item.sectionCount)
                                        return (
                                            <div key={index} className={styles.listItem}>
                                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                                                    <div className={styles.courseIcon} style={{
                                                        background: status === 'finished' ? '#f3f4f6' : '#101010',
                                                        color: status === 'finished' ? '#9ca3af' : 'white',
                                                        flexShrink: 0
                                                    }}>
                                                        <BookOutlined />
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                            <div>
                                                                <Text strong style={{ fontSize: 16, color: status === 'finished' ? '#9ca3af' : '#101010', display: 'block', marginBottom: 4 }}>
                                                                    {item.courseName}
                                                                </Text>
                                                                <div style={{ display: 'flex', gap: 16, fontSize: 14 }}>
                                                                    <span style={{ color: status === 'finished' ? '#d1d5db' : '#6b7280' }}>
                                                                        <ClockCircleOutlined /> {formatTime(item.sectionStart, item.sectionCount)}
                                                                    </span>
                                                                    <span style={{ color: status === 'finished' ? '#d1d5db' : '#6b7280' }}>
                                                                        <EnvironmentOutlined /> {item.classroom}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div style={{ marginLeft: 16 }}>
                                                                {status === 'finished' ? (
                                                                    <Tag color="default" style={{ borderRadius: 12, margin: 0 }}>已结束</Tag>
                                                                ) : status === 'ongoing' ? (
                                                                    <Tag color="processing" style={{ borderRadius: 12, margin: 0 }}>进行中</Tag>
                                                                ) : (
                                                                    <Tag color="success" style={{ borderRadius: 12, margin: 0 }}>未开始</Tag>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <div className={styles.emptyState}>
                                    <InboxOutlined className={styles.icon} />
                                    <p>今天没有课程安排，好好休息吧！</p>
                                </div>
                            )}
                        </Card>
                    </motion.div>
                </Col>

                {/* Right Column: Widgets */}
                <Col xs={24} lg={8}>
                    {/* Study Status */}
                    <motion.div variants={itemVariants}>
                        <Card variant="borderless" className={styles.statsCard}>
                            <div className={styles.statsHeader}>
                                <div className={styles.iconWrapper}>
                                    <FireOutlined />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: 16 }}>本周学习时长</div>
                                    <div style={{ fontSize: 12, color: '#9ca3af' }}>Keep it up!</div>
                                </div>
                            </div>
                            <div className={styles.statsContent}>
                                <Text style={{ fontSize: 36, fontWeight: 700 }}>24.5</Text>
                                <Text type="secondary"> 小时</Text>
                            </div>
                            <Progress percent={75} strokeColor="#101010" showInfo={false} size="small" />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                                <Text type="secondary" style={{ fontSize: 12 }}>目标: 32h</Text>
                                <Text type="secondary" style={{ fontSize: 12 }}>75%</Text>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Mini Calendar */}
                    <motion.div variants={itemVariants}>
                        <Card variant="borderless" className={styles.calendarCard}>
                            <Calendar
                                fullscreen={false}
                                value={selectedDate}
                                onChange={onDateSelect}
                            />
                        </Card>
                    </motion.div>
                </Col>
            </Row>
        </motion.div>
    )
}

const getTimeGreeting = () => {
    const hour = dayjs().hour()
    if (hour < 6) return '夜深了'
    if (hour < 9) return '早上好'
    if (hour < 12) return '上午好'
    if (hour < 14) return '中午好'
    if (hour < 18) return '下午好'
    if (hour < 22) return '晚上好'
    return '夜深了'
}

export default DashboardHome
