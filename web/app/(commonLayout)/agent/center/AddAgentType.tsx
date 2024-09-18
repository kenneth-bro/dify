'use client'
import React, { useState } from 'react'
import s from './style.module.css'
import cn from '@/utils/classnames'
import Modal from '@/app/components/base/modal'
import Button from '@/app/components/base/button'
import Toast from '@/app/components/base/toast'
import { useProviderContext } from '@/context/provider-context'
import { agentTypeAdd } from '@/service/agent'

export type DuplicateAppModalProps = {
  show: boolean
  onHide: () => void
}

const AddAgentType = ({
  show = false,
  onHide,
}: DuplicateAppModalProps) => {
  const [name, setName] = React.useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [sort, setSort] = useState<any>()
  const { plan, enableBilling } = useProviderContext()
  const isAppsFull = (enableBilling && plan.usage.buildApps >= plan.total.buildApps)

  const submit = () => {
    if (!name.trim()) {
      Toast.notify({ type: 'error', message: '请输入类型名称' })
      return
    }
    agentTypeAdd('/dify/agent-type/add', {
      name,
      description,
      sort,
    }).then((r) => {
      if (r.data) {
        Toast.notify({ type: 'success', message: '添加成功' })
        onHide()
      }
      else {
        Toast.notify({ type: 'error', message: r.message })
      }
    })
  }
  return (
    <>
      <Modal
        isShow={show}
        onClose={() => {
        }}
        className={cn(s.modal, '!max-w-[480px]', 'px-8')}
      >
        <span className={s.close} onClick={onHide}/>
        <h3 className='mb-3' >添加智能体分类</h3>
        <div className={s.content}>
          <div className={s.subTitle}>分类名称</div>
          <div className='flex items-center justify-between space-x-2 mb-3'>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className='h-10 px-3 text-sm font-normal bg-gray-100 rounded-lg grow'
            />
          </div>
        </div>
        <div className={s.content}>
          <div className={s.subTitle}>分类描述</div>
          <div className='flex items-center justify-between space-x-2 mb-3'>
            <input
              value={description}
              onChange={e => setDescription(e.target.value)}
              className='h-10 px-3 text-sm font-normal bg-gray-100 rounded-lg grow'
            />
          </div>
        </div>
        <div className={s.content}>
          <div className={s.subTitle}>排序</div>
          <div className='flex items-center justify-between space-x-2 mb-3'>
            <input
              value={sort}
              type="number"
              onChange={e => setSort(e.target.value)}
              className='h-10 px-3 text-sm font-normal bg-gray-100 rounded-lg grow'
            />
          </div>
        </div>
        <div className='flex flex-row-reverse'>
          <Button disabled={isAppsFull} className='w-24 ml-2' variant='primary' onClick={submit}>提交</Button>
          <Button className='w-24' onClick={onHide}>取消</Button>
        </div>
      </Modal>
    </>

  )
}

export default AddAgentType
