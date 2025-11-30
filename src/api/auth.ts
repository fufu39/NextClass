import http from '../utils/http'

export interface LoginParams {
  username: string
  password: string
}

export interface AuthorizeVO {
  username: string
  role: string
  token: string
  expire: string
}

export interface RestBean<T> {
  code: number
  data: T
  message?: string
}

// 注册参数
export interface RegisterParams {
  email: string
  username: string
  password: string
  code: string
}

// 注册
export const register = async (data: RegisterParams): Promise<RestBean<null>> => {
  return await http.post<RestBean<null>>('/auth/register', data)
}

// 获取验证码
export const askCode = async (email: string, type: string): Promise<RestBean<null>> => {
  return await http.get<RestBean<null>>('/auth/ask-code', {
    params: {
      email,
      type
    }
  })
}

// 登录
export const login = async (data: LoginParams): Promise<RestBean<AuthorizeVO>> => {
  const params = new URLSearchParams()
  params.append('username', data.username)
  params.append('password', data.password)

  const res = await http.post<RestBean<AuthorizeVO>>('/auth/login', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  return res as unknown as RestBean<AuthorizeVO>
}
