
/**
 * Utility for safely accessing environment variables
 */

// Default fallback values (for development only)
const FALLBACK_VALUES = {
  SUPABASE_URL: "https://fqgrnfcaxivngjqjruvy.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxZ3JuZmNheGl2bmdqcWpydXZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3MjM2MDksImV4cCI6MjA2MTI5OTYwOX0.sWT4wPzidSZw_NpV78cNhRzNLiUBqIlr8aHQJI5kDXE",
};

/**
 * Get an environment variable with a fallback value
 * @param key The environment variable key
 * @returns The environment variable value or the fallback value
 */
export function getEnv(key: keyof typeof FALLBACK_VALUES): string {
  // For Vite applications
  const envValue = import.meta.env[`VITE_${key}`];

  if (envValue) {
    return envValue as string;
  }
  
  // If not found, use fallback value
  console.warn(`Environment variable VITE_${key} not found, using fallback value.`);
  return FALLBACK_VALUES[key];
}
