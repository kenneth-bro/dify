import type { FC } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from '@/app/components/base/modal'
import Button from '@/app/components/base/button'
import type { Item } from '@/app/components/base/select'
import Select from '@/app/components/base/select'
import type { CitationForm } from '@/context/modal-context'
import type { AgentTool } from '@/types/app'

type Props = {
  onCancel?: () => void
  onSave?: (newPayload: FormData) => void
  data?: CitationForm
}

export type FormData = {
  id?: string
  type?: string
  dataType?: string
  srcColumn?: string
  matchColumn?: string
  showColumn?: string
  toLink?: string
  name?: string
  isEdit?: boolean
}

const CitationModal: FC<Props> = (props) => {
  const { t } = useTranslation()
  const { tools, id, type, data_type, src_column, show_column, to_link, match_column, name } = props.data as CitationForm

  const [formData, setFormData] = useState<FormData>({
    id,
    type,
    name,
    dataType: data_type || '',
    srcColumn: src_column || '',
    matchColumn: match_column || '',
    showColumn: show_column || '',
    toLink: to_link || '',
    isEdit: Boolean(id)
  })

  const toolData = tools?.filter((item: AgentTool) => item.enabled).map((item: AgentTool) => ({
    name: item.provider_name,
    value: item.provider_id,
  }))

  const handleSelect = (row: Item) => {
    setFormData({
      ...formData,
      id: row.value as string,
      name: row.name,
    })
  }

  return (
    <Modal
      isShow
      onClose={() => {
      }}
      className='!p-8 !pb-6 !max-w-none !w-[640px]'
    >
      <div className='mb-2 text-xl font-semibold text-gray-900'>
        {t('appDebug.feature.citation.modal.title')}
      </div>
      <div className="py-2">
        <div className='leading-9 text-sm font-medium text-gray-900'>
          {t('appDebug.feature.citation.modal.tool')}
        </div>
        <Select disabled={Boolean(id)} defaultValue={id} allowSearch={false} onSelect={handleSelect} placeholder={t('appDebug.feature.citation.modal.toolPlaceholder') as string} items={toolData} className='w-full'/>
      </div>
      <div className="py-2">
        <div className='leading-9 text-sm font-medium text-gray-900'>
          {t('appDebug.feature.citation.modal.dataType')}
        </div>
        <input
          value={formData.dataType}
          className='block px-3 w-full h-9 bg-gray-100 rounded-lg text-sm text-gray-900 outline-none appearance-none'
          placeholder={t('appDebug.feature.citation.modal.dataTypePlaceholder') || ''}
          onChange={e => setFormData({
            ...formData,
            dataType: e.target.value,
          })}
        />
      </div>
      <div className="py-2">
        <div className='leading-9 text-sm font-medium text-gray-900'>
          {t('appDebug.feature.citation.modal.srcColumn')}
        </div>
        <input
          value={formData.srcColumn}
          className='block px-3 w-full h-9 bg-gray-100 rounded-lg text-sm text-gray-900 outline-none appearance-none'
          placeholder={t('appDebug.feature.citation.modal.srcColumnPlaceholder') || ''}
          onChange={e => setFormData({
            ...formData,
            srcColumn: e.target.value,
          })}
        />
      </div>
      <div className="py-2">
        <div className='leading-9 text-sm font-medium text-gray-900'>
          {t('appDebug.feature.citation.modal.matchColumn')}
        </div>
        <input
          value={formData.matchColumn}
          className='block px-3 w-full h-9 bg-gray-100 rounded-lg text-sm text-gray-900 outline-none appearance-none'
          placeholder={t('appDebug.feature.citation.modal.matchColumnPlaceholder') || ''}
          onChange={e => setFormData({
            ...formData,
            matchColumn: e.target.value,
          })}
        />
      </div>
      <div className="py-2">
        <div className='leading-9 text-sm font-medium text-gray-900'>
          {t('appDebug.feature.citation.modal.showColumn')}
        </div>
        <input
          value={formData.showColumn}
          className='block px-3 w-full h-9 bg-gray-100 rounded-lg text-sm text-gray-900 outline-none appearance-none'
          placeholder={t('appDebug.feature.citation.modal.showColumnPlaceholder') || ''}
          onChange={e => setFormData({
            ...formData,
            showColumn: e.target.value,
          })}
        />
      </div>
      <div className="py-2">
        <div className='leading-9 text-sm font-medium text-gray-900'>
          {t('appDebug.feature.citation.modal.toLink')}
          （<span className="text-xs text-gray-500">{t('appDebug.feature.citation.modal.toLinkDescription')}</span>）
        </div>
        <textarea
          value={formData.toLink}
          className='w-full h-[80px] overflow-y-auto px-3 py-2 text-sm bg-gray-50 rounded-lg block outline-none appearance-none resize-none'
          placeholder={t('appDebug.feature.citation.modal.toLinkPlaceholder') || ''}
          onChange={e => setFormData({
            ...formData,
            toLink: e.target.value,
          })}
        />
      </div>
      <div className='flex items-center justify-end mt-6'>
        <Button
          onClick={props.onCancel}
          className='mr-2'
        >
          {t('common.operation.cancel')}
        </Button>
        <Button
          variant='primary'
          disabled={!formData.id || !formData.dataType || !formData.srcColumn || !formData.matchColumn || !formData.showColumn}
          onClick={() => props?.onSave?.(formData)}
        >
          {t('common.operation.save')}
        </Button>
      </div>
    </Modal>
  )
}

export default CitationModal
