import imageCompression from 'browser-image-compression'
import { CompressionOptions } from '@/types'

export async function compressImage(
  file: File,
  options: CompressionOptions,
  onProgress?: (progress: number) => void
): Promise<File> {
  const compressionOptions = {
    maxSizeMB: options.maxSizeMB,
    maxWidthOrHeight: options.maxWidthOrHeight,
    useWebWorker: options.useWebWorker ?? true,
    initialQuality: options.quality / 100,
    fileType: options.fileType,
    onProgress: (progress: number) => {
      onProgress?.(progress)
    },
  }

  try {
    const compressedFile = await imageCompression(file, compressionOptions)
    return compressedFile
  } catch (error) {
    console.error('Compression error:', error)
    throw error
  }
}

export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string)
      } else {
        reject(new Error('Failed to read file'))
      }
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export async function convertToFormat(file: File, format: string): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }

      ctx.drawImage(img, 0, 0)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const newFile = new File(
              [blob],
              file.name.replace(/\.[^.]+$/, `.${format}`),
              { type: `image/${format}` }
            )
            resolve(newFile)
          } else {
            reject(new Error('Failed to convert image'))
          }
        },
        `image/${format}`,
        0.92
      )
    }

    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}
