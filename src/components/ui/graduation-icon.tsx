'use client'

import { Circle } from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import { getSubjectColor } from '@/domain/constants/color.constants'

type GraduationIconProps = LucideProps & {
  abbreviation: string
  /** Farbschlüssel aus der gemeinsamen Palette (nicht `color` wegen Lucide/SVG-Attribut). */
  paletteColor?: string | null
}

export function GraduationIcon({
  abbreviation,
  paletteColor,
  className,
  size = 16,
  ...props
}: GraduationIconProps) {
  const iconSize = typeof size === 'number' ? size : 16
  const fontSize = Math.max(11, iconSize * 0.45)
  const fill = paletteColor ? getSubjectColor(paletteColor, false) : undefined
  const stroke = paletteColor ? getSubjectColor(paletteColor, true) : undefined

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: iconSize, height: iconSize }}
    >
      <Circle
        className={className}
        size={iconSize}
        fill={fill ?? 'none'}
        stroke={stroke ?? 'currentColor'}
        {...props}
      />
      <span
        className="absolute font-semibold leading-none select-none"
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: '1',
          color: stroke ?? undefined,
        }}
      >
        {abbreviation}
      </span>
    </div>
  )
}
