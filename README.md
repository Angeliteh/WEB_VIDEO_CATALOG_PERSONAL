# MediaVault Pro - Professional Videographer Portfolio

A beautiful, responsive personal video portfolio website for videographers and content creators, featuring multilingual support and dark mode.

## 🌟 Features

### 🎬 Professional Video Portfolio
- **Personal Brand**: Showcases Alex Rodriguez, a professional videographer based in Colorado
- **Service-Oriented**: Focused on wedding videography, corporate content, events, and creative collaborations
- **Authentic Content**: Real-world descriptions that feel like an actual working professional's portfolio

### 🌍 Multilingual Support (i18n)
- **English & Spanish**: Complete translation system
- **Easy Language Switching**: Toggle between languages with buttons in navigation
- **Persistent Settings**: Language preference saved in browser
- **Auto-Detection**: Automatically detects browser language on first visit

### 🌙 Dark/Light Mode
- **Theme Toggle**: Beautiful floating button to switch between themes
- **System Preference**: Automatically detects system dark mode preference
- **Persistent Settings**: Theme preference saved in browser
- **Smooth Transitions**: Elegant animations when switching themes
- **Keyboard Shortcut**: Press `Ctrl/Cmd + Shift + D` to toggle theme

### 📱 Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Touch-Friendly**: Easy navigation on mobile devices
- **Fast Loading**: Optimized performance across devices

## 🚀 Perfect For

- **Professional Videographers**: Showcase your services and attract clients
- **Wedding Filmmakers**: Display your cinematic wedding work
- **Corporate Video Producers**: Professional business portfolio
- **Content Creators**: Organize and present your creative projects
- **Freelance Filmmakers**: All-in-one portfolio and contact solution
- **Creative Agencies**: Team member portfolios or service showcases

## 🛠️ Technical Features

### Internationalization (i18n)
- JSON-based translation files (`lang/en.json`, `lang/es.json`)
- Dynamic content translation using `data-i18n` attributes
- Support for placeholders, alt text, and HTML content
- Easy to add new languages

### Dark Mode System
- CSS custom properties for theme variables
- JavaScript class for theme management
- Local storage persistence
- System preference detection
- Print-friendly (auto-switches to light mode for printing)

### File Structure
```
├── index.html              # Main portfolio page
├── about.html              # About page
├── contact.html            # Contact page
├── video-page.html         # Individual video page
├── css/
│   ├── bootstrap.min.css   # Bootstrap framework
│   ├── templatemo-video-catalog.css  # Main styles
│   ├── i18n.css           # Language selector styles
│   └── dark-mode.css      # Dark mode styles
├── js/
│   ├── jquery-3.4.1.min.js
│   ├── bootstrap.min.js
│   ├── i18n.js            # Internationalization system
│   └── dark-mode.js       # Dark mode toggle system
├── lang/
│   ├── en.json            # English translations
│   └── es.json            # Spanish translations
├── img/                   # Images and thumbnails
├── video/                 # Video files
└── fontawesome/           # Icon fonts
```

## 🎯 Use Cases

### Personal Media Library
- Organize family videos by events, years, or people
- Create beautiful galleries for special occasions
- Share memories with family and friends
- Keep everything organized and easily accessible

### Professional Portfolio
- Showcase client work with professional presentation
- Organize projects by category or client
- Easy sharing with potential clients
- Multilingual support for international clients

### Content Creator Hub
- Display your creative work professionally
- Organize content by themes or projects
- Easy navigation for viewers
- Dark mode for comfortable viewing

## 🌐 Language Support

Currently supports:
- **English**: Complete interface translation
- **Spanish**: Complete interface translation

### Adding New Languages
1. Create new JSON file in `lang/` folder (e.g., `lang/fr.json`)
2. Copy structure from `lang/en.json`
3. Translate all values
4. Add language code to `supportedLanguages` array in `js/i18n.js`
5. Add language button to navigation

## 🎨 Customization

### Adding Your Content
1. Replace video thumbnails in `img/` folder
2. Update video descriptions in language files
3. Add your actual video files to `video/` folder
4. Customize about page with your story
5. Update contact information

### Styling
- Modify `css/templatemo-video-catalog.css` for layout changes
- Adjust `css/dark-mode.css` for theme customization
- Update color variables in CSS custom properties

## 📱 Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Setup

1. Download/clone the files
2. Open `index.html` in a web browser
3. For local development, use a local server (e.g., Live Server in VS Code)
4. Customize content and styling as needed

## 💡 Tips

- Use the keyboard shortcut `Ctrl/Cmd + Shift + D` for quick theme switching
- Language and theme preferences are automatically saved
- The system respects user's browser language and dark mode preferences
- All images should be optimized for web (WebP format recommended)
- Videos should be compressed for web streaming

## 🤝 Contributing

Feel free to:
- Add new language translations
- Improve the design
- Add new features
- Report bugs or suggestions

---

**MediaVault Pro** - Making personal video libraries beautiful and accessible! 🎬✨
