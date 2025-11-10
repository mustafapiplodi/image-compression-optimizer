import { COMPRESSION_PRESETS } from '@/lib/presets'
import { Button } from './ui/button'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PresetMode } from '@/types'
import { Tooltip } from './ui/tooltip'

interface PresetSelectorProps {
  selectedPreset: PresetMode
  onPresetChange: (preset: PresetMode) => void
}

export function PresetSelector({ selectedPreset, onPresetChange }: PresetSelectorProps) {
  const presets: PresetMode[] = ['web', 'print', 'archive', 'custom']

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Quality Presets</label>
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => {
          const presetData = COMPRESSION_PRESETS[preset]
          const isSelected = selectedPreset === preset

          return (
            <Tooltip
              key={preset}
              content={`${presetData.description} • ${presetData.quality}% quality${presetData.maxDimension ? ` • ${presetData.maxDimension}px max` : ''}`}
            >
              <Button
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPresetChange(preset)}
                className={cn(
                  'relative transition-all',
                  isSelected && 'pr-7'
                )}
              >
                {presetData.name}
                {isSelected && (
                  <Check className="ml-2 h-3 w-3 absolute right-2" />
                )}
              </Button>
            </Tooltip>
          )
        })}
      </div>
    </div>
  )
}
