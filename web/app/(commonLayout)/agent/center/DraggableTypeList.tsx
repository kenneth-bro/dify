import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import Button from '@/app/components/base/button'
import Modal from '@/app/components/base/modal'
import { agentTypeUpdateSortBatch, getAgentTypeList } from '@/service/agent'
import Toast from '@/app/components/base/toast'

type Item = {
  id: number
  name: string
  sort: number
  description: string
}

export type DuplicateAppModalProps = {
  show: boolean
  onHide: () => void
}

const DragDropSortType: React.FC<DuplicateAppModalProps> = ({ show = false, onHide }) => {
  const [items, setItems] = useState<Item[]>([])
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString())
    setDraggedIndex(index)
  }

  const getAgentTypes = () => {
    getAgentTypeList({ page: 1, pageSize: 999999 }).then((res) => {
      setItems(res.data)
    })
  }

  useEffect(() => {
    if (show)
      getAgentTypes()
  }, [show])

  const handleDragOver = (index: number) => {
    if (draggedIndex === null || draggedIndex === index)
      return

    const newItems = [...items]
    const draggedItem = newItems[draggedIndex]
    newItems.splice(draggedIndex, 1)
    newItems.splice(index, 0, draggedItem)
    setItems(newItems)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const submit = () => {
    const arr = items.map((item, index) => {
      return {
        id: item.id,
        sort: index + 1,
      }
    })
    agentTypeUpdateSortBatch(arr).then((r) => {
      if (r.data) {
        Toast.notify({ type: 'success', message: '操作成功' })
        onHide()
      }
      else {
        Toast.notify({ type: 'error', message: r.message })
      }
    })
  }

  return (
    <Modal
      isShow={show}
      onClose={onHide}
      className={cn('modal', '!max-w-[780px]', 'px-8')}
    >
      <div className="flex justify-end">
        <Button variant="ghost" onClick={onHide}>关闭</Button>
      </div>
      <div>
        {items.map((item, index) => (
          <div
            key={item.id}
            draggable
            className="rounded-14 shadow-2xl mb-2 p-2 flex pl-5 pr-5 mt-2 justify-between items-center"
            onDragStart={e => handleDragStart(e, index)}
            onDragOver={() => handleDragOver(index)}
            onDragEnd={handleDragEnd}
          >
            <div className="flex justify-between items-center">
              <div>
                <div>{item.name}</div>
                <div className="text-sm mt-2 caret-amber-950 truncate w-64">{item.description}</div>
              </div>
            </div>
            <div className="accent-blue-300 text-sm" style={{ color: 'blue' }}>
              拖拽排序
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="primary" onClick={() => {
          submit()
        }}>确认</Button>
      </div>
    </Modal>
  )
}

export default DragDropSortType
