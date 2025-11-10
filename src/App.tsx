import { useState, useCallback, useEffect } from 'react'
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
import { BatchActions } from './components/batch-actions'
import { SortFilterControls } from './components/sort-filter-controls'
import { Button } from './components/ui/button'
import { Slider } from './components/ui/slider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Checkbox } from './components/ui/checkbox'
import { Input } from './components/ui/input'
import { Toaster } from './components/ui/toaster'
import { ImageFile, CompressionOptions, PresetMode, ViewMode, SortBy, SortOrder, FilterStatus } from './types'
import { compressImage, createImagePreview } from './lib/compression'
import { formatBytes, calculateReduction } from './lib/utils'
import { COMPRESSION_PRESETS, sortImages, applyNamingPattern, getImageDimensions } from './lib/presets'
import { triggerSuccessConfetti, triggerBatchCompleteConfetti } from './lib/confetti'

const MAX_RETRY_ATTEMPTS = 3
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

function App() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [selectedPreset, setSelectedPreset] = useState<PresetMode>('web')
  const [quality, setQuality] = useState(75)
  const [maxDimension, setMaxDimension] = useState<number | undefined>(1920)
  const [convertToWebP, setConvertToWebP] = useState(true)
  const [preserveExif, setPreserveExif] = useState(false)
  const [namingPattern, setNamingPattern] = useState('{name}-compressed.{ext}')
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortBy>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Apply preset when changed
  useEffect(() => {
    if (selectedPreset !== 'custom') {
      const preset = COMPRESSION_PRESETS[selectedPreset]
      setQuality(preset.quality)
      setMaxDimension(preset.maxDimension)
      setConvertToWebP(preset.format === 'webp')
    }
  }, [selectedPreset])

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
    setImages((prev) => prev.filter((img) => img.id !== id))
    toast.success('Image deleted')
  }, [])

  const handleToggleSelect = useCallback((id: string) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, selected: !img.selected } : img
      )
    )
  }, [])

  const handleSelectAll = useCallback(() => {
    setImages((prev) => prev.map((img) => ({ ...img, selected: true })))
  }, [])

  const handleDeselectAll = useCallback(() => {
    setImages((prev) => prev.map((img) => ({ ...img, selected: false })))
  }, [])

  const handleDownloadSelected = useCallback(async () => {
    const selectedImages = images.filter((img) => img.selected && img.compressedFile)
    if (selectedImages.length === 0) {
      toast.error('No compressed images selected')
      return
    }

    if (selectedImages.length === 1) {
      handleDownload(selectedImages[0].id)
      return
    }

    const zip = new JSZip()
    selectedImages.forEach((image, index) => {
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
    a.download = `selected-images-${Date.now()}.zip`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Selected images downloaded')
  }, [images, handleDownload, namingPattern])

  const handleDeleteSelected = useCallback(() => {
    const count = images.filter((img) => img.selected).length
    setImages((prev) => prev.filter((img) => !img.selected))
    toast.success(`Deleted ${count} image${count > 1 ? 's' : ''}`)
  }, [images])

  const handleRecompressSelected = useCallback(() => {
    const selectedImages = images.filter((img) => img.selected)
    if (selectedImages.length === 0) {
      toast.error('No images selected')
      return
    }
    compressImages(selectedImages)
  }, [images, compressImages])

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

  // Filter and sort images
  const filteredImages = images.filter((img) => {
    if (filterStatus === 'all') return true
    return img.status === filterStatus
  })

  const sortedImages = sortImages(filteredImages, sortBy, sortOrder)
  const selectedCount = images.filter((img) => img.selected).length

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

  const getGridClass = () => {
    switch (viewMode) {
      case 'list':
        return 'grid gap-4 grid-cols-1'
      case 'compact':
        return 'grid gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
      case 'grid':
      default:
        return 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />

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

            {images.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => compressImages(images.filter(img => img.status !== 'completed'))}
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

        {/* Import Options */}
        {images.length === 0 && (
          <ImportOptions onFilesImported={handleFilesSelected} />
        )}

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
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-2xl font-semibold">Your Images</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <SortFilterControls
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  filterStatus={filterStatus}
                  viewMode={viewMode}
                  onSortChange={setSortBy}
                  onSortOrderToggle={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  onFilterChange={setFilterStatus}
                  onViewModeChange={setViewMode}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document.getElementById('file-input')?.click()
                  }
                >
                  Add More
                </Button>
              </div>
            </div>

            {selectedCount > 0 && (
              <BatchActions
                selectedCount={selectedCount}
                totalCount={images.length}
                onSelectAll={handleSelectAll}
                onDeselectAll={handleDeselectAll}
                onDownloadSelected={handleDownloadSelected}
                onDeleteSelected={handleDeleteSelected}
                onRecompressSelected={handleRecompressSelected}
              />
            )}

            <div className={getGridClass()}>
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
                    showCheckbox={selectedCount > 0 || images.length > 1}
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
