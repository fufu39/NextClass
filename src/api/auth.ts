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
