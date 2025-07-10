# Font Upload Instructions

## Upload Your Font Files Here

### Option 1: Custom Font Files
Upload your custom font files in these formats:
- **`.woff2`** - Modern format (preferred, best compression)
- **`.woff`** - Good browser support
- **`.ttf`** or **`.otf`** - Fallback formats

### File Naming Convention
```
YourFontName-Regular.woff2
YourFontName-Bold.woff2
YourFontName-Light.woff2
YourFontName-Medium.woff2
```

### Option 2: Font Information File
Create `fonts.txt` with font details:
```
Primary Font: "Your Custom Font", "Helvetica Neue", sans-serif
Secondary Font: "Inter", system-ui, sans-serif
Code Font: "JetBrains Mono", monospace

Font Weights:
- Light: 300
- Regular: 400  
- Medium: 500
- Bold: 700

Google Fonts: Inter, Poppins, JetBrains Mono
```

### Option 3: Google Fonts Only
If using only Google Fonts, just specify in `fonts.txt`:
```
Google Fonts: Inter, Poppins
Primary: "Inter", sans-serif
Secondary: "Poppins", sans-serif
Weights: 400, 500, 600, 700
```

### Font Usage
- **Primary Font** - Headlines, titles, navigation
- **Secondary Font** - Body text, descriptions
- **Code Font** - Code blocks, technical content (optional)

### Required Information
At minimum, provide:
1. **Primary font name** and fallbacks
2. **Font weights** you want to use (400, 500, 600, 700)
3. **Source** (custom files, Google Fonts, system fonts)

## What Happens Next
Your fonts will be integrated into:
- CSS font declarations
- Tailwind font family configuration
- Typography system
- All text components