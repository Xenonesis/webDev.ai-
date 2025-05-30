import { atom } from 'nanostores';
import { logStore } from './logs';

export type Theme = 'dark' | 'light';
export type DynamicTheme = 'cosmic' | 'aurora' | 'nebula' | 'galaxy' | 'stellar';

export const kTheme = 'webdev_ai_theme';
export const kDynamicTheme = 'webdev_ai_dynamic_theme';
export const kDynamicThemeEnabled = 'webdev_ai_dynamic_theme_enabled';

export const DEFAULT_THEME = 'light';
export const DEFAULT_DYNAMIC_THEME = 'cosmic';

function initStore() {
  if (!import.meta.env.SSR) {
    const persistedTheme = localStorage.getItem(kTheme) as Theme | undefined;
    const themeAttribute = document.querySelector('html')?.getAttribute('data-theme');

    return persistedTheme ?? (themeAttribute as Theme) ?? DEFAULT_THEME;
  }

  return DEFAULT_THEME;
}

function initDynamicThemeStore() {
  if (!import.meta.env.SSR) {
    const persistedDynamicTheme = localStorage.getItem(kDynamicTheme) as DynamicTheme | undefined;
    return persistedDynamicTheme ?? DEFAULT_DYNAMIC_THEME;
  }
  return DEFAULT_DYNAMIC_THEME;
}

function initDynamicThemeEnabledStore() {
  if (!import.meta.env.SSR) {
    const persistedEnabled = localStorage.getItem(kDynamicThemeEnabled);
    return persistedEnabled === 'true';
  }
  return false;
}

export const themeStore = atom<Theme>(initStore());
export const dynamicThemeStore = atom<DynamicTheme>(initDynamicThemeStore());
export const dynamicThemeEnabledStore = atom<boolean>(initDynamicThemeEnabledStore());

export function themeIsDark() {
  return themeStore.get() === 'dark';
}

export function toggleTheme() {
  const currentTheme = themeStore.get();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  // Update the theme store
  themeStore.set(newTheme);

  // Update localStorage
  localStorage.setItem(kTheme, newTheme);

  // Update the HTML attribute
  document.querySelector('html')?.setAttribute('data-theme', newTheme);

  // Update user profile if it exists
  try {
    const userProfile = localStorage.getItem('webdev_ai_user_profile');

    if (userProfile) {
      const profile = JSON.parse(userProfile);
      profile.theme = newTheme;
      localStorage.setItem('webdev_ai_user_profile', JSON.stringify(profile));
    }
  } catch (error) {
    console.error('Error updating user profile theme:', error);
  }

  logStore.logSystem(`Theme changed to ${newTheme} mode`);
}

// Dynamic theme definitions
export const DYNAMIC_THEMES: Record<DynamicTheme, {
  name: string;
  description: string;
  gradientDirection: string;
  primaryGradient: string;
  accentColor: string;
  animationSpeed: string;
  borderRadius: string;
  shadowIntensity: string;
  fontWeight: string;
}> = {
  cosmic: {
    name: 'Cosmic',
    description: 'Deep space vibes with purple nebulae',
    gradientDirection: '135deg',
    primaryGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    accentColor: '#8b5cf6',
    animationSpeed: '0.3s',
    borderRadius: '12px',
    shadowIntensity: '0 8px 32px rgba(139, 92, 246, 0.15)',
    fontWeight: '500',
  },
  aurora: {
    name: 'Aurora',
    description: 'Northern lights with flowing gradients',
    gradientDirection: '45deg',
    primaryGradient: 'linear-gradient(45deg, #a855f7 0%, #3b82f6 50%, #06b6d4 100%)',
    accentColor: '#a855f7',
    animationSpeed: '0.4s',
    borderRadius: '16px',
    shadowIntensity: '0 12px 40px rgba(168, 85, 247, 0.2)',
    fontWeight: '600',
  },
  nebula: {
    name: 'Nebula',
    description: 'Swirling cosmic dust and starlight',
    gradientDirection: '225deg',
    primaryGradient: 'linear-gradient(225deg, #ec4899 0%, #8b5cf6 50%, #6366f1 100%)',
    accentColor: '#ec4899',
    animationSpeed: '0.5s',
    borderRadius: '20px',
    shadowIntensity: '0 16px 48px rgba(236, 72, 153, 0.25)',
    fontWeight: '700',
  },
  galaxy: {
    name: 'Galaxy',
    description: 'Spiral arms of light and energy',
    gradientDirection: '315deg',
    primaryGradient: 'linear-gradient(315deg, #6366f1 0%, #8b5cf6 25%, #d946ef 75%, #f59e0b 100%)',
    accentColor: '#d946ef',
    animationSpeed: '0.2s',
    borderRadius: '8px',
    shadowIntensity: '0 6px 24px rgba(217, 70, 239, 0.18)',
    fontWeight: '400',
  },
  stellar: {
    name: 'Stellar',
    description: 'Bright stars and cosmic radiation',
    gradientDirection: '180deg',
    primaryGradient: 'linear-gradient(180deg, #f59e0b 0%, #d946ef 50%, #8b5cf6 100%)',
    accentColor: '#f59e0b',
    animationSpeed: '0.6s',
    borderRadius: '24px',
    shadowIntensity: '0 20px 56px rgba(245, 158, 11, 0.3)',
    fontWeight: '800',
  },
};

export function setDynamicTheme(theme: DynamicTheme) {
  dynamicThemeStore.set(theme);
  localStorage.setItem(kDynamicTheme, theme);
  applyDynamicTheme(theme);
  logStore.logSystem(`Dynamic theme changed to ${theme}`);
}

export function toggleDynamicTheme() {
  const enabled = !dynamicThemeEnabledStore.get();
  dynamicThemeEnabledStore.set(enabled);
  localStorage.setItem(kDynamicThemeEnabled, enabled.toString());

  if (enabled) {
    applyDynamicTheme(dynamicThemeStore.get());
  } else {
    removeDynamicTheme();
  }

  logStore.logSystem(`Dynamic theme ${enabled ? 'enabled' : 'disabled'}`);
}

export function applyDynamicTheme(theme: DynamicTheme) {
  if (import.meta.env.SSR) return;

  const themeConfig = DYNAMIC_THEMES[theme];
  const root = document.documentElement;

  // Apply dynamic theme CSS variables
  root.style.setProperty('--dynamic-gradient-direction', themeConfig.gradientDirection);
  root.style.setProperty('--dynamic-primary-gradient', themeConfig.primaryGradient);
  root.style.setProperty('--dynamic-accent-color', themeConfig.accentColor);
  root.style.setProperty('--dynamic-animation-speed', themeConfig.animationSpeed);
  root.style.setProperty('--dynamic-border-radius', themeConfig.borderRadius);
  root.style.setProperty('--dynamic-shadow-intensity', themeConfig.shadowIntensity);
  root.style.setProperty('--dynamic-font-weight', themeConfig.fontWeight);

  // Apply branding-specific variables for enhanced visibility
  root.style.setProperty('--dynamic-branding-gradient', themeConfig.primaryGradient);
  root.style.setProperty('--dynamic-branding-accent', themeConfig.accentColor);
  root.style.setProperty('--dynamic-branding-shadow', `0 0 20px ${themeConfig.accentColor}40`);
  root.style.setProperty('--dynamic-branding-outline', `1px solid ${themeConfig.accentColor}30`);
  root.style.setProperty('--dynamic-branding-backdrop', 'rgba(0, 0, 0, 0.1)');

  // Set the theme attribute
  root.setAttribute('data-dynamic-theme', theme);
}

export function removeDynamicTheme() {
  if (import.meta.env.SSR) return;

  const root = document.documentElement;
  root.removeAttribute('data-dynamic-theme');

  // Remove dynamic theme CSS variables
  root.style.removeProperty('--dynamic-gradient-direction');
  root.style.removeProperty('--dynamic-primary-gradient');
  root.style.removeProperty('--dynamic-accent-color');
  root.style.removeProperty('--dynamic-animation-speed');
  root.style.removeProperty('--dynamic-border-radius');
  root.style.removeProperty('--dynamic-shadow-intensity');
  root.style.removeProperty('--dynamic-font-weight');

  // Remove branding-specific variables
  root.style.removeProperty('--dynamic-branding-gradient');
  root.style.removeProperty('--dynamic-branding-accent');
  root.style.removeProperty('--dynamic-branding-shadow');
  root.style.removeProperty('--dynamic-branding-outline');
  root.style.removeProperty('--dynamic-branding-backdrop');
}
