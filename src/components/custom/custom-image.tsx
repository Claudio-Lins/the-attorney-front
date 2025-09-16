'use client'

import { cn } from '@/lib/utils'
import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

type CustomImageProps = ImageProps & {
  fallbackSrc?: string
  alt: string
  containerClassName?: string
}

export function CustomImage({
  src,
  alt,
  fallbackSrc = '/assets/lgs/vca-v-neg.svg',
  containerClassName,
  className,
  width,
  height,
  ...props
}: CustomImageProps) {
  const [imageSrc, setImageSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)
  const handleError = () => {
    setImageSrc(fallbackSrc)
    setIsLoading(false)
  }

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }


  return (
    <div 
      className={cn(
        'relative w-full h-full overflow-hidden', 
        isLoading && 'bg-transparent',
        containerClassName
      )}
    >
      <Image
        src={imageSrc || fallbackSrc}
        alt={alt || 'Imagem sem descrição'}
        onError={handleError}
        onLoad={handleLoadingComplete}
        className={cn(
          'object-cover transition-all duration-300 ease-in-out',
          isLoading && 'opacity-0',
          className
        )}
        width={width || 300}
        height={height || 200}
        quality={75}
        priority={false}
        loading="lazy"
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        {...props}
      />
    </div>
  )
} 