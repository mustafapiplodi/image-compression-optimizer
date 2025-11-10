import { useState, useCallback, useEffect, useRef } from 'react'
import { Download, Settings2, Sparkles } from 'lucide-react'
import JSZip from 'jszip'
import { toast } from 'sonner'
import { AnimatePresence } from 'framer-motion'
import { FileDropzone } from './components/file-dropzone'
import { ImageCard } from './components/image-card'
import { ImageComparisonModal } from './components/image-comparison-modal'
import { ThemeToggle } from './components/theme-toggle'
import { FeaturesSection } from './components/features-section'
import { FAQSection } from './components/faq-section'
import { Footer } from './components/footer'
import { PresetSelector } from './components/preset-selector'
import { ImportOptions } from './components/import-options'
import { Breadcrumbs } from './components/breadcrumbs'
import { Button } from './components/ui/button'
import { Slider } from './components/ui/slider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Checkbox } from './components/ui/checkbox'
import { Input } from './components/ui/input'
import { Toaster } from './components/ui/toaster'
import { ImageFile, CompressionOptions, PresetMode } from './types'
import { compressImage, createImagePreview } from './lib/compression'
import { formatBytes, calculateReduction } from './lib/utils'
import { COMPRESSION_PRESETS, sortImages, applyNamingPattern, getImageDimensions } from './lib/presets'
import { triggerSuccessConfetti, triggerBatchCompleteConfetti } from './lib/confetti'

const MAX_RETRY_ATTEMPTS = 3
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const SETTINGS_STORAGE_KEY = 'image-compressor-settings'

interface AppSettings {
  selectedPreset: PresetMode
  quality: number
  maxDimension?: number
  convertToWebP: boolean
  preserveExif: boolean
  namingPattern: string
}

function loadSettings(): Partial<AppSettings> {
  try {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch {
    return {}
  }
}

function saveSettings(settings: AppSettings) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // Silently fail if localStorage is not available
  }
}

function App() {
  // Load saved settings or use defaults
  const savedSettings = loadSettings()

  const [images, setImages] = useState<ImageFile[]>([])
  const [selectedPreset, setSelectedPreset] = useState<PresetMode>(savedSettings.selectedPreset || 'web')
  const [quality, setQuality] = useState(savedSettings.quality || 75)
  const [maxDimension, setMaxDimension] = useState<number | undefined>(savedSettings.maxDimension !== undefined ? savedSettings.maxDimension : 1920)
  const [convertToWebP, setConvertToWebP] = useState(savedSettings.convertToWebP !== undefined ? savedSettings.convertToWebP : true)
  const [preserveExif, setPreserveExif] = useState(savedSettings.preserveExif || false)
  const [namingPattern, setNamingPattern] = useState(savedSettings.namingPattern || '{name}-compressed.{ext}')
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Apply preset when changed
  useEffect(() => {
    if (selectedPreset !== 'custom') {
      const preset = COMPRESSION_PRESETS[selectedPreset]
      setQuality(preset.quality)
      setMaxDimension(preset.maxDimension)
      setConvertToWebP(preset.format === 'webp')
    }
  }, [selectedPreset])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    const settings: AppSettings = {
      selectedPreset,
      quality,
      maxDimension,
      convertToWebP,
      preserveExif,
      namingPattern,
    }
    saveSettings(settings)
  }, [selectedPreset, quality, maxDimension, convertToWebP, preserveExif, namingPattern])

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return 'Not an image file'
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large (max ${MAX_FILE_SIZE / 1024 / 1024}MB)`
    }
    return null
  }

  const handleFilesSelected = useCallback(async (files: File[]) => {
    const newImages: ImageFile[] = []

    for (const file of files) {
      const error = validateFile(file)
      if (error) {
        toast.error(`${file.name}: ${error}`)
        continue
      }

      try {
        const preview = await createImagePreview(file)
        const dimensions = await getImageDimensions(file)
        const imageFile: ImageFile = {
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          file,
          originalSize: file.size,
          originalPreview: preview,
          originalDimensions: dimensions,
          status: 'pending',
          progress: 0,
          selected: false,
          retryCount: 0,
        }
        newImages.push(imageFile)
      } catch (error) {
        toast.error(`Failed to process ${file.name}`)
      }
    }

    if (newImages.length > 0) {
      setImages((prev) => [...prev, ...newImages])
      toast.success(`Added ${newImages.length} image${newImages.length > 1 ? 's' : ''}`)
      compressImages(newImages)
    }
  }, [])

  // Fullscreen drop target
  useEffect(() => {
    let dragCounter = 0

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault()
      dragCounter++
      if (e.dataTransfer?.types.includes('Files')) {
        setIsDraggingOver(true)
      }
    }

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault()
      dragCounter--
      if (dragCounter === 0) {
        setIsDraggingOver(false)
      }
    }

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
    }

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      dragCounter = 0
      setIsDraggingOver(false)

      const files = Array.from(e.dataTransfer?.files || [])
      if (files.length > 0) {
        handleFilesSelected(files)
      }
    }

    document.addEventListener('dragenter', handleDragEnter)
    document.addEventListener('dragleave', handleDragLeave)
    document.addEventListener('dragover', handleDragOver)
    document.addEventListener('drop', handleDrop)

    return () => {
      document.removeEventListener('dragenter', handleDragEnter)
      document.removeEventListener('dragleave', handleDragLeave)
      document.removeEventListener('dragover', handleDragOver)
      document.removeEventListener('drop', handleDrop)
    }
  }, [handleFilesSelected])

  const compressImages = useCallback(async (imagesToCompress: ImageFile[]) => {
    setIsCompressing(true)
    let successCount = 0

    for (const image of imagesToCompress) {
      try {
        const startTime = Date.now()

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
          preserveExif,
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
        const compressedDimensions = await getImageDimensions(compressedFile)
        const compressionTime = (Date.now() - startTime) / 1000

        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id
              ? {
                  ...img,
                  compressedFile,
                  compressedSize: compressedFile.size,
                  compressedPreview,
                  compressedDimensions,
                  status: 'completed',
                  progress: 100,
                  compressionTime,
                }
              : img
          )
        )

        successCount++
      } catch (error) {
        console.error('Compression error:', error)
        const retryCount = (image.retryCount || 0) + 1

        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id
              ? {
                  ...img,
                  status: 'error',
                  error: error instanceof Error ? error.message : 'Compression failed',
                  retryCount,
                }
              : img
          )
        )

        toast.error(`Failed to compress ${image.file.name}`)
      }
    }

    setIsCompressing(false)

    if (successCount > 0) {
      if (successCount === 1) {
        triggerSuccessConfetti()
      } else {
        triggerBatchCompleteConfetti()
      }
      toast.success(`Successfully compressed ${successCount} image${successCount > 1 ? 's' : ''}!`)

      // Scroll to results after compression - position just below header with spacing
      setTimeout(() => {
        if (resultsRef.current) {
          const headerHeight = 80 // Approximate header height
          const spacing = 32 // Additional spacing in pixels
          const elementPosition = resultsRef.current.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight - spacing

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      }, 300)
    }
  }, [quality, maxDimension, convertToWebP, preserveExif])

  const handleRetry = useCallback((id: string) => {
    const image = images.find((img) => img.id === id)
    if (!image) return

    if ((image.retryCount || 0) >= MAX_RETRY_ATTEMPTS) {
      toast.error('Maximum retry attempts reached')
      return
    }

    toast.info('Retrying compression...')
    compressImages([image])
  }, [images, compressImages])

  const handleDownload = useCallback((id: string) => {
    const image = images.find((img) => img.id === id)
    if (!image?.compressedFile) return

    const filename = applyNamingPattern(image.file.name, namingPattern)
    const url = URL.createObjectURL(image.compressedFile)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Image downloaded')
  }, [images, namingPattern])

  const handleDownloadAll = useCallback(async () => {
    const completedImages = images.filter((img) => img.compressedFile)

    if (completedImages.length === 0) return

    if (completedImages.length === 1) {
      handleDownload(completedImages[0].id)
      return
    }

    const zip = new JSZip()

    completedImages.forEach((image, index) => {
      if (image.compressedFile) {
        const filename = applyNamingPattern(image.file.name, namingPattern, index)
        zip.file(filename, image.compressedFile)
      }
    })

    toast.info('Creating ZIP file...')
    const content = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(content)
    const a = document.createElement('a')
    a.href = url
    a.download = `compressed-images-${Date.now()}.zip`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('ZIP file downloaded')
  }, [images, handleDownload, namingPattern])

  const handleDelete = useCallback((id: string) => {
    const imageToDelete = images.find((img) => img.id === id)
    if (!imageToDelete) return

    setImages((prev) => prev.filter((img) => img.id !== id))
    toast.success('Image deleted')
  }, [images])

  const handleToggleSelect = useCallback((_id: string) => {
    // Removed - no longer using selection mode
  }, [])

  const handlePreview = useCallback((id: string) => {
    const image = images.find((img) => img.id === id)
    if (image) {
      setSelectedImage(image)
    }
  }, [images])

  const handleClearAll = useCallback(() => {
    setImages([])
    toast.success('All images cleared')
  }, [])

  // Sort images by name by default
  const sortedImages = sortImages(images, 'name', 'asc')

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
  const compressingCount = images.filter((img) => img.status === 'compressing').length

  // Calculate average compression speed and ETA
  const completedImages = images.filter((img) => img.status === 'completed' && img.compressionTime && img.originalSize)
  const avgSpeed = completedImages.length > 0
    ? completedImages.reduce((sum, img) => sum + (img.originalSize / (img.compressionTime || 1)), 0) / completedImages.length
    : 0

  const pendingSize = images
    .filter((img) => img.status === 'pending' || img.status === 'compressing')
    .reduce((sum, img) => sum + img.originalSize, 0)

  const estimatedTimeRemaining = avgSpeed > 0 ? pendingSize / avgSpeed : 0

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="bg-primary/10 p-1.5 md:p-2 rounded-lg">
                <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold">Image Compressor</h1>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Free • Unlimited • Private
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <Breadcrumbs />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        {images.length > 0 && (
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardDescription>Total Images</CardDescription>
                <CardTitle className="text-3xl">{images.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardDescription>
                  {compressingCount > 0 ? 'Compressing' : 'Completed'}
                </CardDescription>
                <CardTitle className="text-3xl">
                  {compressingCount > 0 ? compressingCount : completedCount}
                  {compressingCount > 0 && estimatedTimeRemaining > 0 && (
                    <div className="text-sm font-normal text-muted-foreground mt-1">
                      ~{Math.ceil(estimatedTimeRemaining)}s remaining
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardDescription>Original Size</CardDescription>
                <CardTitle className="text-2xl">{formatBytes(totalOriginalSize)}</CardTitle>
              </CardHeader>
            </Card>
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                if (completedCount > 0) {
                  handleDownloadAll()
                }
              }}
            >
              <CardHeader className="pb-3">
                <CardDescription>
                  {compressingCount > 0 ? 'Saved So Far' : 'Compressed Size'}
                  {completedCount > 0 && <span className="ml-1 text-xs">(click to download)</span>}
                </CardDescription>
                <CardTitle className="text-2xl text-green-600 dark:text-green-400">
                  {formatBytes(totalCompressedSize)}
                  {totalReduction > 0 && (
                    <Badge className="ml-2" variant="secondary">
                      {totalReduction}% smaller
                    </Badge>
                  )}
                  {compressingCount > 0 && avgSpeed > 0 && (
                    <div className="text-sm font-normal text-muted-foreground mt-1">
                      {formatBytes(avgSpeed)}/s
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        )}

        {/* Upload Area - MOVED TO TOP */}
        <FileDropzone
          onFilesSelected={handleFilesSelected}
          disabled={isCompressing}
        />

        {/* Import Options - Inline below dropzone */}
        {images.length === 0 && (
          <ImportOptions onFilesImported={handleFilesSelected} />
        )}

        {/* Settings - MOVED AFTER UPLOAD */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings2 className="h-5 w-5" />
                <CardTitle>Compression Settings</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? 'Hide' : 'Show'} Advanced
              </Button>
            </div>
            <CardDescription>
              Choose a preset or customize your settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <PresetSelector
              selectedPreset={selectedPreset}
              onPresetChange={(preset) => {
                setSelectedPreset(preset)
                if (preset === 'custom') {
                  setShowAdvanced(true)
                }
              }}
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Quality</label>
                <span className="text-sm text-muted-foreground">{quality}%</span>
              </div>
              <Slider
                value={quality}
                onChange={(val) => {
                  setQuality(val)
                  setSelectedPreset('custom')
                }}
                min={1}
                max={100}
              />
              <p className="text-xs text-muted-foreground">
                Lower quality = smaller file size. Recommended: 70-85%
              </p>
            </div>

            {showAdvanced && (
              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-sm font-medium">Advanced Options</h4>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="webp"
                    checked={convertToWebP}
                    onCheckedChange={(checked) => {
                      setConvertToWebP(checked)
                      setSelectedPreset('custom')
                    }}
                  />
                  <label
                    htmlFor="webp"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    Convert to WebP format (typically 25-35% smaller)
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="exif"
                    checked={preserveExif}
                    onCheckedChange={setPreserveExif}
                  />
                  <label
                    htmlFor="exif"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    Preserve EXIF metadata
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
                    onChange={(e) => {
                      setMaxDimension(e.target.value ? Number(e.target.value) : undefined)
                      setSelectedPreset('custom')
                    }}
                    className="max-w-xs"
                  />
                  <p className="text-xs text-muted-foreground">
                    Resize images larger than this dimension. Leave empty for no resizing.
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="naming" className="text-sm font-medium">
                    Output File Naming Pattern
                  </label>
                  <Input
                    id="naming"
                    placeholder="{name}-compressed.{ext}"
                    value={namingPattern}
                    onChange={(e) => setNamingPattern(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Use: {'{name}'}, {'{index}'}, {'{date}'}, {'{timestamp}'}, {'{ext}'}
                  </p>
                </div>
              </div>
            )}

          </CardContent>
        </Card>

        {/* Image Grid */}
        {images.length > 0 && (
          <>
            <div ref={resultsRef} className="flex items-center justify-between flex-wrap gap-2 md:gap-4">
              <h2 className="text-xl md:text-2xl font-semibold">Your Images</h2>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleDownloadAll}
                  disabled={completedCount === 0}
                  size="sm"
                  className="h-8"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download All ({completedCount})
                </Button>
                <Button
                  onClick={handleClearAll}
                  variant="destructive"
                  size="sm"
                  className="h-8"
                >
                  Clear All
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence>
                {sortedImages.map((image) => (
                  <ImageCard
                    key={image.id}
                    image={image}
                    onDownload={handleDownload}
                    onPreview={handlePreview}
                    onDelete={handleDelete}
                    onRetry={handleRetry}
                    onToggleSelect={handleToggleSelect}
                    showCheckbox={false}
                  />
                ))}
              </AnimatePresence>
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

      {/* Fullscreen drop overlay */}
      {isDraggingOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="rounded-lg border-4 border-dashed border-primary p-12 bg-background/95 text-center">
            <Sparkles className="h-16 w-16 mx-auto mb-4 text-primary animate-bounce" />
            <h3 className="text-2xl font-bold mb-2">Drop your images here</h3>
            <p className="text-muted-foreground">Release to start compressing</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
