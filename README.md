# Image Compression Optimizer

A powerful, privacy-first image compression tool that reduces JPEG, PNG, and WebP file sizes by 60-90% directly in your browser. No uploads, unlimited usage, and completely free.

## 🌟 Features

### **Core Functionality**
- ✅ **100% Private**: All processing happens in your browser - no server uploads
- ✅ **Unlimited**: No limits on file count, file size, or daily usage
- ✅ **Fast Compression**: Uses advanced algorithms with Web Workers for optimal performance
- ✅ **Batch Processing**: Compress multiple images simultaneously
- ✅ **Real-time Progress**: Live progress indicators for each image
- ✅ **Format Conversion**: Convert to WebP for 25-35% additional savings

### **Quality Presets**
- 🎯 **Web Optimized** (75% quality, 1920px max) - Perfect for websites
- 🖨️ **Print Quality** (90% quality, no resize) - High quality for printing
- 📦 **Archive** (60% quality, 2048px max) - Maximum compression for storage
- ⚙️ **Custom** - Full control over all settings

### **Advanced Options**
- 🎨 **Quality Control**: Fine-tune compression from 1-100%
- 📐 **Max Dimensions**: Automatic resizing for large images
- 🏷️ **Custom Naming**: Pattern-based file renaming ({name}, {index}, {date}, {timestamp})
- 📋 **EXIF Control**: Preserve or remove image metadata
- 🔄 **Format Support**: JPEG, PNG, WebP, BMP

### **Batch Operations**
- ☑️ **Select/Deselect**: Checkboxes for selective operations
- 📥 **Bulk Download**: Download selected images as ZIP
- 🗑️ **Bulk Delete**: Remove multiple images at once
- 🔄 **Bulk Recompress**: Recompress with new settings
- 🎯 **Smart Selection**: Select all/none with one click

### **Sorting & Filtering**
- 🔤 **Sort by**: Name, Size, Reduction %, Status
- ⬆️⬇️ **Sort Order**: Ascending or Descending
- 🔍 **Filter by Status**: All, Pending, Compressing, Completed, Errors
- 👁️ **View Modes**: Grid, List, Compact views

### **Import Options**
- 📋 **Clipboard Paste**: Paste images directly from clipboard
- 🔗 **URL Import**: Import images from any URL
- 📸 **Camera Capture**: Take photos and compress instantly
- 📁 **Drag & Drop**: Intuitive file upload

### **Visual Features**
- 🎭 **Before/After Comparison**: Interactive slider to compare results
- 🎊 **Success Animations**: Delightful confetti on completion
- ✨ **Smooth Transitions**: Framer Motion animations throughout
- 🌓 **Dark Mode**: Beautiful dark theme with toggle
- 💬 **Toast Notifications**: Non-intrusive success/error messages
- 📊 **Statistics Dashboard**: Real-time compression stats

### **User Experience**
- 🔄 **Retry Logic**: Auto-retry failed compressions (up to 3 attempts)
- ⏱️ **Compression Time**: Shows time taken for each image
- 📏 **Dimension Display**: Original and compressed dimensions
- 🎯 **Tooltips**: Helpful hints on all features
- ⌨️ **Keyboard Navigation**: Full keyboard support
- 📱 **Responsive Design**: Works perfectly on mobile, tablet, and desktop

### **Error Handling**
- 🛡️ **Error Boundaries**: Graceful error handling
- 🔁 **Retry on Failure**: Automatic and manual retry options
- ⚠️ **File Validation**: Checks file type and size (max 50MB)
- 📝 **Detailed Error Messages**: Clear, actionable feedback

### **Accessibility**
- ♿ **ARIA Labels**: Comprehensive screen reader support
- ⌨️ **Keyboard Navigation**: Full keyboard accessibility
- 🎯 **Focus Management**: Proper tab order and focus states
- 🔊 **Live Regions**: Announces status changes

### **Performance**
- ⚡ **Web Workers**: Non-blocking compression
- 🎯 **Progress Tracking**: Real-time progress updates
- 💾 **Memory Management**: Efficient resource handling
- 🚀 **PWA Support**: Installable as native-like app
- 📴 **Offline Capable**: Works without internet

## 🎯 Tech Stack

- **React 18.3** + **TypeScript 5.6** - Type-safe component architecture
- **Vite 5.4** - Lightning-fast build tool
- **Tailwind CSS 3.4** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible components
- **browser-image-compression 2.0** - High-quality image compression
- **JSZip 3.10** - Batch download as ZIP
- **Framer Motion** - Smooth animations
- **Sonner** - Toast notifications
- **Canvas Confetti** - Success celebrations
- **Lucide Icons** - Modern icon library

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📖 Usage

1. **Upload Images**
   - Drag and drop files
   - Click "Choose Files"
   - Paste from clipboard (Ctrl/Cmd + V)
   - Import from URL
   - Capture with camera

2. **Choose Settings**
   - Select a preset (Web, Print, Archive) or use Custom
   - Adjust quality slider (recommended: 70-85%)
   - Optionally set max dimensions
   - Toggle WebP conversion
   - Configure EXIF preservation
   - Set custom naming pattern

3. **Compress**
   - Images are automatically compressed
   - Watch real-time progress
   - View before/after comparison

4. **Download**
   - Download individual images
   - Select multiple and download as ZIP
   - Bulk operations available

## 🎨 New Features

### Preset Quality Modes
Choose from pre-configured settings optimized for different use cases:
- **Web**: 75% quality, 1920px max, WebP format
- **Print**: 90% quality, no resizing
- **Archive**: 60% quality, 2048px max, WebP format

### Batch Operations
- Select multiple images with checkboxes
- Download selected images as ZIP
- Delete or recompress selected images
- Select/deselect all with one click

### Advanced Filtering & Sorting
- Sort by name, size, reduction percentage, or status
- Filter by completion status
- Switch between grid, list, and compact views

### Import from Anywhere
- **Clipboard**: Paste images directly (Ctrl/Cmd + V)
- **URL**: Import from any image URL
- **Camera**: Capture photos on mobile devices

### Smart Naming
Use patterns for automatic file naming:
- `{name}` - Original filename
- `{index}` - Sequential number
- `{date}` - Current date (YYYY-MM-DD)
- `{timestamp}` - Unix timestamp
- `{ext}` - File extension

Example: `{name}-compressed-{date}.{ext}`

### Enhanced UX
- Success confetti animation on completion
- Toast notifications for all actions
- Retry failed compressions (up to 3 attempts)
- Real-time compression time display
- Image dimension tracking
- Progress percentage display

## 📊 Performance

- **Compression Ratio**: Typically 60-90% size reduction
- **Processing Speed**: < 1 second per MB
- **Bundle Size**: 534 KB (171 KB gzipped)
- **Parallel Processing**: Multiple images compressed simultaneously
- **Memory Efficient**: Proper cleanup and resource management

## 🔒 Security & Privacy

- **No Server Upload**: 100% client-side processing
- **File Validation**: Checks file type and size
- **Max File Size**: 50MB per image (configurable)
- **XSS Prevention**: Input sanitization
- **Memory Limits**: Prevents DoS attacks
- **Error Boundaries**: Graceful error handling

## ♿ Accessibility

- WCAG 2.1 AA compliant
- Full keyboard navigation support
- Screen reader optimized
- ARIA labels throughout
- Focus management
- Reduced motion support

## 📱 Mobile Support

- Touch-optimized interface
- Camera integration
- Responsive grid layouts
- Mobile-friendly buttons (44x44px)
- Swipe gestures for delete
- Share sheet integration

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by the need for privacy-focused tools
- Thanks to the open-source community

---

**✨ No uploads. No limits. No tracking. Just compression. ✨**
