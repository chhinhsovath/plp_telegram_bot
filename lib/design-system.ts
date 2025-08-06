// Minimal Professional Design System for PLP Telegram Bot

// Clean Color Palette - Using subtle grays and blue accents
export const colors = {
  primary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b', // Main primary - subtle gray
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  accent: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Clean blue accent
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  success: '#059669',
  warning: '#d97706',
  error: '#dc2626',
  info: '#0ea5e9',
};

// Subtle Animation Variants - Reduced for better user experience
export const animations = {
  // Gentle page transitions
  pageTransition: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.2 },
  },
  
  // Simple stagger
  staggerContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  },
  
  staggerItem: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },
  
  // Minimal hover effects
  cardHover: {
    y: -2,
    transition: { duration: 0.2 },
  },
  
  // Simple fade
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },
};

// Clean, minimal styles
export const minimal = {
  // Card styles
  card: "bg-white border border-gray-200 rounded-lg shadow-sm",
  cardHover: "hover:shadow-md hover:border-gray-300 transition-all duration-200",
  
  // Button styles
  button: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md px-4 py-2 text-sm font-medium",
  buttonPrimary: "bg-blue-600 text-white hover:bg-blue-700 rounded-md px-4 py-2 text-sm font-medium border-0",
  
  // Text styles
  heading: "text-gray-900 font-semibold",
  text: "text-gray-700",
  textSecondary: "text-gray-600",
  textMuted: "text-gray-500",
  
  // Layout
  container: "bg-gray-50",
  sidebar: "bg-white border-r border-gray-200",
  nav: "bg-white border-b border-gray-200",
};