import http from '../utils/http'

export interface SubscriptionPreferences {
  id: number
  userId: number
  subscribed: boolean
  timezone: string
  dailyTime: string
  channels: string
  advanceMinutes: number
  lastSentDate: string
}

export interface SubscribeParams {
  timezone: string
  channels: string
  dailyTime: string
}

interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

export const getSubscriptionPreferences = async (): Promise<SubscriptionPreferences> => {
  const res = await http.get<ApiResponse<SubscriptionPreferences>>('/subscription/preferences')
  // Assuming the interceptor returns response.data, which is { code, data, message }
  // We want to return the data part.
  const response = res as unknown as ApiResponse<SubscriptionPreferences>
  return response.data
}

export const subscribe = async (data: SubscribeParams): Promise<unknown> => {
  const res = await http.post('/subscription/subscribe', data)
  return res
}

export const unsubscribe = async (): Promise<unknown> => {
  const res = await http.post('/subscription/unsubscribe')
  return res
}
