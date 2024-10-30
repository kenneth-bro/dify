'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useInterval, useThrottleFn } from 'ahooks'
import type { ModelAndParameter } from '@/app/components/app/configuration/debug/types'

let originRouterPush: any
const useAutoSave = (onPublish: (modelAndParameter?: ModelAndParameter) => Promise<undefined | true>) => {
  const pathname = usePathname()
  const router = useRouter()
  if (!originRouterPush)
    originRouterPush = router.push

  const { run } = useThrottleFn(onPublish, {
    wait: 100,
  })

  const clear = useInterval(onPublish, 8000)

  useEffect(() => {
    router.push = new Proxy(router.push, {
      apply: (target, thisArg, argArray: any) => {
        const [to] = argArray
        if (to !== pathname)
          clear()
        run()

        return target.apply(thisArg, argArray)
      },
    })
    return () => {
      router.push = originRouterPush
    }
  }, [])

  useEffect(() => {
    return () => {
      clear()
    }
  }, [])
}

export default useAutoSave
