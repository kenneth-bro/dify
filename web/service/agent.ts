import type { Fetcher } from 'swr'
import { get, post } from './base'

/**
 * agent类型列表
 * @param url
 * @param param
 */
export const getAgentTypeList: Fetcher<any, string> = (url: string) => {
  return get<any>(url, {}, {
    isPublicAPI: true,
  })
}

/**
 * 发布、下架
 * @param url
 * @param data
 */
export const agentAdd: (url: string, data: any) => Promise<any> = (url: string, data: any) => {
  return post<any>(url, {
    body: data,
  }, {
    isPublicAPI: true,
  })
}

/**
 * 智能体列表
 * @param url
 * @param params
 */
export const getDifyList = (url: string, params: any) => {
  return get<any>(url, {
    params,
  }, {
    isPublicAPI: true,
  })
}

/**
 * 添加类型
 * @param url
 * @param data
 */
export const agentTypeAdd: (url: string, data: any) => Promise<any> = (url: string, data: any) => {
  return post<any>(url, {
    body: data,
  }, {
    isPublicAPI: true,
  })
}

/**
 * 删除类型
 * @param url
 * @param params
 */
export const agentTypeDelete = (url: string, params: any) => {
  return get<any>(url, {
    params,
  }, {
    isPublicAPI: true,
  })
}

export const agentUpdateSortBatch: (url: string, data: any) => Promise<any> = (url: string, data: any) => {
  return post<any>(url, {
    body: data,
  }, {
    isPublicAPI: true,
  })
}
