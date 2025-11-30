import http from '../utils/http'
import type { RestBean } from './schedule'

export interface AskParams {
  question: string
  date: string
}

export const askAI = async (params: AskParams): Promise<RestBean<string>> => {
  const res = await http.post<RestBean<string>>('/ai/ask', params)
  return res as unknown as RestBean<string>
}
