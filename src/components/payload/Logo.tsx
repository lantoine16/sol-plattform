'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import React from 'react'

export default function Logo() {
  const router = useRouter()
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (!isHomePage) {
      // Navigiere zu / ohne Search-Params
      router.push('/')
    }
  }

  return (
    <Link
      href="/"
      onClick={handleClick}
      style={{
        cursor: isHomePage ? 'default' : 'pointer',
        textDecoration: 'none',
        display: 'block',
        pointerEvents: isHomePage ? 'none' : 'auto',
      }}
    >
      <Image src="/logo.png" alt="IGS Logo" width={100} height={100} />
    </Link>
  )
}
