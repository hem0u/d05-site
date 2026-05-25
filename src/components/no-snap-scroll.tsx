"use client"

import { useEffect } from "react"

export function NoSnapScroll() {
  useEffect(() => {
    const html = document.documentElement
    const prev = html.style.scrollSnapType
    html.style.scrollSnapType = "none"
    return () => { html.style.scrollSnapType = prev }
  }, [])
  return null
}
