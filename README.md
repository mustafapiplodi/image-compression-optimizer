# 🖼️ Image Compression Optimizer

A powerful, privacy-first image compression tool that reduces JPEG, PNG, and WebP file sizes by **60-90%** directly in your browser. No uploads, unlimited usage, and completely free.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://mustafapiplodi.github.io/image-compression-optimizer)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)

---

## ✨ Key Features

### 🔒 **100% Private & Secure**
- All processing happens **locally in your browser**
- Zero server uploads - your images never leave your device
- Works completely offline after first load
- No tracking, no analytics, no data collection

### ⚡ **Powerful Compression**
- **60-90% file size reduction** with minimal quality loss
- Advanced algorithms via `browser-image-compression`
- Web Workers for non-blocking, parallel processing
- Real-time progress tracking for each image

### 🚀 **Unlimited Usage**
- No limits on file count or file size
- Unlike TinyPNG's 20-image daily cap
- Batch process hundreds of images at once
- No sign-up or payment required

### 🎨 **Quality Presets**
Choose from optimized compression profiles:

| Preset | Quality | Max Dimension | Format | Best For |
|--------|---------|---------------|--------|----------|
| **Web Optimized** | 75% | 1920px | WebP | Websites & apps |
| **Print Quality** | 90% | No limit | Original | High-quality prints |
| **Archive** | 60% | 2048px | WebP | Long-term storage |
| **Custom** | 1-100% | Custom | Any | Full control |

### 📥 **Multiple Import Methods**
- 📁 **Drag & Drop** - Intuitive file upload
- 📂 **File Picker** - Traditional file selection
- 📋 **Clipboard Paste** - Paste images directly
- 🔗 **URL Import** - Import from any image URL
- 📸 **Camera Capture** - Take photos and compress instantly

### 💾 **Flexible Export**
- Download individual compressed images
- Batch download all images as **ZIP file**
- Custom naming patterns: `{name}`, `{index}`, `{date}`, `{timestamp}`, `{ext}`
- Automatic file renaming on download

### 🎯 **Advanced Options**
- **Quality Slider**: Fine-tune compression (1-100%)
- **Max Dimensions**: Automatic resizing for large images
- **WebP Conversion**: 25-35% additional size savings
- **EXIF Preservation**: Keep or remove image metadata
- **Format Support**: JPEG, PNG, WebP, BMP

### 🎭 **Beautiful User Experience**
- 🌓 **Dark/Light Mode** - System-aware theming
- 🖼️ **Before/After Comparison** - Interactive slider to see differences
- 🎊 **Success Animations** - Delightful confetti celebrations
- 📊 **Live Statistics** - Real-time compression stats
- 💬 **Toast Notifications** - Non-intrusive feedback
- 📱 **Responsive Design** - Perfect on mobile, tablet, and desktop
- ✨ **Smooth Animations** - Powered by Framer Motion

### 🛠️ **Smart Features**
- **Auto-Scroll**: Automatically scrolls to results after compression
- **Retry Logic**: Up to 3 automatic retry attempts on failure
- **Error Handling**: Comprehensive error messages with solutions
- **Settings Persistence**: Remembers your preferences via LocalStorage
- **Dimension Tracking**: Shows original and compressed dimensions
- **Compression Time**: Displays processing time for each image

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/mustafapiplodi/image-compression-optimizer.git

# Navigate to project directory
cd image-compression-optimizer

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📖 How to Use

### 1️⃣ **Upload Images**

Choose your preferred method:
- **Drag & Drop**: Simply drag image files onto the dropzone
- **Click to Browse**: Click "Choose Files" button
- **Paste**: Copy an image and paste it anywhere on the page
- **URL**: Click "URL" and enter an image URL
- **Camera**: Click "Camera" to take a photo (mobile devices)

### 2️⃣ **Configure Settings**

Select a preset or customize:
- Choose a **Preset**: Web, Print, Archive, or Custom
- Adjust **Quality**: Use the slider (recommended: 70-85%)
- Set **Max Dimensions** (optional): Resize large images
- Toggle **WebP Conversion**: For additional 25-35% savings
- Configure **EXIF Metadata**: Preserve or remove
- Set **Naming Pattern**: Customize output filenames

### 3️⃣ **Compress & Download**

- Images are automatically compressed when uploaded
- Watch real-time progress for each image
- Use **Compare** button to see before/after
- Click **Download** for individual images
- Click **Download All** for ZIP of all compressed images

---

## 🎯 Tech Stack

### Core Technologies
- **[React 18.3](https://reactjs.org/)** - Modern UI framework
- **[TypeScript 5.6](https://www.typescriptlang.org/)** - Type-safe development
- **[Vite 5.4](https://vitejs.dev/)** - Lightning-fast build tool

### UI & Styling
- **[Tailwind CSS 3.4](https://tailwindcss.com/)** - Utility-first CSS
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful component library
- **[Framer Motion](https://www.framer.com/motion/)** - Smooth animations
- **[Lucide Icons](https://lucide.dev/)** - Modern icon library

### Image Processing
- **[browser-image-compression 2.0](https://github.com/Donaldcwl/browser-image-compression)** - Client-side compression
- **[JSZip 3.10](https://stuk.github.io/jszip/)** - ZIP file generation

### User Experience
- **[Sonner](https://sonner.emilkowal.ski/)** - Beautiful toast notifications
- **[Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)** - Celebration effects

---

## 📊 Performance Metrics

| Metric | Value |
|--------|-------|
| **Compression Ratio** | 60-90% size reduction |
| **Processing Speed** | < 1 second per MB |
| **Initial Load Time** | ~800ms (Vite build) |
| **Bundle Size** | Optimized with code splitting |
| **Max File Size** | 50MB per image (configurable) |

---

## 🔒 Security & Privacy

✅ **Client-Side Processing** - All compression happens in your browser
✅ **No Server Uploads** - Images never leave your device
✅ **File Validation** - Type and size checks
✅ **XSS Prevention** - Proper input sanitization
✅ **Memory Management** - Efficient resource cleanup
✅ **Error Boundaries** - Graceful error handling

---

## ♿ Accessibility

- ✅ WCAG 2.1 AA compliant
- ✅ Full keyboard navigation
- ✅ Screen reader optimized
- ✅ ARIA labels throughout
- ✅ Focus management
- ✅ Reduced motion support

---

## 🌐 Browser Support

| Browser | Support |
|---------|---------|
| Chrome/Edge | ✅ Latest |
| Firefox | ✅ Latest |
| Safari | ✅ Latest |
| Mobile (iOS/Android) | ✅ Latest |

**Note**: Requires modern browser with Web Workers and Canvas API support.

---

## 📱 Mobile Features

- 📸 **Camera Integration** - Capture photos directly
- 👆 **Touch Optimized** - Responsive touch targets
- 📱 **Responsive Layout** - Adapts to any screen size
- 🔄 **Orientation Support** - Works in portrait and landscape

---

## 🎨 Customization

### Naming Patterns

Use these variables in your custom naming pattern:
- `{name}` - Original filename (without extension)
- `{index}` - Sequential number (001, 002, ...)
- `{date}` - Current date (YYYY-MM-DD)
- `{timestamp}` - Unix timestamp
- `{ext}` - File extension

**Example**: `{name}-compressed-{date}.{ext}`
**Output**: `photo-compressed-2024-01-15.jpg`

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

Feel free to use this project for personal or commercial purposes.

---

## 🙏 Credits

**Powered by [Scaling High Technologies](https://www.scalinghigh.com)**

### Acknowledgments
- Built with ❤️ for privacy-focused image compression
- Inspired by the need for unlimited, client-side processing
- Thanks to the open-source community for amazing tools

---

## 📞 Support

- 🐛 **Report Issues**: [GitHub Issues](https://github.com/mustafapiplodi/image-compression-optimizer/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/mustafapiplodi/image-compression-optimizer/discussions)
- 🔗 **Main Site**: [Scaling High](https://www.scalinghigh.com)
- 🛠️ **Tools**: [All Tools](https://www.scalinghigh.com/tools)

---

## 🎯 SEO Keywords

Image compressor, compress images online, reduce image size, optimize images, JPEG compression, PNG compression, WebP converter, batch image compression, free image optimizer, image size reducer, browser-based image compression, client-side image processing, privacy-first image compressor

---

<div align="center">

### ✨ No uploads. No limits. No tracking. Just compression. ✨

**[Try it Now](https://mustafapiplodi.github.io/image-compression-optimizer)** | **[View Source](https://github.com/mustafapiplodi/image-compression-optimizer)**

Made with ❤️ by [Scaling High Technologies](https://www.scalinghigh.com)

</div>
