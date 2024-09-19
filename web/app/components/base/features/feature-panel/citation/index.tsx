'use client'
import React, {type FC} from 'react'
import {useTranslation} from 'react-i18next'
import {useStoreApi} from 'reactflow'
import produce from 'immer'
import {RiDeleteBinLine} from '@remixicon/react'
import Panel from '@/app/components/app/configuration/base/feature-panel'
import {Citations} from '@/app/components/base/icons/src/vender/solid/editor'
import OperationBtn from '@/app/components/app/configuration/base/operation-btn'
import {useModalContext} from '@/context/modal-context'
import type {FormData} from '@/app/components/app/configuration/features/chat-group/citation/modal'
import Toast from '@/app/components/base/toast'
import type {ResourcesItem} from '@/models/debug'
import {useFeaturesStore} from '@/app/components/base/features/hooks'
import {FeatureEnum} from '@/app/components/base/features/types'
import s from '@/app/components/app/configuration/features/chat-group/citation/style.module.css'
import Tooltip from '@/app/components/base/tooltip'
import {Settings01} from '@/app/components/base/icons/src/vender/line/general'

const Citation: FC = () => {
  const { t } = useTranslation()
  const { setShowCitationModal } = useModalContext()
  const store = useStoreApi()
  const {
    getNodes,
  } = store.getState()
  const featuresStore = useFeaturesStore()


  const nodes = getNodes().filter(item => !['start', 'answer'].includes(item.data.type))
  const tools = nodes.map(item => ({
    name: item.data.title,
    value: item.id,
  }))

  const { features, setFeatures } = featuresStore!.getState()
  const resources = features[FeatureEnum.citation]?.resources || []

  const handleOk = (formData: FormData) => {
    const {
      id,
      dataType: data_type,
      matchColumn: match_column,
      showColumn: show_column,
      toLink: to_link,
      srcColumn: src_column,
      name,
      isEdit,
    } = formData

    if (resources.find(item => item?.id === id) && !isEdit) {
      return Toast.notify({
        type: 'error',
        message: '请勿重复添加',
      })
    }
    const resourceItem: ResourcesItem = {
      type: 'node',
      id,
      data_type,
      match_column,
      show_column,
      to_link,
      src_column,
      name,
    }
    const newFeatures = produce(features, (draft) => {
      if (isEdit) {
        draft.citation = {
          ...draft.citation,
          resources: draft.citation?.resources?.map(item => item.id === id ? resourceItem : item),
        }
      }
      else {
        draft.citation = {
          ...draft.citation,
          resources: [
            ...(draft.citation?.resources || []),
            resourceItem,
          ],
        }
      }
    })
    setFeatures(newFeatures)
  }

  const handleToggle = () => {
    const newNodes = getNodes().filter(item => !['start', 'answer'].includes(item.data.type))
    const newTools = newNodes.map(item => ({
      name: item.data.title,
      value: item.id,
    }))
    setShowCitationModal({
      payload: {
        tools: newTools,
      },
      onSaveCallback: handleOk,
    })
  }

  const handleDelete = (id: string) => {
    const newFeatures = produce(features, (draft) => {
      if (draft.citation) {
        draft.citation = {
          ...draft.citation,
          resources: draft.citation?.resources?.filter(item => item.id !== id),
        }
      }
    })
    setFeatures(newFeatures)
  }

  return (
    <Panel
      title={
        <div className='flex items-center gap-2'>
          <div>{t('appDebug.feature.citation.title')}</div>
        </div>
      }
      headerIcon={<Citations className='w-4 h-4 text-[#FD853A]' />}
      headerRight={
        <div className='flex items-center'>
          <div className='text-xs text-gray-500'>{t('appDebug.feature.citation.resDes')}</div>
          <div className='ml-3 mr-1 h-3.5 w-px bg-gray-200'></div>
          <OperationBtn type="add" onClick={handleToggle}/>
        </div>
      }
      noBodySpacing
    >
      {
        resources.length > 0
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
            {resources.map((row, index) => (
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
  )
}
export default Citation
