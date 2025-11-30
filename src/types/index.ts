// 全局类型定义
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export interface PaginationParams {
  page?: number
  pageSize?: number
}

export interface PaginationResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// 表单相关类型
export interface FormValidationRule {
  required?: boolean
  message?: string
  pattern?: RegExp
  validator?: (rule: unknown, value: unknown) => Promise<void>
}