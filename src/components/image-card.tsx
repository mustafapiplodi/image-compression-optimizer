import { Download, Loader2, CheckCircle2, XCircle, Eye, Trash2, RotateCcw } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { Checkbox } from './ui/checkbox'
import { Tooltip } from './ui/tooltip'
import { ImageFile } from '@/types'
import { formatBytes, calculateReduction } from '@/lib/utils'
import { motion } from 'framer-motion'

interface ImageCardProps {
  image: ImageFile
  onDownload: (id: string) => void
  onPreview: (id: string) => void
  onDelete?: (id: string) => void
  onRetry?: (id: string) => void
  onToggleSelect?: (id: string) => void
  showCheckbox?: boolean
}

export function ImageCard({
  image,
  onDownload,
  onPreview,
  onDelete,
  onRetry,
  onToggleSelect,
  showCheckbox,
}: ImageCardProps) {
  const getStatusIcon = () => {
    switch (image.status) {
      case 'compressing':
        return <Loader2 className="h-4 w-4 animate-spin" />
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const reduction = image.compressedSize
    ? calculateReduction(image.originalSize, image.compressedSize)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-video relative bg-muted group">
          {image.compressedPreview || image.originalPreview ? (
            <img
              src={image.compressedPreview || image.originalPreview}
              alt={image.file.name}
              className="object-cover w-full h-full transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {showCheckbox && (
            <div className="absolute top-2 left-2">
              <Checkbox
                checked={image.selected}
                onCheckedChange={() => onToggleSelect?.(image.id)}
              />
            </div>
          )}

          {image.status === 'completed' && reduction > 0 && (
            <Badge className="absolute top-2 right-2 bg-green-600 hover:bg-green-700">
              {reduction}% smaller
            </Badge>
          )}

          {onDelete && (
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Tooltip content="Delete image">
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-8 w-8 p-0"
                  onClick={() => onDelete(image.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </Tooltip>
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <Tooltip content={image.file.name}>
                <p className="text-sm font-medium truncate flex-1">
                  {image.file.name}
                </p>
              </Tooltip>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatBytes(image.originalSize)}</span>
              {image.compressedSize && (
                <>
                  <span>→</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    {formatBytes(image.compressedSize)}
                  </span>
                </>
              )}
            </div>

            {image.compressionTime && (
              <div className="text-xs text-muted-foreground">
                Compressed in {image.compressionTime.toFixed(1)}s
              </div>
            )}
          </div>

          {image.status === 'compressing' && (
            <div className="space-y-1">
              <Progress value={image.progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                {image.progress}%
              </p>
            </div>
          )}

          {image.status === 'error' && (
            <div className="space-y-2">
              <p className="text-xs text-red-500">{image.error || 'Compression failed'}</p>
              {onRetry && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => onRetry(image.id)}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              )}
            </div>
          )}

          {image.status === 'completed' && (
            <div className="flex gap-2">
              <Tooltip content="Compare before/after">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => onPreview(image.id)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Compare
                </Button>
              </Tooltip>
              <Tooltip content="Download compressed image">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => onDownload(image.id)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </Tooltip>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
