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

// 查询课表导入状态
export const getScheduleImportStatus = async (): Promise<RestBean<boolean>> => {
  const res = await http.get<RestBean<boolean>>('/schedule/import/status')
  return res as unknown as RestBean<boolean>
}

// 按周次查询整周课表
export const getScheduleByWeek = async (week?: number): Promise<RestBean<CourseVO[]>> => {
  const res = await http.get<RestBean<CourseVO[]>>('/schedule/week', {
    params: { week }
  })
  return res as unknown as RestBean<CourseVO[]>
}

// 上传课表图片
export interface UploadScheduleParams {
  termName: string
  startDate: string
  file: File
}

export const uploadScheduleImage = async (params: UploadScheduleParams): Promise<RestBean<unknown>> => {
  const formData = new FormData()
  formData.append('termName', params.termName)
  formData.append('startDate', params.startDate)
  formData.append('file', params.file)

  const res = await http.post<RestBean<unknown>>('/schedule/upload-image', formData)
  return res as unknown as RestBean<unknown>
}

// AI 问答
export interface AskParams {
  question: string
  date: string
}

export const askScheduleAI = async (params: AskParams): Promise<RestBean<string>> => {
  const res = await http.post<RestBean<string>>('/schedule/ask', params)
  return res as unknown as RestBean<string>
}
