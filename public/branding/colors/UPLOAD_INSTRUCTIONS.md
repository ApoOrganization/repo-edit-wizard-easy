# Color Palette Upload Instructions

## Upload Your Color Palette Here

### Simple Format: `colors.txt`
Create a text file with your brand colors:
```
Primary: #3B82F6
Secondary: #1E293B
Accent: #10B981
Success: #10B981
Warning: #F59E0B
Error: #EF4444
Background: #FFFFFF
Surface: #F8FAFC
Text Primary: #1F2937
Text Secondary: #6B7280
Border: #E5E7EB
```

### Advanced Format: `colors.json`
Create a JSON file with detailed color scales:
```json
{
  "primary": {
    "50": "#eff6ff",
    "100": "#dbeafe", 
    "500": "#3b82f6",
    "900": "#1e3a8a"
  },
  "secondary": "#1e293b",
  "accent": "#10b981",
  "semantic": {
    "success": "#10b981",
    "warning": "#f59e0b",
    "error": "#ef4444"
  }
}
```

### Required Colors
At minimum, provide these colors:
- **Primary** - Main brand color
- **Secondary** - Supporting brand color
- **Background** - Main background color
- **Text** - Primary text color

### Optional but Helpful
- **Accent** - Highlight/call-to-action color
- **Success** - Success state color (usually green)
- **Warning** - Warning state color (usually yellow/orange)
- **Error** - Error state color (usually red)
- **Surface** - Card/panel background
- **Border** - Border and divider color

## Color Format
- Use hex codes: `#3B82F6`
- Or provide RGB: `rgb(59, 130, 246)`
- Or HSL: `hsl(217, 91%, 60%)`

## What Happens Next
Your colors will be integrated into:
- Tailwind CSS configuration
- CSS custom properties
- Design system tokens
- All UI components