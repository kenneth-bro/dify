'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import useSWRInfinite from 'swr/infinite'
import { useTranslation } from 'react-i18next'
import { useDebounceFn } from 'ahooks'

import { RiRobot2Line, RiRobot3Line } from '@remixicon/react'
import cn from 'classnames'
import { Pagination } from 'react-headless-pagination'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import useAppsQueryState from './hooks/useAppsQueryState'
import { APP_PAGE_LIMIT, NEED_REFRESH_APP_LIST_KEY } from '@/config'
import { CheckModal } from '@/hooks/use-pay'
import TabSliderNew from '@/app/components/base/tab-slider-new'
import { useTabSearchParams } from '@/hooks/use-tab-searchparams'
import SearchInput from '@/app/components/base/search-input'
import { agentTypeDelete, getAgentTypeList, getDifyList } from '@/service/agent'
import Button from '@/app/components/base/button'
import s from '@/app/components/app/annotation/style.module.css'
import AddAgentType from '@/app/(commonLayout)/agent/center/AddAgentType'
import Toast from '@/app/components/base/toast'
import EditAgentType from '@/app/(commonLayout)/agent/center/EditAgentType'
import DragDropSort from '@/app/(commonLayout)/agent/center/DraggableList'
import Confirm from '@/app/components/base/confirm'
import DragDropSortType from '@/app/(commonLayout)/agent/center/DraggableTypeList'
import { getRedirection } from '@/utils/app-redirection'
import { useAppContext } from '@/context/app-context'

const getKey = (
  activeTab: string,
) => {
  const params: any = { url: '/dify/list', params: { agentTypeId: activeTab } }
  return params
}

const Apps = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useTabSearchParams({
    defaultTab: '',
  })
  const { query: { tagIDs = [], keywords = '' }, setQuery } = useAppsQueryState()
  const [searchKeywords, setSearchKeywords] = useState(keywords)
  const setKeywords = useCallback((keywords: string) => {
    setQuery(prev => ({ ...prev, keywords }))
  }, [setQuery])
  const [activeIndex, setActiveIndex] = useState(0)
  const { mutate } = useSWRInfinite(
    () => getKey(activeTab),
    null,
    { revalidateFirstPage: true },
  )
  const { isCurrentWorkspaceEditor } = useAppContext()
  const { push } = useRouter()
  const anchorRef = useRef<HTMLDivElement>(null)
  const [options, setOptions] = useState<any[]>([])
  const [types, setTypes] = useState<any[]>([])
  const [difysCurrPage, setDifysCurrPage] = React.useState<number>(0)
  const [currPage, setCurrPage] = React.useState<number>(0)
  const [total, setTotal] = useState(0)
  const [showAddAgentModal, setShowAddAgentModal] = useState<boolean>(false)
  const [showEditAgentModal, setShowEditAgentModal] = useState<boolean>(false)
  const [showDrag, setShowDrag] = useState<boolean>(false)
  const [showDragType, setShowDragType] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<string>('')
  const [difys, setDifys] = useState<any[]>([])
  const [difysTotal, setDifysTotal] = useState<number>(0)
  const [row, setRow] = useState<any>()
  const getDifys = () => {
    getDifyList({ name: searchKeywords, agentTypeId: activeTab, page: difysCurrPage + 1, pageSize: APP_PAGE_LIMIT }).then((res) => {
      setDifys(res.data)
      setDifysTotal(res.totalCount)
    })
  }
  const getTypes = () => {
    getAgentTypeList({ page: currPage + 1, pageSize: 999999 }).then((res: any) => {
      setOptions(res.data.map((item: any) => {
        return {
          value: item.id,
          text: item.name,
        }
      }))
      if (res.data.length > 0 && activeTab === 'all')
        setActiveTab(res.data[0].id)
    })
  }
  const getOptTypes = () => {
    getAgentTypeList({ page: currPage + 1, pageSize: APP_PAGE_LIMIT }).then((res: any) => {
      setTotal(res.totalCount)
      setTypes(res.data)
    })
  }

  useEffect(() => {
    document.title = '智能体中心 -  Dify'
    if (localStorage.getItem(NEED_REFRESH_APP_LIST_KEY) === '1') {
      localStorage.removeItem(NEED_REFRESH_APP_LIST_KEY)
      mutate()
    }
    getTypes()
  }, [mutate])

  const { run: handleSearch } = useDebounceFn(() => {
    setSearchKeywords(keywords)
  }, { wait: 500 })
  const handleKeywordsChange = (value: string) => {
    setKeywords(value)
    handleSearch()
  }
  useEffect(() => {
    getOptTypes()
  }, [currPage])

  useEffect(() => {
    getDifys()
  }, [difysCurrPage, searchKeywords, activeTab])
  return (
    <>
      <div className="flex pt-4 px-12 pb-2">
        <div onClick={() => {
          setActiveIndex(0)
        }} className={cn('rounded-lg px-3 py-[7px] mr-4 flex items-center  cursor-pointer hover:bg-gray-200', activeIndex === 0 && 'bg-white border-gray-200 shadow-xs text-primary-600 hover:bg-white')}> <RiRobot2Line className='mr-2 w-4 h-4' />智能体</div>
        <div onClick={() => {
          setActiveIndex(1)
        }} className={cn('rounded-lg px-3 py-[7px] flex items-center  cursor-pointer hover:bg-gray-200', activeIndex === 1 && 'bg-white border-gray-200 shadow-xs text-primary-600 hover:bg-white')}> <RiRobot3Line className='mr-2 w-4 h-4' /> 分类</div>
      </div>
      {
        activeIndex === 0
          ? (
            <div className=' content-start  grow'>
              <div
                className='sticky top-0 flex justify-between items-center pt-4 px-12 pb-2 leading-[56px] bg-gray-100 z-10 flex-wrap gap-y-2'>
                <TabSliderNew
                  value={activeTab}
                  onChange={setActiveTab}
                  options={options}
                />
                <div className='flex items-center gap-2'>
                  <SearchInput className='w-[200px]' value={keywords} onChange={handleKeywordsChange}/>
                </div>
              </div>
              <div className="ml-10">
                <Button variant="secondary-accent" onClick={() => {
                  setShowDrag(true)
                }}>排序</Button>
              </div>
              <nav className='grid content-start grid-cols-1 gap-4 px-12 pt-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grow shrink-0'>
                {
                  difys.map((app: any, index) => {
                    return (<div key={index}
                      onClick={(e) => {
                        e.preventDefault()
                        getRedirection(isCurrentWorkspaceEditor, { id: app.appId, mode: app.mode }, push)
                      }}
                      className="flex bg-white p-8 radius-2xl  shadow-sm mt-4 transition-all duration-200 ease-in-out cursor-pointer hover:shadow-lg">
                      <img className="mr-8 h-12 rounded-2xl w-12 "
                        src={app.imageUrl}
                        alt=""/>
                      <div>
                        <h3 className="font-bold">{app.name}</h3>
                        <div className="mt-3 text-sm">{app.description}</div>
                        <div className="text-xs text-right">
                          <div className="mt-5 flex justify-end">来自: {app.author}</div>
                          <div className="flex justify-end">
                            上架状态: <span className={app.agentStatus === 1 ? 'text-primary-700' : 'text-red-700'}>{app.agentStatus === 1 ? '已上架' : '未上架'}</span>
                          </div>
                        </div>

                      </div>
                    </div>)
                  })
                }
                <CheckModal/>
              </nav>
              {
                difysTotal > 0 && <div className="p-20 pb-0 pt-0">
                  <Pagination
                    className="flex items-center w-full h-10 text-sm select-none mt-8"
                    currentPage={difysCurrPage}
                    edgePageCount={2}
                    middlePagesSiblingCount={1}
                    setCurrentPage={setDifysCurrPage}
                    totalPages={Math.ceil(difysTotal / APP_PAGE_LIMIT)}
                    truncableClassName="w-8 px-0.5 text-center"
                    truncableText="..."
                  >
                    <Pagination.PrevButton
                      disabled={difysCurrPage === 0}
                      className={`flex items-center mr-2 text-gray-500  focus:outline-none ${difysCurrPage === 0 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:text-gray-600 dark:hover:text-gray-200'}`} >
                      <ArrowLeftIcon className="mr-3 h-3 w-3" />
                      {t('appLog.table.pagination.previous')}
                    </Pagination.PrevButton>
                    <div className={`flex items-center justify-center flex-grow ${s.pagination}`}>
                      <Pagination.PageButton
                        activeClassName="bg-primary-50 dark:bg-opacity-0 text-primary-600 dark:text-white"
                        className="flex items-center justify-center h-8 w-8 rounded-full cursor-pointer"
                        inactiveClassName="text-gray-500"
                      />
                    </div>
                    <Pagination.NextButton
                      disabled={difysCurrPage === Math.ceil(total / APP_PAGE_LIMIT) - 1}
                      className={`flex items-center mr-2 text-gray-500 focus:outline-none ${difysCurrPage === Math.ceil(total / APP_PAGE_LIMIT) - 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:text-gray-600 dark:hover:text-gray-200'}`} >
                      {t('appLog.table.pagination.next')}
                      <ArrowRightIcon className="ml-3 h-3 w-3" />
                    </Pagination.NextButton>
                  </Pagination>
                </div>
              }
            </div>
          )
          : (<div className=' overflow-auto content-start  grow p-10 pt-2'>
            <Button variant='primary' className="mb-4" onClick={() => {
              setShowAddAgentModal(true)
            }}>添加</Button>
            <Button variant='secondary' className="ml-4" onClick={() => {
              setShowDragType(true)
            }}>排序</Button>
            <table
              className='bg-white table-fixed w-full border-separate border-spacing-0 border border-gray-200 rounded-lg text-xs'>
              <thead className='text-gray-500'>
                <tr>
                  <td className='h-9 pl-3 pr-2 border-b border-gray-200'>类型名称</td>
                  <td className='h-9 pl-3 pr-2 border-b border-gray-200'>描述</td>
                  <td className='h-9 pl-3 pr-2 border-b border-gray-200'>排序</td>
                  <td className='h-9 pl-3 pr-2 border-b border-gray-200'>创建时间</td>
                  <td className='h-9 pl-3 pr-2 border-b border-gray-200'>更新时间</td>
                  <td className='h-9 pl-3 pr-2 border-b border-gray-200'>操作</td>
                </tr>
              </thead>
              <tbody className='text-gray-700'>
                {
                  types.map((item: any) => {
                    return (
                      <tr key={item.id}>
                        <td
                          className='h-9 pl-3 pr-2 border-b border-gray-100 text-[13px]'>{item.name}
                        </td>
                        <td
                          className='h-9 pl-3 pr-2 border-b border-gray-100 text-[13px]'>{item.description}
                        </td>
                        <td
                          className='h-9 pl-3 pr-2 border-b border-gray-100 text-[13px]'>{item.sort}
                        </td>
                        <td
                          className='h-9 pl-3 pr-2 border-b border-gray-100 text-[13px]'>{item.createdAt}
                        </td>
                        <td
                          className='h-9 pl-3 pr-2 border-b border-gray-100 text-[13px]'>{item.updatedAt}
                        </td>
                        <td
                          className='h-9 pl-3 pr-2 border-b border-gray-100 text-[13px]'>
                          <Button size='small'
                            className="mr-3"
                            variant='warning' onClick={() => {
                              setDeleteId(item.id)
                              setShowDeleteModal(true)
                            }}>删除</Button>
                          <Button
                            size='small' variant='primary'
                            onClick={() => {
                              setRow(item)
                              setShowEditAgentModal(true)
                            }}>编辑</Button>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
            <Pagination
              className="flex items-center w-full h-10 text-sm select-none mt-8"
              currentPage={currPage}
              edgePageCount={2}
              middlePagesSiblingCount={1}
              setCurrentPage={setCurrPage}
              totalPages={Math.ceil(total / APP_PAGE_LIMIT)}
              truncableClassName="w-8 px-0.5 text-center"
              truncableText="..."
            >
              <Pagination.PrevButton
                disabled={currPage === 0}
                className={`flex items-center mr-2 text-gray-500  focus:outline-none ${currPage === 0 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:text-gray-600 dark:hover:text-gray-200'}`} >
                <ArrowLeftIcon className="mr-3 h-3 w-3" />
                {t('appLog.table.pagination.previous')}
              </Pagination.PrevButton>
              <div className={`flex items-center justify-center flex-grow ${s.pagination}`}>
                <Pagination.PageButton
                  activeClassName="bg-primary-50 dark:bg-opacity-0 text-primary-600 dark:text-white"
                  className="flex items-center justify-center h-8 w-8 rounded-full cursor-pointer"
                  inactiveClassName="text-gray-500"
                />
              </div>
              <Pagination.NextButton
                disabled={currPage === Math.ceil(total / APP_PAGE_LIMIT) - 1}
                className={`flex items-center mr-2 text-gray-500 focus:outline-none ${currPage === Math.ceil(total / APP_PAGE_LIMIT) - 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:text-gray-600 dark:hover:text-gray-200'}`} >
                {t('appLog.table.pagination.next')}
                <ArrowRightIcon className="ml-3 h-3 w-3" />
              </Pagination.NextButton>
            </Pagination>
          </div>)
      }

      <div ref={anchorRef} className='h-0'></div>
      <Confirm
        isShow={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={() => {
          agentTypeDelete({
            id: deleteId,
          }).then((r) => {
            if (r.data) {
              Toast.notify({ type: 'success', message: '删除成功' })
              getOptTypes()
            }
          })
          setShowDeleteModal(false)
        }}
        title="确定要删除吗？"
      />
      {showAddAgentModal && (
        <AddAgentType show={showAddAgentModal} onHide={() => {
          setShowAddAgentModal(false)
          getOptTypes()
          getTypes()
        }}/>
      )}
      {showEditAgentModal && (
        <EditAgentType show={showEditAgentModal} row={row} onHide={() => {
          setShowEditAgentModal(false)
          getOptTypes()
          getTypes()
        }}/>
      )}
      {
        showDrag && (
          <DragDropSort show={showDrag} activeTab={activeTab} onHide={() => {
            setShowDrag(false)
            getDifys()
          }}/>
        )
      }
      {
        showDragType && (
          <DragDropSortType show={showDragType} onHide={() => {
            setShowDragType(false)
            getOptTypes()
          }}/>
        )
      }
    </>
  )
}

export default Apps
