import { useState } from 'react'
import { Camera, Link, Clipboard } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Tooltip } from './ui/tooltip'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { toast } from 'sonner'

interface ImportOptionsProps {
  onFilesImported: (files: File[]) => void
}

export function ImportOptions({ onFilesImported }: ImportOptionsProps) {
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleClipboardPaste = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read()

      const imageItems = clipboardItems.filter((item) =>
        item.types.some((type) => type.startsWith('image/'))
      )

      if (imageItems.length === 0) {
        toast.error('No images found in clipboard')
        return
      }

      const files: File[] = []

      for (const item of imageItems) {
        const imageType = item.types.find((type) => type.startsWith('image/'))
        if (imageType) {
          const blob = await item.getType(imageType)
          const file = new File([blob], `clipboard-${Date.now()}.png`, {
            type: imageType,
          })
          files.push(file)
        }
      }

      onFilesImported(files)
      toast.success(`Pasted ${files.length} image${files.length > 1 ? 's' : ''} from clipboard`)
    } catch (error) {
      toast.error('Failed to read clipboard. Please try again.')
      console.error('Clipboard error:', error)
    }
  }

  const handleUrlImport = async () => {
    if (!url.trim()) {
      toast.error('Please enter a valid URL')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch image')

      const blob = await response.blob()
      if (!blob.type.startsWith('image/')) {
        throw new Error('URL does not point to an image')
      }

      const filename = url.split('/').pop() || `image-${Date.now()}.jpg`
      const file = new File([blob], filename, { type: blob.type })

      onFilesImported([file])
      toast.success('Image imported successfully')
      setUrl('')
      setShowUrlInput(false)
    } catch (error) {
      toast.error('Failed to import image from URL')
      console.error('URL import error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      const video = document.createElement('video')
      video.srcObject = stream
      video.play()

      await new Promise((resolve) => {
        video.onloadedmetadata = resolve
      })

      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')

      if (!ctx) throw new Error('Failed to get canvas context')

      ctx.drawImage(video, 0, 0)

      stream.getTracks().forEach((track) => track.stop())

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], `camera-${Date.now()}.jpg`, {
              type: 'image/jpeg',
            })
            onFilesImported([file])
            toast.success('Photo captured successfully')
          }
        },
        'image/jpeg',
        0.95
      )
    } catch (error) {
      toast.error('Failed to access camera')
      console.error('Camera error:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Import Images</CardTitle>
        <CardDescription>Import from clipboard, URL, or camera</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Tooltip content="Paste image from clipboard">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClipboardPaste}
              className="flex-1"
            >
              <Clipboard className="h-4 w-4 mr-2" />
              Paste from Clipboard
            </Button>
          </Tooltip>

          <Tooltip content="Import from URL">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="flex-1"
            >
              <Link className="h-4 w-4 mr-2" />
              Import from URL
            </Button>
          </Tooltip>

          <Tooltip content="Capture with camera">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCameraCapture}
              className="flex-1"
            >
              <Camera className="h-4 w-4 mr-2" />
              Capture Photo
            </Button>
          </Tooltip>
        </div>

        {showUrlInput && (
          <div className="flex gap-2">
            <Input
              placeholder="https://example.com/image.jpg"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUrlImport()}
            />
            <Button onClick={handleUrlImport} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Import'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
