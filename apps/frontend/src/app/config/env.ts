// Environment variable validation and configuration
export const requiredEnvVars = ["NEXTAUTH_SECRET", "NEXTAUTH_URL"] as const;

export const optionalEnvVars = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "MONGODB_URI",
  "SPORTS_API_KEY",
  "ODDS_API_KEY",
  "OPENAI_API_KEY",
  "CLAUDE_API_KEY",
  "PI_API_SANDBOX_KEY",
  "PI_API_PRODUCTION_KEY",
  "JWT_SECRET",
  "ENCRYPTION_KEY",
  "PICOIN_ENCRYPTION_KEY",
] as const;

export function validateEnvironment() {
  const missing: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    console.warn("⚠️ Missing required environment variables:", missing);
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        `Missing required environment variables: ${missing.join(", ")}`,
      );
    }
  }

  return {
    isValid: missing.length === 0,
    missing,
    config: {
      nodeEnv: process.env.NODE_ENV || "development",
      nextAuthUrl: process.env.NEXTAUTH_URL,
      backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
      hasDatabase: !!(process.env.MONGODB_URI || process.env.DATABASE_URL),
      hasGoogleAuth: !!(
        process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ),
      hasSportsApi: !!process.env.SPORTS_API_KEY,
      hasAiIntegration: !!(
        process.env.OPENAI_API_KEY || process.env.CLAUDE_API_KEY
      ),
    },
  };
}
