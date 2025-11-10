import { Github, Heart } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Image Compressor. Built with{' '}
              <Heart className="inline h-4 w-4 text-red-500" /> for privacy and performance.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              All processing happens in your browser. No uploads. No tracking. No limits.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t text-center">
          <p className="text-xs text-muted-foreground">
            <strong>SEO Keywords:</strong> Image compressor, compress images online, reduce image size,
            optimize images, JPEG compression, PNG compression, WebP converter, batch image compression,
            free image optimizer, image size reducer
          </p>
        </div>
      </div>
    </footer>
  )
}
