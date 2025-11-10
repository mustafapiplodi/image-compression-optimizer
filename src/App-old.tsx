import { useState, useCallback } from 'react'
import { Download, Settings2, Sparkles } from 'lucide-react'
import JSZip from 'jszip'
import { FileDropzone } from './components/file-dropzone'
import { ImageCard } from './components/image-card'
import { ImageComparisonModal } from './components/image-comparison-modal'
import { ThemeToggle } from './components/theme-toggle'
import { FeaturesSection } from './components/features-section'
import { FAQSection } from './components/faq-section'
import { Footer } from './components/footer'
import { Button } from './components/ui/button'
import { Slider } from './components/ui/slider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Checkbox } from './components/ui/checkbox'
import { Input } from './components/ui/input'
import { ImageFile, CompressionOptions } from './types'
import { compressImage, createImagePreview } from './lib/compression'
import { formatBytes, calculateReduction } from './lib/utils'

function App() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [quality, setQuality] = useState(80)
  const [maxDimension, setMaxDimension] = useState<number | undefined>(undefined)
  const [convertToWebP, setConvertToWebP] = useState(false)
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)

  const handleFilesSelected = useCallback(async (files: File[]) => {
    const newImages: ImageFile[] = []

    for (const file of files) {
      const preview = await createImagePreview(file)
      const imageFile: ImageFile = {
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        originalSize: file.size,
        originalPreview: preview,
        status: 'pending',
        progress: 0,
      }
      newImages.push(imageFile)
    }

    setImages((prev) => [...prev, ...newImages])

    // Auto-compress new images
    compressImages(newImages)
  }, [])

  const compressImages = useCallback(async (imagesToCompress: ImageFile[]) => {
    setIsCompressing(true)

    for (const image of imagesToCompress) {
      try {
        // Update status to compressing
        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id
              ? { ...img, status: 'compressing', progress: 0 }
              : img
          )
        )

        const options: CompressionOptions = {
          quality,
          maxWidthOrHeight: maxDimension,
          useWebWorker: true,
          fileType: convertToWebP ? 'image/webp' : undefined,
        }

        const compressedFile = await compressImage(
          image.file,
          options,
          (progress) => {
            setImages((prev) =>
              prev.map((img) =>
                img.id === image.id ? { ...img, progress } : img
              )
            )
          }
        )

        const compressedPreview = await createImagePreview(compressedFile)

        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id
              ? {
                  ...img,
                  compressedFile,
                  compressedSize: compressedFile.size,
                  compressedPreview,
                  status: 'completed',
                  progress: 100,
                }
              : img
          )
        )
      } catch (error) {
        console.error('Compression error:', error)
        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id
              ? {
                  ...img,
                  status: 'error',
                  error: error instanceof Error ? error.message : 'Unknown error',
                }
              : img
          )
        )
      }
    }

    setIsCompressing(false)
  }, [quality, maxDimension, convertToWebP])

  const handleRecompressAll = useCallback(() => {
    const imagesToRecompress = images.filter(
      (img) => img.status === 'completed' || img.status === 'error'
    )
    compressImages(imagesToRecompress)
  }, [images, compressImages])

  const handleDownload = useCallback((id: string) => {
    const image = images.find((img) => img.id === id)
    if (!image?.compressedFile) return

    const url = URL.createObjectURL(image.compressedFile)
    const a = document.createElement('a')
    a.href = url
    a.download = image.compressedFile.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [images])

  const handleDownloadAll = useCallback(async () => {
    const completedImages = images.filter((img) => img.compressedFile)

    if (completedImages.length === 0) return

    if (completedImages.length === 1) {
      handleDownload(completedImages[0].id)
      return
    }

    const zip = new JSZip()

    completedImages.forEach((image) => {
      if (image.compressedFile) {
        zip.file(image.compressedFile.name, image.compressedFile)
      }
    })

    const content = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(content)
    const a = document.createElement('a')
    a.href = url
    a.download = `compressed-images-${Date.now()}.zip`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [images, handleDownload])

  const handlePreview = useCallback((id: string) => {
    const image = images.find((img) => img.id === id)
    if (image) {
      setSelectedImage(image)
    }
  }, [images])

  const handleClearAll = useCallback(() => {
    setImages([])
  }, [])

  const totalOriginalSize = images.reduce((sum, img) => sum + img.originalSize, 0)
  const totalCompressedSize = images.reduce(
    (sum, img) => sum + (img.compressedSize || 0),
    0
  )
  const totalReduction =
    totalCompressedSize > 0
      ? calculateReduction(totalOriginalSize, totalCompressedSize)
      : 0

  const completedCount = images.filter((img) => img.status === 'completed').length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Image Compressor</h1>
                <p className="text-sm text-muted-foreground">
                  Free • Unlimited • Private
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        {images.length > 0 && (
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Images</CardDescription>
                <CardTitle className="text-3xl">{images.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Completed</CardDescription>
                <CardTitle className="text-3xl">{completedCount}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Original Size</CardDescription>
                <CardTitle className="text-2xl">{formatBytes(totalOriginalSize)}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Compressed Size</CardDescription>
                <CardTitle className="text-2xl text-green-600 dark:text-green-400">
                  {formatBytes(totalCompressedSize)}
                  {totalReduction > 0 && (
                    <Badge className="ml-2" variant="secondary">
                      {totalReduction}% smaller
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        )}

        {/* Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              <CardTitle>Compression Settings</CardTitle>
            </div>
            <CardDescription>
              Adjust quality and dimensions for all images
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Quality</label>
                <span className="text-sm text-muted-foreground">{quality}%</span>
              </div>
              <Slider
                value={quality}
                onChange={setQuality}
                min={1}
                max={100}
              />
              <p className="text-xs text-muted-foreground">
                Lower quality = smaller file size. Recommended: 70-85%
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h4 className="text-sm font-medium">Advanced Options</h4>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="webp"
                  checked={convertToWebP}
                  onCheckedChange={setConvertToWebP}
                />
                <label
                  htmlFor="webp"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Convert to WebP format (typically 25-35% smaller)
                </label>
              </div>

              <div className="space-y-2">
                <label htmlFor="maxDimension" className="text-sm font-medium">
                  Max Width/Height (optional)
                </label>
                <Input
                  id="maxDimension"
                  type="number"
                  placeholder="e.g., 1920"
                  value={maxDimension || ''}
                  onChange={(e) => setMaxDimension(e.target.value ? Number(e.target.value) : undefined)}
                  className="max-w-xs"
                />
                <p className="text-xs text-muted-foreground">
                  Resize images larger than this dimension. Leave empty for no resizing.
                </p>
              </div>
            </div>

            {images.length > 0 && (
              <div className="flex gap-2">
                <Button
                  onClick={handleRecompressAll}
                  disabled={isCompressing}
                  variant="outline"
                >
                  Recompress All
                </Button>
                <Button
                  onClick={handleDownloadAll}
                  disabled={completedCount === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download All ({completedCount})
                </Button>
                <Button
                  onClick={handleClearAll}
                  variant="destructive"
                  className="ml-auto"
                >
                  Clear All
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload Area */}
        {images.length === 0 && (
          <FileDropzone
            onFilesSelected={handleFilesSelected}
            disabled={isCompressing}
          />
        )}

        {/* Image Grid */}
        {images.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Your Images</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  document.getElementById('file-input')?.click()
                }
              >
                Add More Images
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {images.map((image) => (
                <ImageCard
                  key={image.id}
                  image={image}
                  onDownload={handleDownload}
                  onPreview={handlePreview}
                />
              ))}
            </div>
          </>
        )}

        {/* Features Section */}
        {images.length === 0 && <FeaturesSection />}

        {/* FAQ Section */}
        <FAQSection />
      </main>

      {/* Comparison Modal */}
      {selectedImage && (
        <ImageComparisonModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}

      {/* Footer */}
      <Footer />

      {/* Hidden file input for "Add More" */}
      <input
        id="file-input"
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => {
          if (e.target.files) {
            handleFilesSelected(Array.from(e.target.files))
            e.target.value = ''
          }
        }}
        className="hidden"
      />
    </div>
  )
}

export default App
