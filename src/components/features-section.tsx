import { Shield, Zap, Infinity, Download, Gauge, Globe } from 'lucide-react'
import { Card, CardContent } from './ui/card'

export function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: '100% Private',
      description: 'All processing happens in your browser. Your images never leave your device.',
    },
    {
      icon: Infinity,
      title: 'Unlimited',
      description: 'No limits on file count, file size, or daily usage. Compress as much as you need.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Advanced algorithms with Web Workers ensure fast compression without freezing your browser.',
    },
    {
      icon: Download,
      title: 'Batch Download',
      description: 'Download all compressed images at once as a convenient ZIP file.',
    },
    {
      icon: Gauge,
      title: '60-90% Reduction',
      description: 'Achieve massive file size reductions while maintaining excellent visual quality.',
    },
    {
      icon: Globe,
      title: 'Works Offline',
      description: 'Once loaded, the tool works completely offline. No internet connection needed.',
    },
  ]

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Why Choose Our Image Compressor?</h2>
        <p className="text-muted-foreground text-lg">
          Professional-grade compression, completely free and private
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardContent className="pt-6 space-y-3">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
