import { useState, useRef } from 'react'
import { X } from 'lucide-react'
import { Button } from './ui/button'
import { ImageFile } from '@/types'
import { formatBytes, calculateReduction } from '@/lib/utils'

interface ImageComparisonModalProps {
  image: ImageFile | null
  onClose: () => void
}

export function ImageComparisonModal({ image, onClose }: ImageComparisonModalProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  if (!image) return null

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX)
    }
  }

  const reduction = image.compressedSize
    ? calculateReduction(image.originalSize, image.compressedSize)
    : 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-5xl bg-background rounded-lg shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-xl font-semibold">{image.file.name}</h2>
            <p className="text-sm text-muted-foreground">
              {formatBytes(image.originalSize)} → {formatBytes(image.compressedSize || 0)}
              {reduction > 0 && (
                <span className="text-green-600 dark:text-green-400 ml-2 font-medium">
                  ({reduction}% smaller)
                </span>
              )}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div
          ref={containerRef}
          className="relative aspect-video bg-muted select-none"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {/* Compressed image (background) */}
          <img
            src={image.compressedPreview}
            alt="Compressed"
            className="absolute inset-0 w-full h-full object-contain"
            draggable={false}
          />

          {/* Original image (foreground with clip) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img
              src={image.originalPreview}
              alt="Original"
              className="absolute inset-0 w-full h-full object-contain"
              draggable={false}
            />
          </div>

          {/* Slider */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10"
            style={{ left: `${sliderPosition}%` }}
            onMouseDown={handleMouseDown}
            onTouchStart={() => setIsDragging(true)}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
              <div className="w-4 h-4 flex items-center justify-center">
                <div className="w-0.5 h-4 bg-gray-400 mr-0.5" />
                <div className="w-0.5 h-4 bg-gray-400" />
              </div>
            </div>
          </div>

          {/* Labels */}
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm font-medium">
            Original
          </div>
          <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm font-medium">
            Compressed
          </div>
        </div>

        <div className="p-4 border-t bg-muted/30">
          <p className="text-sm text-center text-muted-foreground">
            Drag the slider to compare original and compressed images
          </p>
        </div>
      </div>
    </div>
  )
}
