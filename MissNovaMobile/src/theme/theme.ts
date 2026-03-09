export const COLORS = {
  // Primary Colors
  primary: '#6366F1',
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  
  // Secondary Colors
  secondary: '#EC4899',
  secondaryLight: '#F472B6',
  secondaryDark: '#DB2777',
  
  // Accent Colors
  accent: '#8B5CF6',
  accentLight: '#A78BFA',
  accentDark: '#7C3AED',
  
  // Neutral Colors
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceVariant: '#F3F4F6',
  
  // Text Colors
  text: '#1F2937',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  
  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Border Colors
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  
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
  other: '#6B7280',
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
    md: 16,
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
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const CATEGORIES = [
  { value: 'technology', label: 'Technology', emoji: '💻', color: COLORS.technology },
  { value: 'science', label: 'Science', emoji: '🔬', color: COLORS.science },
  { value: 'business', label: 'Business', emoji: '📊', color: COLORS.business },
  { value: 'arts', label: 'Arts & Humanities', emoji: '🎨', color: COLORS.arts },
  { value: 'health', label: 'Health & Wellness', emoji: '🧘', color: COLORS.health },
  { value: 'language', label: 'Language Learning', emoji: '🗣️', color: COLORS.language },
  { value: 'math', label: 'Mathematics', emoji: '🔢', color: COLORS.math },
  { value: 'history', label: 'History', emoji: '📜', color: COLORS.history },
  { value: 'lifestyle', label: 'Lifestyle', emoji: '🏡', color: COLORS.lifestyle },
  { value: 'other', label: 'Other', emoji: '✨', color: COLORS.other },
];

export const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'Beginner', emoji: '🌱', color: COLORS.success },
  { value: 'intermediate', label: 'Intermediate', emoji: '🌿', color: COLORS.warning },
  { value: 'advanced', label: 'Advanced', emoji: '🌳', color: COLORS.error },
  { value: 'all-levels', label: 'All Levels', emoji: '🌎', color: COLORS.info },
];

export const COURSE_TYPES = [
  { value: 'slides', label: 'Slides', emoji: '📑', color: COLORS.primary },
  { value: 'video', label: 'Video', emoji: '🎬', color: COLORS.secondary },
  { value: 'audio', label: 'Audio', emoji: '🎧', color: COLORS.accent },
];
