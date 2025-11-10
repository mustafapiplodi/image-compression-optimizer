import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { HelpCircle } from 'lucide-react'

export function FAQSection() {
  const faqs = [
    {
      question: 'Is my data safe? Are images uploaded to a server?',
      answer:
        'Absolutely safe! All image compression happens directly in your browser. No images are ever uploaded to any server. Your files never leave your device, ensuring complete privacy and security.',
    },
    {
      question: 'Are there any limits on file size or number of images?',
      answer:
        'No limits! Unlike other tools (like TinyPNG with its 20 image daily limit), you can compress unlimited images of any size, completely free.',
    },
    {
      question: 'How much compression can I expect?',
      answer:
        'Typically 60-90% file size reduction while maintaining visual quality. Results vary based on the original image format, quality settings, and content. Our tool uses advanced compression algorithms to achieve maximum reduction with minimal quality loss.',
    },
    {
      question: 'What image formats are supported?',
      answer:
        'We support JPEG, PNG, WebP, and BMP formats. You can also convert images to WebP format for additional 25-35% size reduction compared to JPEG.',
    },
    {
      question: 'Can I use this tool offline?',
      answer:
        'Yes! Once you load the page, it can work offline. All processing happens in your browser, so no internet connection is needed for compression.',
    },
    {
      question: 'What quality setting should I use?',
      answer:
        'For most web use cases, 70-85% quality provides the best balance between file size and visual quality. Lower values create smaller files but may show compression artifacts. Higher values preserve more detail but create larger files.',
    },
    {
      question: 'Why use image compression?',
      answer:
        'Compressed images load faster, reduce bandwidth usage, improve SEO rankings, and provide better user experience. Smaller images are crucial for mobile users and can significantly improve your website performance.',
    },
    {
      question: 'Is this tool really free?',
      answer:
        'Yes, completely free forever with no hidden costs, subscriptions, or usage limits. We believe in providing a quality tool accessible to everyone.',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          <CardTitle>Frequently Asked Questions</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="space-y-2">
            <h3 className="font-semibold text-lg">{faq.question}</h3>
            <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
