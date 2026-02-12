'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function GrandCentral() {
  const router = useRouter()
  useEffect(() => {
    const handleHover = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a')
      // Only prefetch internal links to save bandwidth
      if (link?.href?.startsWith(window.location.origin)) {
        router.prefetch(link.href)
      }
    }
    document.addEventListener('mouseover', handleHover)
    return () => document.removeEventListener('mouseover', handleHover)
  }, [router])
  return null
}
