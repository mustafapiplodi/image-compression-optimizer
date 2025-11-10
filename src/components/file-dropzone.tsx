import { useCallback, useState } from 'react'
import { Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void
  disabled?: boolean
  compact?: boolean
}

export function FileDropzone({ onFilesSelected, disabled, compact = false }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }, [])

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled) return

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    )

    if (files.length > 0) {
      onFilesSelected(files)
    }
  }, [onFilesSelected, disabled])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      onFilesSelected(files)
      e.target.value = '' // Reset input
    }
  }, [onFilesSelected])

  if (compact) {
    return (
      <div
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={() => !disabled && document.getElementById('file-input-compact')?.click()}
      >
        <div className="flex items-center justify-center gap-3">
          <Upload className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Drop more images or click to browse</span>
        </div>
        <input
          id="file-input-compact"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />
      </div>
    )
  }

  return (
    <div
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={cn(
        "relative border-2 border-dashed rounded-lg p-8 md:p-12 text-center transition-colors",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-muted-foreground/50",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <div className="flex flex-col items-center justify-center gap-3 md:gap-4">
        <div className="rounded-full bg-primary/10 p-3 md:p-4">
          <Upload className="h-8 w-8 md:h-10 md:w-10 text-primary" />
        </div>

        <div className="space-y-1.5 md:space-y-2">
          <h3 className="text-lg md:text-xl font-semibold">
            Drop your images here to compress
          </h3>
          <p className="text-sm text-muted-foreground">
            Supports JPEG, PNG, WebP, and BMP • Up to 50MB each
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            ✨ Unlimited files • 🔒 100% private • 🚀 No server uploads
          </p>
        </div>

        <Button
          variant="default"
          size="lg"
          disabled={disabled}
          onClick={() => document.getElementById('file-input')?.click()}
          className="mt-2"
        >
          Choose Files
        </Button>

        <input
          id="file-input"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />
      </div>
    </div>
  )
}
