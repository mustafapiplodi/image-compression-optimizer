import { ArrowUpDown, Filter, Grid3x3, List, LayoutGrid } from 'lucide-react'
import { Button } from './ui/button'
import { Tooltip } from './ui/tooltip'
import { SortBy, SortOrder, FilterStatus, ViewMode } from '@/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

interface SortFilterControlsProps {
  sortBy: SortBy
  sortOrder: SortOrder
  filterStatus: FilterStatus
  viewMode: ViewMode
  onSortChange: (sortBy: SortBy) => void
  onSortOrderToggle: () => void
  onFilterChange: (status: FilterStatus) => void
  onViewModeChange: (mode: ViewMode) => void
}

export function SortFilterControls({
  sortBy,
  sortOrder,
  filterStatus,
  viewMode,
  onSortChange,
  onSortOrderToggle,
  onFilterChange,
  onViewModeChange,
}: SortFilterControlsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Sort */}
      <DropdownMenu>
        <Tooltip content="Sort images">
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Sort: {sortBy}
            </Button>
          </DropdownMenuTrigger>
        </Tooltip>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onSortChange('name')}>
            Name
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange('size')}>
            Size
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange('reduction')}>
            Reduction %
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange('status')}>
            Status
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Sort Order */}
      <Tooltip content={`Sort ${sortOrder === 'asc' ? 'ascending' : 'descending'}`}>
        <Button variant="outline" size="sm" onClick={onSortOrderToggle}>
          {sortOrder === 'asc' ? '↑' : '↓'}
        </Button>
      </Tooltip>

      {/* Filter */}
      <DropdownMenu>
        <Tooltip content="Filter by status">
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              {filterStatus === 'all' ? 'All' : filterStatus}
            </Button>
          </DropdownMenuTrigger>
        </Tooltip>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onFilterChange('all')}>
            All Images
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange('pending')}>
            Pending
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange('compressing')}>
            Compressing
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange('completed')}>
            Completed
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange('error')}>
            Errors
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Mode */}
      <div className="flex items-center gap-1 border rounded-md p-1">
        <Tooltip content="Grid view">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => onViewModeChange('grid')}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
        </Tooltip>
        <Tooltip content="List view">
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => onViewModeChange('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Compact view">
          <Button
            variant={viewMode === 'compact' ? 'default' : 'ghost'}
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => onViewModeChange('compact')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </Tooltip>
      </div>
    </div>
  )
}
