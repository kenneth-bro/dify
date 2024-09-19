'use client'
import React, { type FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useContext } from 'use-context-selector'
import produce from 'immer'
import {
  RiDeleteBinLine,
} from '@remixicon/react'
import s from './style.module.css'
import Panel from '@/app/components/app/configuration/base/feature-panel'
import { Citations } from '@/app/components/base/icons/src/vender/solid/editor'
import OperationBtn from '@/app/components/app/configuration/base/operation-btn'
import type { AgentTool } from '@/types/app'
import ConfigContext from '@/context/debug-configuration'
import { useModalContext } from '@/context/modal-context'
import type { CitationConfig, ResourcesItem } from '@/models/debug'
import Tooltip from '@/app/components/base/tooltip'
import Toast from '@/app/components/base/toast'
import {
  Settings01,
} from '@/app/components/base/icons/src/vender/line/general'
import type { FormData } from '@/app/components/app/configuration/features/chat-group/citation/modal'

const Citation: FC = () => {
  const { t } = useTranslation()
  const { modelConfig, setCitationConfig, setModelConfig } = useContext(ConfigContext)
  const { setShowCitationModal } = useModalContext()

  const retrieveResource = modelConfig?.retriever_resource?.resources as ResourcesItem[] || []
  const agentTools = modelConfig?.agentConfig?.tools as AgentTool[]
  const tools: {
    name: string
    value: string
  }[] = []
  agentTools?.forEach((item: AgentTool) => {
    if (item.enabled) {
      tools.push({
        name: item.provider_name,
        value: item.provider_id,
      })
    }
  })

  const handleOk = (formData: FormData) => {
    const { id, dataType: data_type, matchColumn: match_column, showColumn: show_column, toLink: to_link, srcColumn: src_column, name, isEdit } = formData

    if (retrieveResource.find(item => item.id === id) && !isEdit) {
      return Toast.notify({
        type: 'error',
        message: '请勿重复添加',
      })
    }
    const resourceItem: ResourcesItem = {
      type: 'tool',
      id,
      data_type,
      match_column,
      show_column,
      to_link,
      src_column,
      name,
    }

    const newAgentConfig = produce(modelConfig.retriever_resource, (draft) => {
      if (draft) {
        if (isEdit) {
          draft.resources = draft.resources?.map((item) => {
            if (item.id === id)
              return resourceItem

            return item
          })
        }
        else {
          draft.resources = [
            ...(draft.resources || []),
            resourceItem,
          ]
        }
      }
    })

    const newModelConfig = produce(modelConfig, (draft) => {
      draft.retriever_resource = newAgentConfig
    })

    setCitationConfig(newAgentConfig as CitationConfig)
    setModelConfig(newModelConfig)
  }

  const handleDelete = (id: string) => {
    const newAgentConfig = produce(modelConfig.retriever_resource, (draft) => {
      if (draft)
        draft.resources = draft.resources?.filter(item => item.id !== id)
    })
    const newModelConfig = produce(modelConfig, (draft) => {
      draft.retriever_resource = newAgentConfig
    })
    setCitationConfig(newAgentConfig as CitationConfig)
    setModelConfig(newModelConfig)
  }

  return (
    <>
      <Panel
        title={
          <div className='flex items-center gap-2'>
            <div>{t('appDebug.feature.citation.title')}</div>
          </div>
        }
        headerIcon={<Citations className='w-4 h-4 text-[#FD853A]'/>}
        headerRight={
          <div className='flex items-center'>
            <div className='text-xs text-gray-500'>{t('appDebug.feature.citation.resDes')}</div>
            <div className='ml-3 mr-1 h-3.5 w-px bg-gray-200'></div>
            <OperationBtn type="add" onClick={() => setShowCitationModal({
              payload: {
                tools,
              },
              onSaveCallback: handleOk,
            })}/>
          </div>
        }
        noBodySpacing
      >
        {
          retrieveResource.length > 0
          && <table className={`${s.table} min-w-[440px] w-full max-w-full border-collapse border-0 rounded-lg text-sm`}>
            <thead className="border-b  border-gray-200 text-gray-500 text-xs font-medium">
              <tr className='uppercase'>
                <td>{t('appDebug.feature.citation.table.name')}</td>
                <td>{t('appDebug.feature.citation.table.dataType')}</td>
                <td>{t('appDebug.feature.citation.table.srcColumn')}</td>
                <td>{t('appDebug.feature.citation.table.matchColumn')}</td>
                <td>{t('appDebug.feature.citation.table.showColumn')}</td>
                <td>{t('appDebug.feature.citation.table.action')}</td>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {retrieveResource.map((row, index) => (
                <tr key={index} className="h-9 leading-9">
                  <td className="border-b border-gray-100 pl-3">
                    <div className='w-full min-w-[120px] flex items-center space-x-1'>
                      <Tooltip popupContent={
                        <div className='h-6 leading-6 text-[13px] text-gray-700'>{row.name}</div>
                      }>
                        <div className='h-6 leading-6 text-[13px] text-gray-700 whitespace-nowrap text-ellipsis overflow-hidden w-full]'>{row.name}</div>
                      </Tooltip>
                    </div>
                  </td>
                  <td className="py-1 border-b border-gray-100">
                    <div className='h-6 leading-6 text-[13px] text-gray-700'>{row.data_type}</div>
                  </td>
                  <td className="py-1 border-b border-gray-100">
                    <div className='h-6 leading-6 text-[13px] text-gray-700'>{row.src_column}</div>
                  </td>
                  <td className="py-1 border-b border-gray-100">
                    <div className='h-6 leading-6 text-[13px] text-gray-700'>{row.match_column}</div>
                  </td>
                  <td className="py-1 border-b border-gray-100">
                    <div className='h-6 leading-6 text-[13px] text-gray-700'>{row.show_column}</div>
                  </td>
                  <td className='w-20  border-b border-gray-100'>
                    <div className='flex h-full items-center space-x-1'>
                      <div className=' p-1 rounded-md hover:bg-black/5 w-6 h-6 cursor-pointer'
                        onClick={() => setShowCitationModal({ payload: { tools, ...row }, onSaveCallback: handleOk })}>
                        <Settings01 className='w-4 h-4 text-gray-500'/>
                      </div>
                      <div className=' p-1 rounded-md hover:bg-black/5 w-6 h-6 cursor-pointer'
                        onClick={() => handleDelete(row.id as string)}>
                        <RiDeleteBinLine className='w-4 h-4 text-gray-500'/>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </Panel>
    </>
  )
}
export default React.memo(Citation)
