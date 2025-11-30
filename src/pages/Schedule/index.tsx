import React, { useState, useEffect } from 'react';
import { Button, Select, Spin, Card, Typography, App, Modal, Form, Input, DatePicker, Upload, Checkbox } from 'antd';
import { UploadOutlined, CalendarOutlined, LeftOutlined, RightOutlined, InboxOutlined } from '@ant-design/icons';
import type { CourseVO } from '../../api/schedule';
import { getScheduleImportStatus, getScheduleByWeek, uploadScheduleImage } from '../../api/schedule';
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

  // Import Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [form] = Form.useForm();
  const [useDefaultImg, setUseDefaultImg] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    checkImportStatus();
  }, []);

  useEffect(() => {
    if (isImported) {
      // If week is undefined, fetch without week param (or default to current week logic)
      // The requirement is: "默认week是不传递的直接得到当前这周的课表"
      // But our API function takes a number. We might need to adjust API or call logic.
      // If we pass 0 or handle undefined in fetchSchedule?
      // Let's see fetchSchedule implementation below.
      fetchSchedule(week);
    }
  }, [isImported, week]);

  const checkImportStatus = async () => {
    setImportChecking(true);
    try {
      const res = await getScheduleImportStatus();
      console.log(res)
      if (res.code === 200) {
        setIsImported(res.data);
      }
    } catch (error) {
      console.error('Failed to check import status', error);
      message.error('无法获取课表状态');
    } finally {
      setImportChecking(false);
      setLoading(false);
    }
  };

  const fetchSchedule = async (w?: number) => {
    setScheduleLoading(true);
    try {
      const res = await getScheduleByWeek(w);
      console.log(res)

      if (res.code === 200) {
        const data = res.data || [];
        setScheduleData(data);

        // If we didn't have a week set (first load), try to set it from the response
        if (w === undefined && data.length > 0) {
          const currentWeek = data[0].week;
          if (currentWeek) {
            setWeek(currentWeek);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch schedule', error);
      message.error('获取课表失败');
    } finally {
      setScheduleLoading(false);
    }
  };

  const handleImport = () => {
    setIsModalOpen(true);
    setUseDefaultImg(false);
    setFileList([]);
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
          console.log(response)
          const blob = await response.blob();
          fileToUpload = new File([blob], 'class.png', { type: 'image/png' });
        } catch (e) {
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
      console.log(res)

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

  const modalElement = (
    <Modal
      title="导入课表"
      open={isModalOpen}
      onCancel={handleModalCancel}
      onOk={handleUploadSubmit}
      confirmLoading={importing}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item
          name="termName"
          label="学期名称"
          rules={[{ required: true, message: '请输入学期名称' }]}
        >
          <Input placeholder="例如：2025-2026学年1学期" />
        </Form.Item>
        <Form.Item
          name="startDate"
          label="学期开始日期"
          rules={[{ required: true, message: '请选择开始日期' }]}
        >
          <DatePicker style={{ width: '100%' }} placeholder="选择日期" />
        </Form.Item>

        <Form.Item label="课表图片" required>
          <div style={{ marginBottom: 12 }}>
            <Checkbox
              checked={useDefaultImg}
              onChange={(e) => {
                setUseDefaultImg(e.target.checked);
                if (e.target.checked) setFileList([]);
              }}
            >
              使用内置默认图片 (assets/class.png)
            </Checkbox>
          </div>

          {!useDefaultImg && (
            <Dragger
              fileList={fileList}
              beforeUpload={() => false}
              onChange={({ fileList }) => setFileList(fileList.slice(-1))}
              maxCount={1}
              accept="image/*"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽上传文件</p>
              <p className="ant-upload-hint">支持 PNG, JPG 等图片格式</p>
            </Dragger>
          )}
          {useDefaultImg && (
            <div style={{ padding: '12px', background: '#f5f5f5', borderRadius: '8px', textAlign: 'center', color: '#666' }}>
              已选择内置演示课表图片
            </div>
          )}
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

        <Button icon={<UploadOutlined />} onClick={handleImport}>
          重新导入
        </Button>
      </div>

      {/* Schedule Grid */}
      <div className={styles.scheduleCard}>
        {scheduleLoading ? (
          <div className={styles.loadingContainer}>
            <Spin size="large" />
          </div>
        ) : (
          <>
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
                <div style={{ position: 'absolute', top: 0, left: 100, right: 0, bottom: 0, pointerEvents: 'none' }}>
                  {scheduleData.map((course, idx) => {
                    const dayIndex = course.dayOfWeek - 1;
                    // course.sectionStart is 1-based section index

                    const top = getTopPercent(course.sectionStart);
                    const height = getHeightPercent(course.sectionStart, course.sectionCount);

                    // Width is 100% / 7
                    const width = 100 / 7;
                    const left = dayIndex * width;

                    const colorIdx = getColorIndex(course.courseName);

                    return (
                      <div
                        key={`${course.courseCode}-${idx}`}
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
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {modalElement}
    </div>
  );
};

export default Schedule;
