import { Download, Trash2, RotateCcw, CheckSquare, Square } from 'lucide-react'
import { Button } from './ui/button'
import { Tooltip } from './ui/tooltip'

interface BatchActionsProps {
  selectedCount: number
  totalCount: number
  onSelectAll: () => void
  onDeselectAll: () => void
  onDownloadSelected: () => void
  onDeleteSelected: () => void
  onRecompressSelected: () => void
}

export function BatchActions({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onDownloadSelected,
  onDeleteSelected,
  onRecompressSelected,
}: BatchActionsProps) {
  const allSelected = selectedCount === totalCount && totalCount > 0

  return (
    <div className="flex items-center gap-1.5 md:gap-2 p-2 md:p-3 bg-muted rounded-lg flex-wrap">
      <div className="flex items-center gap-1.5 md:gap-2 flex-1 min-w-fit">
        <Tooltip content={allSelected ? 'Deselect all' : 'Select all'}>
          <Button
            variant="outline"
            size="sm"
            onClick={allSelected ? onDeselectAll : onSelectAll}
            className="h-8 px-2 md:px-3"
          >
            {allSelected ? (
              <CheckSquare className="h-3.5 w-3.5 md:h-4 md:w-4 md:mr-2" />
            ) : (
              <Square className="h-3.5 w-3.5 md:h-4 md:w-4 md:mr-2" />
            )}
            <span className="text-xs md:text-sm">{selectedCount} / {totalCount}</span>
          </Button>
        </Tooltip>
      </div>

      <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
        <Tooltip content="Download selected images">
          <Button
            variant="outline"
            size="sm"
            onClick={onDownloadSelected}
            disabled={selectedCount === 0}
            className="h-8 px-2 md:px-3"
          >
            <Download className="h-3.5 w-3.5 md:h-4 md:w-4 md:mr-2" />
            <span className="hidden sm:inline text-xs md:text-sm">Download</span>
            <span className="sm:hidden md:inline text-xs md:text-sm">({selectedCount})</span>
          </Button>
        </Tooltip>

        <Tooltip content="Recompress selected images">
          <Button
            variant="outline"
            size="sm"
            onClick={onRecompressSelected}
            disabled={selectedCount === 0}
            className="h-8 px-2 md:px-3"
          >
            <RotateCcw className="h-3.5 w-3.5 md:h-4 md:w-4 md:mr-1.5" />
            <span className="hidden md:inline text-xs md:text-sm">Recompress</span>
          </Button>
        </Tooltip>

        <Tooltip content="Delete selected images">
          <Button
            variant="destructive"
            size="sm"
            onClick={onDeleteSelected}
            disabled={selectedCount === 0}
            className="h-8 px-2 md:px-3"
          >
            <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4 md:mr-1.5" />
            <span className="hidden md:inline text-xs md:text-sm">Delete</span>
          </Button>
        </Tooltip>
      </div>
    </div>
  )
}
