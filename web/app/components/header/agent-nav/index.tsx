'use client'

import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import {
  RiRobot2Fill, RiRobot2Line,
} from '@remixicon/react'
import classNames from '@/utils/classnames'
type AgentNavProps = {
  className?: string
}

const AgentNav = ({
  className,
}: AgentNavProps) => {
  const { t } = useTranslation()
  const selectedSegment = useSelectedLayoutSegment()
  const actived = selectedSegment === 'agent'

  return (
    <Link href="/agent/center" className={classNames(
      className, 'group',
      actived && 'bg-white shadow-md',
      actived ? 'text-primary-600' : 'text-gray-500 hover:bg-gray-200',
    )}>
      {
        actived
          ? <RiRobot2Fill className='mr-2 w-4 h-4' />
          : <RiRobot2Line className='mr-2 w-4 h-4' />
      }
      {t('common.menus.agent')}
    </Link>
  )
}

export default AgentNav
