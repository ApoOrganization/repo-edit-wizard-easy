/**
 * Brand Configuration
 * 
 * This file will be automatically updated when branding assets are uploaded.
 * Do not edit manually - changes will be overwritten.
 */

export interface BrandConfig {
  name: string;
  tagline?: string;
  logo: {
    main: string;
    icon: string;
    dark?: string;
    light?: string;
    brandName?: string;
    favicon: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent?: string;
    background: string;
    text: string;
    textSecondary?: string;
    success?: string;
    warning?: string;
    error?: string;
    surface?: string;
    border?: string;
  };
  fonts: {
    primary: string;
    secondary?: string;
    code?: string;
    weights: number[];
  };
}

// Brand configuration with uploaded assets
export const brandConfig: BrandConfig = {
  name: "eventturer",
  tagline: "Entertainment Intelligence Platform",
  logo: {
    main: "/branding/logos/logo.svg",
    icon: "/branding/logos/logo.svg",
    dark: "/branding/logos/logo-dark.svg",
    light: "/branding/logos/logo.svg",
    brandName: "/branding/logos/logo-brand-name.svg",
    favicon: "/branding/logos/logo.svg"
  },
  colors: {
    primary: "#EDF252",      // Bright yellow-green
    secondary: "#020126",    // Dark navy
    accent: "#C861FF",       // Purple
    background: "#F5F5F5",   // Light gray
    text: "#0D0D0D",         // Black (Text Primary)
    textSecondary: "#737373", // Gray (Text Secondary)
    success: "#BBBF49",      // Olive green
    warning: "#737373",      // Gray
    error: "#0D0D0D",        // Black
    surface: "#737373",      // Gray (Surface)
    border: "#BBBF49"        // Olive green (Border)
  },
  fonts: {
    primary: "Satoshi, system-ui, sans-serif",
    secondary: "Satoshi, system-ui, sans-serif",
    weights: [300, 400, 500, 700, 900]
  }
};

// Helper functions for accessing brand properties
export const getBrandColor = (colorName: keyof BrandConfig['colors']) => {
  return brandConfig.colors[colorName];
};

export const getBrandFont = (fontType: keyof BrandConfig['fonts']) => {
  return brandConfig.fonts[fontType];
};

export const getBrandLogo = (variant: keyof BrandConfig['logo'] = 'main') => {
  return brandConfig.logo[variant];
};