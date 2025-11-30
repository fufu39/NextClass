import http from '../utils/http'

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: number
    username: string
    email: string
  }
}

// 登录
export const login = async (data: LoginParams): Promise<LoginResponse> => {
  const res = await http.post<LoginResponse>('/auth/login', data)
  return res as unknown as LoginResponse
}

// 注册
export const register = async (
  data: LoginParams & { email: string }
): Promise<LoginResponse> => {
  const res = await http.post<LoginResponse>('/auth/register', data)
  return res as unknown as LoginResponse
}

// 登出
export const logout = () => {
  return http.post('/auth/logout')
}

// 刷新token
export const refreshToken = async (): Promise<{ token: string }> => {
  const res = await http.post<{ token: string }>('/auth/refresh')
  return res as unknown as { token: string }
}
