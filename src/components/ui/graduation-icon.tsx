'use client'

import { Circle } from 'lucide-react'
import type { LucideProps } from 'lucide-react'

type GraduationIconProps = LucideProps & {
  number: number
}

export function GraduationIcon({ number, className, size = 16, ...props }: GraduationIconProps) {
  const iconSize = typeof size === 'number' ? size : 16
  const fontSize = iconSize * 0.5

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: iconSize, height: iconSize }}
    >
      <Circle className={className} size={iconSize} {...props} />
      <span
        className="absolute text-[10px] font-semibold leading-none select-none"
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: '1',
        }}
      >
        {number}
      </span>
    </div>
  )
}
