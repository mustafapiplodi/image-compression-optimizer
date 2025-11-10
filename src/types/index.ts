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
  selected?: boolean
  retryCount?: number
  compressionTime?: number
  originalDimensions?: { width: number; height: number }
  compressedDimensions?: { width: number; height: number }
}

export interface CompressionOptions {
  quality: number
  maxSizeMB?: number
  maxWidthOrHeight?: number
  useWebWorker?: boolean
  fileType?: string
  preserveExif?: boolean
  maintainAspectRatio?: boolean
  lossless?: boolean
}

export type PresetMode = 'web' | 'print' | 'archive' | 'custom'

export interface CompressionPreset {
  name: string
  quality: number
  maxDimension?: number
  format?: string
  description: string
}

export type ViewMode = 'grid' | 'list' | 'compact'
export type SortBy = 'name' | 'size' | 'reduction' | 'status'
export type SortOrder = 'asc' | 'desc'
export type FilterStatus = 'all' | 'pending' | 'compressing' | 'completed' | 'error'

export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  accentColor: string
  viewMode: ViewMode
  autoDownload: boolean
  showTutorial: boolean
  preserveExif: boolean
  namingPattern: string
}
