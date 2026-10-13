import { z } from 'zod'

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  APP_URL: z.url().default('http://localhost:5173'),
  API_URL: z.url().default('http://localhost:3000'),
  DATABASE_URL: z.string().url().optional(),
  GOOGLE_MAPS_API_KEY: z.string().min(1).optional(),
  OPENAI_API_KEY: z.string().min(1).optional(),
  JWT_SECRET: z.string().min(32).optional(),
})

export type Environment = z.infer<typeof environmentSchema>

export function validateEnvironment(config: Record<string, unknown>): Environment {
  const result = environmentSchema.safeParse(config)

  if (!result.success) {
    const invalidVariables = result.error.issues.map((issue) => issue.path.join('.')).join(', ')
    throw new Error(`Invalid environment configuration: ${invalidVariables}`)
  }

  return result.data
}
