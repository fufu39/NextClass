import React, { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import { Button, Select, Spin, Card, Typography, App, Modal, Form, Input, DatePicker, Upload, Checkbox, Image, Popover } from 'antd';
import { UploadOutlined, CalendarOutlined, LeftOutlined, RightOutlined, InboxOutlined, EnvironmentOutlined, UserOutlined, ClockCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import type { CourseVO } from '../../api/schedule';
import { getScheduleImportStatus, getScheduleByWeek, uploadScheduleImage, clearSchedule } from '../../api/schedule';
import styles from './index.module.scss';
import defaultClassImg from '../../assets/class.png';

const { Title, Text } = Typography;
const { Option } = Select;
const { Dragger } = Upload;

const WEEKS = Array.from({ length: 20 }, (_, i) => i + 1);
const DAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

// Layout configuration based on user requirements
const SCHEDULE_LAYOUT = [
  { type: 'section', id: 1, time: '08:30 - 09:15', weight: 60 },
  { type: 'section', id: 2, time: '09:20 - 10:05', weight: 60 },
  { type: 'section', id: 3, time: '10:20 - 11:05', weight: 60 },
  { type: 'section', id: 4, time: '11:10 - 11:55', weight: 60 },
  { type: 'break', name: '午餐', time: '12:00 - 12:30', weight: 30 },
  { type: 'break', name: '午休', time: '12:40 - 14:10', weight: 30 },
  { type: 'section', id: 5, time: '14:30 - 15:15', weight: 60 },
  { type: 'section', id: 6, time: '15:20 - 16:05', weight: 60 },
  { type: 'section', id: 7, time: '16:20 - 17:05', weight: 60 },
  { type: 'section', id: 8, time: '17:10 - 17:55', weight: 60 },
  { type: 'section', id: 9, time: '19:30 - 20:15', weight: 60 },
  { type: 'section', id: 10, time: '20:20 - 21:05', weight: 60 },
  { type: 'section', id: 11, time: '21:10 - 21:55', weight: 60 },
];

const TOTAL_WEIGHT = SCHEDULE_LAYOUT.reduce((acc, item) => acc + item.weight, 0);

// Predefined colors for courses
const COURSE_COLORS = [
  '#e6f7ff', '#f9f0ff', '#fff7e6', '#f6ffed', '#fff1f0', '#e6fffb', '#f0f5ff', '#fffbe6'
];
const COURSE_TEXT_COLORS = [
  '#1890ff', '#722ed1', '#fa8c16', '#52c41a', '#f5222d', '#13c2c2', '#2f54eb', '#faad14'
];

const Schedule = () => {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [importChecking, setImportChecking] = useState(true);
  const [isImported, setIsImported] = useState(false);
  const [week, setWeek] = useState<number | undefined>(undefined); // Start as undefined
  const [scheduleData, setScheduleData] = useState<CourseVO[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  // Ref to track last fetched week to avoid double fetching
  const lastFetchedWeek = React.useRef<number | undefined>(undefined);

  // Import Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [form] = Form.useForm();
  const [useDefaultImg, setUseDefaultImg] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchSchedule = useCallback(async (w?: number) => {
    // If we are asking for a specific week that we just fetched, skip
    if (w !== undefined && w === lastFetchedWeek.current) {
      return;
    }

    setScheduleLoading(true);
    try {
      const res = await getScheduleByWeek(w);
      console.log(res);

      if (res.code === 200) {
        const data = res.data || [];
        setScheduleData(data);

        let currentWeek = w;
        // If we didn't have a week set (first load), try to set it from the response
        if (w === undefined && data.length > 0) {
          currentWeek = data[0].week;
          if (currentWeek) {
            setWeek(currentWeek);
          }
        }
        // Update last fetched week
        lastFetchedWeek.current = currentWeek;
      }
    } catch (error) {
      console.error('Failed to fetch schedule', error);
      message.error((error as Error).message || '获取课表失败');
    } finally {
      setScheduleLoading(false);
    }
  }, [message]);

  const checkImportStatus = useCallback(async () => {
    setImportChecking(true);
    try {
      const res = await getScheduleImportStatus();
      if (res.code === 200) {
        const imported = res.data;
        setIsImported(imported);

        if (imported) {
          // Pre-fetch schedule before removing loading state
          await fetchSchedule(undefined);
        }
      }
    } catch (error) {
      console.error('Failed to check import status', error);
      message.error((error as Error).message || '无法获取课表状态');
    } finally {
      setImportChecking(false);
      setLoading(false);
    }
  }, [message, fetchSchedule]);

  useEffect(() => {
    checkImportStatus();
  }, [checkImportStatus]);

  useEffect(() => {
    if (isImported && week !== undefined) {
      fetchSchedule(week);
    }
  }, [isImported, week, fetchSchedule]);


  const handleImport = () => {
    setIsModalOpen(true);
    setUseDefaultImg(false);
    setFileList([]);
    setPreviewImage(null);
    form.resetFields();
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleUploadSubmit = async () => {
    try {
      const values = await form.validateFields();
      let fileToUpload: File | null = null;

      setImporting(true);

      if (useDefaultImg) {
        // Fetch default image
        try {
          const response = await fetch(defaultClassImg);
          const blob = await response.blob();
          fileToUpload = new File([blob], 'class.png', { type: 'image/png' });
        } catch {
          message.error('无法加载默认图片');
          setImporting(false);
          return;
        }
      } else {
        if (fileList.length === 0) {
          message.error('请选择文件或使用默认图片');
          setImporting(false);
          return;
        }
        fileToUpload = fileList[0].originFileObj;
      }

      if (!fileToUpload) {
        message.error('文件处理失败');
        setImporting(false);
        return;
      }

      const res = await uploadScheduleImage({
        termName: values.termName,
        startDate: values.startDate.format('YYYY-MM-DD'),
        file: fileToUpload
      });

      if (res.code === 200) {
        message.success('导入成功');
        setIsModalOpen(false);
        // Reset week and refresh status
        setWeek(undefined);
        checkImportStatus();
      } else {
        message.error(res.message || '导入失败');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setImporting(false);
    }
  };

  const getColorIndex = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % COURSE_COLORS.length;
  };

  // Calculate vertical position (top %)
  const getTopPercent = (sectionId: number) => {
    let weightSum = 0;
    for (const item of SCHEDULE_LAYOUT) {
      if (item.type === 'section' && item.id === sectionId) {
        break;
      }
      weightSum += item.weight;
    }
    return (weightSum / TOTAL_WEIGHT) * 100;
  };

  const getCourseTimeRange = (startSection: number, count: number) => {
    const startItem = SCHEDULE_LAYOUT.find(item => item.type === 'section' && item.id === startSection);
    const endItem = SCHEDULE_LAYOUT.find(item => item.type === 'section' && item.id === startSection + count - 1);

    if (startItem && endItem) {
      const startTime = startItem.time.split(' - ')[0];
      const endTime = endItem.time.split(' - ')[1];
      return `${startTime} - ${endTime}`;
    }
    return '';
  };

  // Calculate height %
  const getHeightPercent = (sectionStart: number, sectionCount: number) => {
    let weightSum = 0;
    let foundStart = false;
    let sectionsCovered = 0;

    // Logic: We need to traverse the layout starting from the start section.
    // We need to cover 'sectionCount' actual SECTIONS (type='section').
    // Any 'break' items encountered in between must also be included in the height.

    for (const item of SCHEDULE_LAYOUT) {
      // Find the start
      if (!foundStart) {
        if (item.type === 'section' && item.id === sectionStart) {
          foundStart = true;
        }
      }

      if (foundStart) {
        // Add weight of current item (whether section or break)
        weightSum += item.weight;

        if (item.type === 'section') {
          sectionsCovered++;
        }

        // If we have covered enough sections, we stop.
        // BUT, we need to check if we should stop right here.
        if (sectionsCovered >= sectionCount) {
          // We just finished the last required section.
          break;
        }
      }
    }

    return (weightSum / TOTAL_WEIGHT) * 100;
  };

  const handleClearSchedule = async () => {
    Modal.confirm({
      title: '确认清空课表？',
      content: '清空后将无法恢复，是否继续？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res = await clearSchedule();
          if (res.code === 200) {
            message.success('课表已清空');
            setIsImported(false);
            setScheduleData([]);
            setWeek(undefined);
            checkImportStatus();
          } else {
            message.error(res.message || '清空失败');
          }
        } catch (error) {
          message.error('操作失败');
        }
      }
    });
  };

  const modalElement = (
    <Modal
      title="导入课表"
      open={isModalOpen}
      onCancel={handleModalCancel}
      width={560}
      destroyOnClose
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ flex: 1, textAlign: 'left', fontSize: '18px', color: '#ff4d4f', lineHeight: '1.3', margin: '0 32px 0 12px' }}>
            建议截取高清大图，放大课表界面至120% ~ 150%截取效果更佳
          </div>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <Button onClick={handleModalCancel}>取消</Button>
            <Button type="primary" onClick={handleUploadSubmit} loading={importing}>确定</Button>
          </div>
        </div>
      }
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item
          name="termName"
          label="学期名称"
          rules={[{ required: true, message: '请输入学期名称' }]}
          initialValue="2025-2026学年1学期"
        >
          <Input placeholder="例如：2025-2026学年1学期" allowClear />
        </Form.Item>
        <Form.Item
          name="startDate"
          label="学期开始日期"
          rules={[{ required: true, message: '请选择开始日期' }]}
          initialValue={dayjs('2025-09-01')}
        >
          <DatePicker style={{ width: '100%' }} placeholder="选择日期" />
        </Form.Item>

        <Form.Item label="课表图片" required>
          <div style={{ marginBottom: 12 }}>
            <Checkbox
              checked={useDefaultImg}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setUseDefaultImg(e.target.checked);
                if (e.target.checked) {
                  setFileList([]);
                  setPreviewImage(defaultClassImg);
                } else {
                  setPreviewImage(null);
                }
              }}
            >
              使用示例图片 (assets/class.png)
            </Checkbox>
          </div>

          <div style={{ height: 220 }}>
            {useDefaultImg ? (
              <div style={{
                height: '100%',
                border: '1px dashed #d9d9d9',
                borderRadius: 8,
                background: '#fafafa',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                // padding: 8
              }}>
                <Image
                  src={previewImage || defaultClassImg}
                  alt="示例图片"
                  height={160}
                  style={{ objectFit: 'contain', maxWidth: '100%' }}
                />
                <div style={{ marginTop: 5, color: '#999', fontSize: 14 }}>已选择内置演示课表图片</div>
              </div>
            ) : (
              <Dragger
                fileList={fileList}
                beforeUpload={(file) => {
                  const isLt5M = file.size / 1024 / 1024 < 5;
                  if (!isLt5M) {
                    message.error('图片大小不能超过 5MB!');
                    return Upload.LIST_IGNORE;
                  }
                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onload = () => setPreviewImage(reader.result as string);
                  return false;
                }}
                onChange={({ fileList }) => {
                  setFileList(fileList.slice(-1));
                  if (fileList.length === 0) setPreviewImage(null);
                }}
                maxCount={1}
                accept="image/png,image/jpg,image/jpeg"
                showUploadList={false}
                height={220}
              >
                {previewImage ? (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Image
                      src={previewImage}
                      alt="预览"
                      height={160}
                      style={{ objectFit: 'contain', maxWidth: '100%' }}
                    />
                    <div style={{ marginTop: 5, color: '#999', fontSize: 14 }}>点击图片放大，点击空白处更换</div>
                  </div>
                ) : (
                  <>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">点击或拖拽上传文件</p>
                    <p className="ant-upload-hint">支持 PNG, JPG, JPEG 格式 (最大5MB)</p>
                  </>
                )}
              </Dragger>
            )}
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );

  if (loading || importChecking) {
    return (
      <div className={styles.loadingContainer} style={{ flexDirection: 'column', gap: 16 }}>
        <Spin size="large" />
        <div style={{ color: '#999' }}>加载中...</div>
      </div>
    );
  }

  if (!isImported) {
    return (
      <>
        <div className={styles.emptyState}>
          <Card className={styles.card}>
            <div style={{ marginBottom: 24 }}>
              <CalendarOutlined className={styles.icon} />
              <Title level={3}>开启您的智能课表</Title>
              <Text type="secondary" className={styles.description}>
                您还没有导入课表。导入后，我们将为您生成可视化的周课表。
              </Text>
            </div>
            <Button
              type="primary"
              size="large"
              icon={<UploadOutlined />}
              onClick={handleImport}
              className={styles.uploadButton}
              disabled={importing}
            >
              导入课表图片
            </Button>
          </Card>
        </div>
        {modalElement}
      </>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <Title level={4} style={{ margin: 0 }}>
            {week ? `第 ${week} 周` : '本周课表'}
          </Title>
          <div className={styles.controls}>
            <Button
              icon={<LeftOutlined />}
              onClick={() => setWeek(w => (w ? Math.max(1, w - 1) : 1))}
              disabled={!week || week <= 1}
              size="small"
            />
            <Select
              value={week}
              onChange={setWeek}
              style={{ width: 100 }}
              size="middle"
              placeholder="选择周"
            >
              {WEEKS.map(w => <Option key={w} value={w}>第 {w} 周</Option>)}
            </Select>
            <Button
              icon={<RightOutlined />}
              onClick={() => setWeek(w => (w ? Math.min(20, w + 1) : 1))}
              disabled={!week || week >= 20}
              size="small"
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: '#666', fontSize: '18px', marginRight: '12px' }}>建议截取高清大图，放大课表界面至120%~150%截取效果更佳</span>
          <Button icon={<UploadOutlined />} onClick={handleImport} size="middle" type="primary" disabled={importing}>
            重新导入
          </Button>
          <Button icon={<DeleteOutlined />} onClick={handleClearSchedule} size="middle">
            清空课表
          </Button>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className={styles.scheduleCard}>
        {scheduleLoading ? (
          <div className={styles.loadingContainer}>
            <Spin size="large" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          >
            {/* Header Row */}
            <div className={styles.gridHeader}>
              <div className={styles.timeHeader}>时间</div>
              {DAYS.map((day) => (
                <div key={day} className={styles.dayHeader}>
                  {day}
                </div>
              ))}
            </div>

            {/* Grid Body */}
            <div className={styles.gridBody}>
              <div className={styles.gridContent}>
                {SCHEDULE_LAYOUT.map((row, index) => (
                  <div
                    key={index}
                    className={`${styles.timeRow} ${row.type === 'break' ? styles.breakRow : ''}`}
                    style={{ flex: row.weight }}
                  >
                    {/* Time Column */}
                    <div className={styles.timeSlot}>
                      {row.type === 'section' ? (
                        <>
                          <div className={styles.sectionIndex}>{row.id}</div>
                          <div className={styles.timeRange}>{row.time}</div>
                        </>
                      ) : (
                        <div className={styles.timeRange}>{row.time}</div>
                      )}
                    </div>

                    {/* Day Columns (Background) */}
                    {DAYS.map((_, dIndex) => (
                      <div key={dIndex} className={styles.dayCell}>
                        {row.type === 'break' && (
                          <div className={styles.breakLabel}>{row.name}</div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}

                {/* Overlay Courses */}
                <div className={styles.courseOverlay}>
                  {scheduleData.map((course, idx) => {
                    const dayIndex = course.dayOfWeek - 1;
                    // course.sectionStart is 1-based section index

                    const top = getTopPercent(course.sectionStart);
                    const height = getHeightPercent(course.sectionStart, course.sectionCount);

                    // Width is 100% / 7
                    const width = 100 / 7;
                    const left = dayIndex * width;

                    const colorIdx = getColorIndex(course.courseName);
                    const timeRange = getCourseTimeRange(course.sectionStart, course.sectionCount);

                    const popoverContent = (
                      <div style={{ minWidth: 180, maxWidth: 240 }}>
                        <div style={{ marginBottom: 8, fontWeight: 'bold', fontSize: 15, color: '#1f1f1f', lineHeight: 1.4 }}>
                          {course.courseName}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, color: '#666', fontSize: 13 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <EnvironmentOutlined style={{ color: '#1890ff' }} /> {course.classroom}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <UserOutlined style={{ color: '#52c41a' }} /> {course.teacherName}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <CalendarOutlined style={{ color: '#fa8c16' }} /> {week ? `第 ${week} 周` : ''} {DAYS[dayIndex]}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <ClockCircleOutlined style={{ color: '#722ed1' }} /> {timeRange}
                          </div>
                        </div>
                      </div>
                    );

                    return (
                      <Popover
                        key={`${course.courseCode}-${idx}`}
                        content={popoverContent}
                        trigger="click"
                        placement="top"
                        overlayStyle={{ zIndex: 100 }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            left: `${left}%`,
                            top: `calc(${top}% + 1px)`,
                            width: `${width}%`,
                            height: `calc(${height}% - 2px)`,
                            padding: 4,
                            pointerEvents: 'auto'
                          }}
                        >
                          <div
                            className={styles.courseContent}
                            style={{
                              background: COURSE_COLORS[colorIdx],
                              borderLeft: `4px solid ${COURSE_TEXT_COLORS[colorIdx]}`,
                              color: COURSE_TEXT_COLORS[colorIdx],
                            }}
                          >
                            <div className={styles.courseName}>{course.courseName}</div>
                            <div className={styles.courseInfo}>{course.classroom}</div>
                            <div className={styles.courseInfo}>{course.teacherName}</div>
                          </div>
                        </div>
                      </Popover>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      {modalElement}
    </div>
  );
};

export default Schedule;
