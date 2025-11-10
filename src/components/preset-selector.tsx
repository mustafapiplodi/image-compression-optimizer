import { COMPRESSION_PRESETS } from '@/lib/presets'
import { Card } from './ui/card'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PresetMode } from '@/types'

interface PresetSelectorProps {
  selectedPreset: PresetMode
  onPresetChange: (preset: PresetMode) => void
}

export function PresetSelector({ selectedPreset, onPresetChange }: PresetSelectorProps) {
  const presets: PresetMode[] = ['web', 'print', 'archive', 'custom']

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Quality Presets</label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {presets.map((preset) => {
          const presetData = COMPRESSION_PRESETS[preset]
          const isSelected = selectedPreset === preset

          return (
            <Card
              key={preset}
              className={cn(
                'relative cursor-pointer transition-all hover:shadow-md',
                isSelected && 'ring-2 ring-primary'
              )}
              onClick={() => onPresetChange(preset)}
            >
              <div className="p-3 space-y-1">
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
                <div className="text-sm font-semibold">{presetData.name}</div>
                <div className="text-xs text-muted-foreground line-clamp-2">
                  {presetData.description}
                </div>
                <div className="text-xs text-primary font-medium">
                  {presetData.quality}% quality
                  {presetData.maxDimension && ` • ${presetData.maxDimension}px`}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
