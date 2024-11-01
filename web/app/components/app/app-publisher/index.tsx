import React, {
  memo,
  useCallback,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { RiArrowDownSLine } from '@remixicon/react'
import type { ModelAndParameter } from '../configuration/debug/types'
import SuggestedAction from './suggested-action'
import PublishWithMultipleModel from './publish-with-multiple-model'
import Button from '@/app/components/base/button'
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
  PortalToFollowElemTrigger,
} from '@/app/components/base/portal-to-follow-elem'
import EmbeddedModal from '@/app/components/app/overview/embedded'
import { useStore as useAppStore } from '@/app/components/app/store'
import { useGetLanguage } from '@/context/i18n'
import { PlayCircle } from '@/app/components/base/icons/src/vender/line/mediaAndDevices'
import { CodeBrowser } from '@/app/components/base/icons/src/vender/line/development'
import { LeftIndent02 } from '@/app/components/base/icons/src/vender/line/editor'
import { FileText } from '@/app/components/base/icons/src/vender/line/files'
import WorkflowToolConfigureButton from '@/app/components/tools/workflow-tool/configure-button'
import type { InputVar } from '@/app/components/workflow/types'
import { appDefaultIconBackground } from '@/config'
import { SimpleSelect } from '@/app/components/base/select'

export type AppPublisherProps = {
  disabled?: boolean
  publishDisabled?: boolean
  publishedAt?: number
  /** only needed in workflow / chatflow mode */
  draftUpdatedAt?: number
  debugWithMultipleModel?: boolean
  multipleModelConfigs?: ModelAndParameter[]
  /** modelAndParameter is passed when debugWithMultipleModel is true */
  onPublish?: (modelAndParameter?: ModelAndParameter) => Promise<any> | any
  onRestore?: () => Promise<any> | any
  onToggle?: (state: boolean) => void
  crossAxisOffset?: number
  toolPublished?: boolean
  inputs?: InputVar[]
  selects: any[]
  onRefreshData?: () => void
  onSelect: (item: string) => void
  onAgentAddAndDelete: (status: number) => void
  detail: any
}

const AppPublisher = ({
  disabled = false,
  publishDisabled = false,
  publishedAt,
  selects,
  draftUpdatedAt,
  debugWithMultipleModel = false,
  multipleModelConfigs = [],
  onPublish,
  onRestore,
  onToggle,
  crossAxisOffset = 0,
  toolPublished,
  inputs,
  onRefreshData,
  onAgentAddAndDelete,
  onSelect,
  detail,
}: AppPublisherProps) => {
  const { t } = useTranslation()
  const [published, setPublished] = useState(false)
  const [open, setOpen] = useState(false)
  const appDetail = useAppStore(state => state.appDetail)
  const [publishedTime, setPublishedTime] = useState<number | undefined>(publishedAt)
  const { app_base_url: appBaseURL = '', access_token: accessToken = '' } = appDetail?.site ?? {}
  const appMode = (appDetail?.mode !== 'completion' && appDetail?.mode !== 'workflow') ? 'chat' : appDetail.mode
  const appURL = `${appBaseURL}/${appMode}/${accessToken}`
  const language = useGetLanguage()
  const formatTimeFromNow = useCallback((time: number) => {
    return dayjs(time).locale(language === 'zh_Hans' ? 'zh-cn' : language.replace('_', '-')).fromNow()
  }, [language])

  const handlePublish = async (modelAndParameter?: ModelAndParameter) => {
    try {
      await onPublish?.(modelAndParameter)
      setPublished(true)
      setPublishedTime(Date.now())
    }
    catch (e) {
      setPublished(false)
    }
  }

  const handleRestore = useCallback(async () => {
    try {
      await onRestore?.()
      setOpen(false)
    }
    catch (e) { }
  }, [onRestore])

  const handleTrigger = useCallback(() => {
    const state = !open

    if (disabled) {
      setOpen(false)
      return
    }

    onToggle?.(state)
    setOpen(state)

    if (state)
      setPublished(false)
  }, [disabled, onToggle, open])

  const [embeddingModalOpen, setEmbeddingModalOpen] = useState(false)

  return (
    <PortalToFollowElem
      open={open}
      onOpenChange={setOpen}
      placement='bottom-end'
      offset={{
        mainAxis: 4,
        crossAxis: crossAxisOffset,
      }}
    >
      <PortalToFollowElemTrigger onClick={handleTrigger}>
        <Button
          variant='primary'
          className='pl-3 pr-2'
          disabled={disabled}
        >
          {t('workflow.common.publish')}
          <RiArrowDownSLine className='w-4 h-4 ml-0.5' />
        </Button>
      </PortalToFollowElemTrigger>
      <PortalToFollowElemContent className='z-[11]'>
        <div className='w-[336px] bg-white rounded-2xl border-[0.5px] border-gray-200 shadow-xl'>
          <div className='p-4 pt-3'>
            <div className='flex items-center h-6 text-xs font-medium text-gray-500 uppercase'>
              {publishedTime ? t('workflow.common.latestPublished') : t('workflow.common.currentDraftUnpublished')}
            </div>
            {publishedTime
              ? (
                <div className='flex justify-between items-center h-[18px]'>
                  <div
                    className='flex items-center mt-[3px] mb-[3px] leading-[18px] text-[13px] font-medium text-gray-700'>
                    {t('workflow.common.publishedAt')} {formatTimeFromNow(publishedTime)}
                  </div>
                  <Button
                    className={`
                      ml-2 px-2 text-primary-600
                      ${published && 'text-primary-300 border-gray-100'}
                    `}
                    size='small'
                    onClick={handleRestore}
                    disabled={published}
                  >
                    {t('workflow.common.restore')}
                  </Button>
                </div>
              )
              : (
                <div className='flex items-center h-[18px] leading-[18px] text-[13px] font-medium text-gray-700'>
                  {t('workflow.common.autoSaved')} · {Boolean(draftUpdatedAt) && formatTimeFromNow(draftUpdatedAt!)}
                </div>
              )}
            {debugWithMultipleModel
              ? (
                <PublishWithMultipleModel
                  multipleModelConfigs={multipleModelConfigs}
                  onSelect={item => handlePublish(item)}
                  // textGenerationModelList={textGenerationModelList}
                />
              )
              : (
                <Button
                  variant='primary'
                  className='w-full mt-3'
                  onClick={() => handlePublish()}
                  disabled={publishDisabled || published}
                >
                  {
                    published
                      ? t('workflow.common.published')
                      : publishedTime ? t('workflow.common.update') : t('workflow.common.publish')
                  }
                </Button>
              )
            }
          </div>
          <div>
          </div>
          {
            (detail?.mode === 'workflow' || detail === undefined)
              ? ''
              : (
                <div>
                  <div className='p-4 pt-3 border-t-[0.5px] border-t-black/5'>
                    <div className='h2 mb-2'>
                      智能体中心
                    </div>
                    <div className="relative rounded-md">
                      <SimpleSelect
                        defaultValue={detail?.agentTypeId || 'all'}
                        className='!w-[300px]'
                        placeholder="请选择类别"
                        disabled={detail?.agentStatus === 1}
                        onSelect={
                          (item: any) => {
                            onSelect(item.value)
                          }
                        }
                        items={selects && selects.map((item) => {
                          return {
                            value: item.id,
                            name: item.name,
                          }
                        })}
                      />
                    </div>
                    <div className='flex'>
                      <Button
                        variant='primary'
                        className='w-full mt-3'
                        onClick={() => {
                          onAgentAddAndDelete(1)
                        }}
                        disabled={detail?.agentStatus === 1}
                      >
                        {
                          t('workflow.common.publish')
                        }
                      </Button>
                      <Button
                        variant='warning'
                        className='w-full mt-3 ml-7'
                        onClick={() => {
                          detail.agentStatus = 1
                          onAgentAddAndDelete(0)
                        }}
                        disabled={!detail || detail?.agentStatus === 0}
                      >
                        {
                          t('workflow.common.delist')
                        }
                      </Button>
                    </div>
                  </div>
                </div>
              )
          }
          <div className='p-4 pt-3 border-t-[0.5px] border-t-black/5'>
            <SuggestedAction disabled={!publishedTime} link={appURL}
              icon={<PlayCircle/>}>{t('workflow.common.runApp')}</SuggestedAction>
            {appDetail?.mode === 'workflow'
              ? (
                <SuggestedAction
                  disabled={!publishedTime}
                  link={`${appURL}${appURL.includes('?') ? '&' : '?'}mode=batch`}
                  icon={<LeftIndent02 className='w-4 h-4'/>}
                >
                  {t('workflow.common.batchRunApp')}
                </SuggestedAction>
              )
              : (
                <SuggestedAction
                  onClick={() => {
                    setEmbeddingModalOpen(true)
                    handleTrigger()
                  }}
                  disabled={!publishedTime}
                  icon={<CodeBrowser className='w-4 h-4'/>}
                >
                  {t('workflow.common.embedIntoSite')}
                </SuggestedAction>
              )}
            <SuggestedAction disabled={!publishedTime} link='./develop' icon={<FileText
              className='w-4 h-4'/>}>{t('workflow.common.accessAPIReference')}</SuggestedAction>
            {appDetail?.mode === 'workflow' && (
              <WorkflowToolConfigureButton
                disabled={!publishedTime}
                published={!!toolPublished}
                detailNeedUpdate={!!toolPublished && published}
                workflowAppId={appDetail?.id}
                icon={{
                  content: (appDetail.icon_type === 'image' ? '🤖' : appDetail?.icon) || '🤖',
                  background: (appDetail.icon_type === 'image' ? appDefaultIconBackground : appDetail?.icon_background) || appDefaultIconBackground,
                }}
                name={appDetail?.name}
                description={appDetail?.description}
                inputs={inputs}
                handlePublish={handlePublish}
                onRefreshData={onRefreshData}
              />
            )}
          </div>
        </div>
      </PortalToFollowElemContent>
      <EmbeddedModal
        siteInfo={appDetail?.site}
        isShow={embeddingModalOpen}
        onClose={() => setEmbeddingModalOpen(false)}
        appBaseUrl={appBaseURL}
        accessToken={accessToken}
      />
    </PortalToFollowElem>
  )
}

export default memo(AppPublisher)
