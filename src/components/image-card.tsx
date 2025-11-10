import { Download, Loader2, CheckCircle2, XCircle, Eye } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { ImageFile } from '@/types'
import { formatBytes, calculateReduction } from '@/lib/utils'

interface ImageCardProps {
  image: ImageFile
  onDownload: (id: string) => void
  onPreview: (id: string) => void
}

export function ImageCard({ image, onDownload, onPreview }: ImageCardProps) {
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
    <Card className="overflow-hidden">
      <div className="aspect-video relative bg-muted">
        {image.compressedPreview || image.originalPreview ? (
          <img
            src={image.compressedPreview || image.originalPreview}
            alt={image.file.name}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {image.status === 'completed' && reduction > 0 && (
          <Badge className="absolute top-2 right-2 bg-green-600 hover:bg-green-700">
            {reduction}% smaller
          </Badge>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <p className="text-sm font-medium truncate flex-1" title={image.file.name}>
              {image.file.name}
            </p>
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
        </div>

        {image.status === 'compressing' && (
          <Progress value={image.progress} className="h-2" />
        )}

        {image.status === 'error' && (
          <p className="text-xs text-red-500">{image.error || 'Compression failed'}</p>
        )}

        {image.status === 'completed' && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => onPreview(image.id)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Compare
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={() => onDownload(image.id)}
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
