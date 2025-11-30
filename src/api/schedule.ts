import http from '../utils/http'

export interface CourseVO {
  courseName: string
  courseCode: string
  teacherName: string
  dayOfWeek: number
  week: number
  sectionStart: number
  sectionCount: number
  classroom: string
  remark: string | null
}

export interface RestBean<T> {
  code: number
  data: T
  message?: string
}

// 根据日期查询课表
export const getScheduleByDate = async (date: string): Promise<RestBean<CourseVO[]>> => {
  const res = await http.get<RestBean<CourseVO[]>>('/schedule/date', {
    params: { date }
  })
  return res as unknown as RestBean<CourseVO[]>
}
