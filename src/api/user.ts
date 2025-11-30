import http from '../utils/http'

export interface User {
  id: number
  username: string
  email: string
  avatar?: string
  createdAt: string
}

export interface UpdateUserProfile {
  username?: string
  email?: string
  avatar?: string
}

// 获取用户信息
export const getUserProfile = async (): Promise<User> => {
  const res = await http.get<User>('/user/profile')
  return res as unknown as User
}

// 更新用户信息
export const updateUserProfile = async (
  data: UpdateUserProfile
): Promise<User> => {
  const res = await http.put<User>('/user/profile', data)
  return res as unknown as User
}
