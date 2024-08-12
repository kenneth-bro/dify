import { usePathname as useNextPathname } from 'next/navigation'

/**
 * 重构next的usePathname,解决不会增加basePath的问题
 * @date 2024/8/12
 * @author Kenneth
 **/
export function usePathname(): string | null {
  let pathname = useNextPathname()
  const publicBasePath = process?.env?.NEXT_PUBLIC_BASE_PATH
  if (pathname && publicBasePath)
    pathname = publicBasePath + pathname
  return pathname
}
