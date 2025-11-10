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
    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg flex-wrap">
      <div className="flex items-center gap-2 flex-1">
        <Tooltip content={allSelected ? 'Deselect all' : 'Select all'}>
          <Button
            variant="outline"
            size="sm"
            onClick={allSelected ? onDeselectAll : onSelectAll}
          >
            {allSelected ? (
              <CheckSquare className="h-4 w-4 mr-2" />
            ) : (
              <Square className="h-4 w-4 mr-2" />
            )}
            {selectedCount} / {totalCount} selected
          </Button>
        </Tooltip>
      </div>

      <div className="flex items-center gap-2">
        <Tooltip content="Download selected images">
          <Button
            variant="outline"
            size="sm"
            onClick={onDownloadSelected}
            disabled={selectedCount === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Download ({selectedCount})
          </Button>
        </Tooltip>

        <Tooltip content="Recompress selected images">
          <Button
            variant="outline"
            size="sm"
            onClick={onRecompressSelected}
            disabled={selectedCount === 0}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Recompress
          </Button>
        </Tooltip>

        <Tooltip content="Delete selected images">
          <Button
            variant="destructive"
            size="sm"
            onClick={onDeleteSelected}
            disabled={selectedCount === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </Tooltip>
      </div>
    </div>
  )
}
