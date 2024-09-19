import { get, post } from './base'

const baseURL = '/llm-base'

/**
 * agent类型列表
 * @param param
 */
export const getAgentTypeList = (param: any) => {
  return get<any>(`${baseURL}/dify/agent-type/list`, {
    param,
  }, {
    customAPI: true,
  })
}

/**
 * 发布、下架
 * @param data
 */
export const agentAdd: (data: any) => Promise<any> = (data: any) => {
  return post<any>(`${baseURL}/dify/agent/up-down-shelves`, {
    body: data,
  }, { customAPI: true })
}

/**
 * 智能体列表
 * @param params
 */
export const getDifyList = (params: any) => {
  return get<any>(`${baseURL}/dify/list`, {
    params,
  }, { customAPI: true })
}

/**
 * 添加类型
 * @param data
 */
export const agentTypeAdd: (data: any) => Promise<any> = (data: any) => {
  return post<any>(`${baseURL}/dify/agent-type/add`, {
    body: data,
  }, {
    customAPI: true,
  })
}

/**
 * 更新类型
 * @param data
 */
export const agentTypeUpdate: (data: any) => Promise<any> = (data: any) => {
  return post<any>(`${baseURL}/dify/agent-type/update`, {
    body: data,
  }, {
    customAPI: true,
  })
}

/**
 * 删除类型
 * @param params
 */
export const agentTypeDelete = (params: any) => {
  return get<any>(`${baseURL}/dify/agent-type/delete`, {
    params,
  }, {
    customAPI: true,
  })
}
/**
 * agent排序(批量)
 * @param data
 */
export const agentUpdateSortBatch: (data: any) => Promise<any> = (data: any) => {
  return post<any>(`${baseURL}/dify/agent/update-sort-batch`, {
    body: data,
  }, {
    customAPI: true,
  })
}

/**
 * agent类型排序(批量)
 * @param data
 */
export const agentTypeUpdateSortBatch: (data: any) => Promise<any> = (data: any) => {
  return post<any>(`${baseURL}/dify/agent-type/update-sort-batch`, {
    body: data,
  }, {
    customAPI: true,
  })
}
