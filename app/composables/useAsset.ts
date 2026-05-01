/**
 * Resolves public asset paths with baseURL prefix.
 * Use instead of hardcoded '/images/...' paths.
 */
export function useAsset(path: string): string {
  const base = useRuntimeConfig().app.baseURL || '/'
  // Remove leading slash from path if base already ends with one
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${base}${cleanPath}`
}
