import { ChevronRight } from 'lucide-react'

export function Breadcrumbs() {
  return (
    <nav className="border-b bg-muted/30">
      <div className="container mx-auto px-4 py-2">
        <ol className="flex items-center gap-2 text-sm">
          <li>
            <a
              href="https://www.scalinghigh.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </a>
          </li>
          <li>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </li>
          <li>
            <a
              href="https://www.scalinghigh.com/tools"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Tools
            </a>
          </li>
          <li>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </li>
          <li>
            <span className="text-foreground font-medium">Image Compressor</span>
          </li>
        </ol>
      </div>
    </nav>
  )
}
