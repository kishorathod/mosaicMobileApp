export const COLORS = {
  // Primary Colors (Sky Blue - Web Sync)
  primary: '#0EA5E9',
  primaryLight: '#7DD3FC',
  primaryDark: '#0369A1',

  // Secondary Colors (Lime Green - Web Sync)
  secondary: '#65A30D',
  secondaryLight: '#BEF264',
  secondaryDark: '#3F6212',

  // Accent Colors (Vibrant Violet)
  accent: '#8B5CF6',
  accentLight: '#C4B5FD',
  accentDark: '#6D28D9',

  // Neutral Colors (Web Sync)
  background: '#F8FAFC', // Slate 50
  surface: '#FFFFFF',
  surfaceVariant: '#F1F5F9', // Slate 100
  glass: 'rgba(255, 255, 255, 0.8)',

  // Text Colors
  text: '#0F172A', // Slate 900
  textSecondary: '#475569', // Slate 600
  textTertiary: '#94A3B8', // Slate 400

  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Border Colors
  border: '#E4E6EB', // Modern light border
  borderLight: '#F1F5F9', // Slate 100

  // Category Colors
  technology: '#3B82F6',
  science: '#8B5CF6',
  business: '#F59E0B',
  arts: '#EC4899',
  health: '#10B981',
  language: '#06B6D4',
  math: '#6366F1',
  history: '#F97316',
  lifestyle: '#84CC16',
  other: '#64748B',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const TYPOGRAPHY = {
  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 15, // Adjusted to user request
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  // Font Weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12, // Web's rounded-xl
  lg: 16, // Web's rounded-2xl
  xl: 24, // Web's rounded-3xl
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12, // Softer shadow as requested
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  playful: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 0, // Hard shadow for 3D effect
    elevation: 4,
  },
};

export const CATEGORIES = [
  { value: 'technology', label: 'Technology', emoji: '💻', icon: 'laptop', color: COLORS.technology },
  { value: 'science', label: 'Science', emoji: '🔬', icon: 'microscope', color: COLORS.science },
  { value: 'business', label: 'Business', emoji: '📊', icon: 'chart-bar', color: COLORS.business },
  { value: 'arts', label: 'Arts & Humanities', emoji: '🎨', icon: 'palette', color: COLORS.arts },
  { value: 'health', label: 'Health & Wellness', emoji: '🧘', icon: 'meditation', color: COLORS.health },
  { value: 'language', label: 'Language Learning', emoji: '🗣️', icon: 'translate', color: COLORS.language },
  { value: 'math', label: 'Mathematics', emoji: '🔢', icon: 'math-compass', color: COLORS.math },
  { value: 'history', label: 'History', emoji: '📜', icon: 'history', color: COLORS.history },
  { value: 'lifestyle', label: 'Lifestyle', emoji: '🏡', icon: 'home-heart', color: COLORS.lifestyle },
  { value: 'other', label: 'Other', emoji: '✨', icon: 'star-four-points', color: COLORS.other },
];

export const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'Beginner', emoji: '🌱', icon: 'sprout', color: COLORS.success },
  { value: 'intermediate', label: 'Intermediate', emoji: '🌿', icon: 'leaf', color: COLORS.warning },
  { value: 'advanced', label: 'Advanced', emoji: '🌳', icon: 'tree', color: COLORS.error },
  { value: 'all-levels', label: 'All Levels', emoji: '🌎', icon: 'earth', color: COLORS.info },
];

export const COURSE_TYPES = [
  { value: 'slides', label: 'Slides', emoji: '📑', icon: 'presentation', color: COLORS.primary },
  { value: 'video', label: 'Video', emoji: '🎬', icon: 'video', color: COLORS.secondary },
  { value: 'audio', label: 'Audio', emoji: '🎧', icon: 'headphones', color: COLORS.accent },
];
