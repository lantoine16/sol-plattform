'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Logo() {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    // Navigiere zu / ohne Search-Params
    router.push('/')
  }

  return (
    <Link
      href="/"
      onClick={handleClick}
      style={{
        cursor: 'pointer',
        textDecoration: 'none',
        display: 'block',
      }}
    >
      <Image src="/logo.png" alt="IGS Logo" width={100} height={100} />
    </Link>
  )
}
