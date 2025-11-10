export interface ImageFile {
  id: string
  file: File
  originalSize: number
  compressedSize?: number
  compressedFile?: File
  originalPreview: string
  compressedPreview?: string
  status: 'pending' | 'compressing' | 'completed' | 'error'
  progress: number
  error?: string
}

export interface CompressionOptions {
  quality: number
  maxSizeMB?: number
  maxWidthOrHeight?: number
  useWebWorker?: boolean
  fileType?: string
}
