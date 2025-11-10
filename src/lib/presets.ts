import { CompressionPreset } from '@/types'

export const COMPRESSION_PRESETS: Record<string, CompressionPreset> = {
  web: {
    name: 'Web Optimized',
    quality: 75,
    maxDimension: 1920,
    format: 'webp',
    description: 'Perfect for websites and web apps. Balanced quality and size.',
  },
  print: {
    name: 'Print Quality',
    quality: 90,
    maxDimension: undefined,
    format: undefined,
    description: 'High quality for printing. Minimal compression.',
  },
  archive: {
    name: 'Archive',
    quality: 60,
    maxDimension: 2048,
    format: 'webp',
    description: 'Maximum compression for long-term storage.',
  },
  custom: {
    name: 'Custom',
    quality: 80,
    maxDimension: undefined,
    format: undefined,
    description: 'Configure your own settings.',
  },
}

export const FORMAT_RECOMMENDATIONS: Record<string, string> = {
  'image/jpeg': 'WebP recommended for 25-35% better compression',
  'image/jpg': 'WebP recommended for 25-35% better compression',
  'image/png': 'WebP or AVIF recommended for transparent images',
  'image/webp': 'Already using modern format!',
  'image/avif': 'Already using the most modern format!',
  'image/gif': 'Consider WebP for animations or PNG for static',
}

export function getRecommendedFormat(mimeType: string): string {
  if (mimeType.includes('png')) return 'webp' // Preserve transparency
  if (mimeType.includes('gif')) return 'webp' // Animations
  if (mimeType.includes('jpeg') || mimeType.includes('jpg')) return 'webp'
  return 'webp' // Default
}

export function applyNamingPattern(
  originalName: string,
  pattern: string,
  index: number = 0
): string {
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '')
  const extension = originalName.split('.').pop() || ''
  const timestamp = Date.now()
  const date = new Date().toISOString().split('T')[0]

  return pattern
    .replace('{name}', nameWithoutExt)
    .replace('{index}', String(index + 1).padStart(3, '0'))
    .replace('{timestamp}', String(timestamp))
    .replace('{date}', date)
    .replace('{ext}', extension)
    .replace('{random}', Math.random().toString(36).substring(2, 8))
}

export async function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
      URL.revokeObjectURL(img.src)
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

export function calculateCompressionRatio(original: number, compressed: number): string {
  const ratio = (original / compressed).toFixed(2)
  return `${ratio}:1`
}

export function estimateCompressionTime(fileSize: number, quality: number): number {
  // Rough estimate: 0.5-2 seconds per MB depending on quality
  const mbSize = fileSize / (1024 * 1024)
  const qualityFactor = (100 - quality) / 50 // Lower quality = faster
  return Math.max(0.5, mbSize * (1 + qualityFactor))
}

export function sortImages<T extends { originalSize: number; compressedSize?: number; file: { name: string }; status: string }>(
  images: T[],
  sortBy: string,
  order: 'asc' | 'desc'
): T[] {
  const sorted = [...images].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case 'name':
        comparison = a.file.name.localeCompare(b.file.name)
        break
      case 'size':
        comparison = a.originalSize - b.originalSize
        break
      case 'reduction':
        const aReduction = a.compressedSize
          ? ((a.originalSize - a.compressedSize) / a.originalSize) * 100
          : 0
        const bReduction = b.compressedSize
          ? ((b.originalSize - b.compressedSize) / b.originalSize) * 100
          : 0
        comparison = aReduction - bReduction
        break
      case 'status':
        const statusOrder = { pending: 0, compressing: 1, completed: 2, error: 3 }
        comparison =
          statusOrder[a.status as keyof typeof statusOrder] -
          statusOrder[b.status as keyof typeof statusOrder]
        break
      default:
        comparison = 0
    }

    return order === 'asc' ? comparison : -comparison
  })

  return sorted
}
