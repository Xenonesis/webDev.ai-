import { createHighlighter, type BundledLanguage, type BundledTheme, type HighlighterGeneric } from 'shiki';
import { createScopedLogger } from './logger';

const logger = createScopedLogger('SyntaxHighlighting');

// Cache for highlighter instances
const highlighterCache = new Map<string, HighlighterGeneric<BundledLanguage, BundledTheme>>();

// Common languages to preload for better performance
const COMMON_LANGUAGES: BundledLanguage[] = [
  'javascript',
  'typescript',
  'jsx',
  'tsx',
  'html',
  'css',
  'json',
  'markdown',
  'bash',
  'shell',
  'python',
  'java',
  'cpp',
  'rust',
  'go',
  'php',
  'ruby',
  'sql',
  'yaml',
  'xml',
];

// Common themes
const COMMON_THEMES: BundledTheme[] = ['github-dark', 'github-light', 'dark-plus', 'light-plus'];

/**
 * Get a cached highlighter instance for specific language and themes
 */
export async function getHighlighterForLanguage(
  language: BundledLanguage,
  themes: BundledTheme[] = ['github-dark', 'github-light'],
): Promise<HighlighterGeneric<BundledLanguage, BundledTheme>> {
  const cacheKey = `${language}-${themes.join(',')}`;

  if (highlighterCache.has(cacheKey)) {
    return highlighterCache.get(cacheKey)!;
  }

  try {
    const highlighter = await createHighlighter({
      langs: [language],
      themes,
    });

    highlighterCache.set(cacheKey, highlighter);
    logger.debug(`Created highlighter for language: ${language}`);

    return highlighter;
  } catch (error) {
    logger.error(`Failed to create highlighter for language ${language}:`, error);

    // Fallback to a basic highlighter with plaintext
    const fallbackHighlighter = await createHighlighter({
      langs: ['plaintext'],
      themes,
    });

    highlighterCache.set(cacheKey, fallbackHighlighter);

    return fallbackHighlighter;
  }
}

/**
 * Get an optimized highlighter with multiple languages and themes
 */
export async function getOptimizedHighlighter(
  themes: BundledTheme[] = COMMON_THEMES,
): Promise<HighlighterGeneric<BundledLanguage, BundledTheme>> {
  const cacheKey = `optimized-${themes.join(',')}`;

  if (highlighterCache.has(cacheKey)) {
    return highlighterCache.get(cacheKey)!;
  }

  try {
    const highlighter = await createHighlighter({
      langs: COMMON_LANGUAGES,
      themes,
    });

    highlighterCache.set(cacheKey, highlighter);
    logger.debug('Created optimized highlighter with common languages');

    return highlighter;
  } catch (error) {
    logger.error('Failed to create optimized highlighter:', error);

    // Fallback to basic languages
    const fallbackHighlighter = await createHighlighter({
      langs: ['javascript', 'typescript', 'html', 'css', 'json', 'markdown', 'plaintext'],
      themes,
    });

    highlighterCache.set(cacheKey, fallbackHighlighter);

    return fallbackHighlighter;
  }
}

/**
 * Detect language from filename
 */
export function detectLanguageFromFilename(filename: string): BundledLanguage {
  const extension = filename.split('.').pop()?.toLowerCase();

  const languageMap: Record<string, BundledLanguage> = {
    js: 'javascript',
    mjs: 'javascript',
    cjs: 'javascript',
    ts: 'typescript',
    tsx: 'tsx',
    jsx: 'jsx',
    html: 'html',
    htm: 'html',
    css: 'css',
    scss: 'scss',
    sass: 'sass',
    less: 'less',
    json: 'json',
    md: 'markdown',
    markdown: 'markdown',
    py: 'python',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    h: 'c',
    hpp: 'cpp',
    rs: 'rust',
    go: 'go',
    php: 'php',
    rb: 'ruby',
    sql: 'sql',
    yml: 'yaml',
    yaml: 'yaml',
    xml: 'xml',
    sh: 'bash',
    bash: 'bash',
    zsh: 'bash',
    fish: 'fish',
    ps1: 'powershell',
    vue: 'vue',
    svelte: 'svelte',
    astro: 'astro',
  };

  return languageMap[extension || ''] || 'plaintext';
}

/**
 * Preload common languages for better performance
 */
export async function preloadCommonLanguages(): Promise<void> {
  try {
    logger.debug('Preloading common syntax highlighting languages...');

    // Preload the optimized highlighter with common languages
    await getOptimizedHighlighter();

    // Preload individual highlighters for the most common languages
    const priorityLanguages: BundledLanguage[] = [
      'javascript',
      'typescript',
      'jsx',
      'tsx',
      'html',
      'css',
      'json',
      'markdown',
    ];

    await Promise.all(
      priorityLanguages.map((lang) =>
        getHighlighterForLanguage(lang).catch((error) => logger.warn(`Failed to preload ${lang}:`, error)),
      ),
    );

    logger.debug('Successfully preloaded common syntax highlighting languages');
  } catch (error) {
    logger.error('Failed to preload syntax highlighting languages:', error);
  }
}

/**
 * Clear the highlighter cache (useful for memory management)
 */
export function clearHighlighterCache(): void {
  highlighterCache.clear();
  logger.debug('Cleared syntax highlighting cache');
}

/**
 * Get cache statistics
 */
export function getHighlighterCacheStats() {
  return {
    size: highlighterCache.size,
    keys: Array.from(highlighterCache.keys()),
  };
}
