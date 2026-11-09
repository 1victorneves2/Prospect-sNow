import { z } from 'zod'

const optionalSecret = (schema: z.ZodType<string>) =>
  z.preprocess((value) => (value === '' ? undefined : value), schema.optional())

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  APP_URL: z.url().default('http://localhost:5173'),
  API_URL: z.url().default('http://localhost:3000'),
  DATABASE_URL: optionalSecret(z.string().url()),
  GOOGLE_MAPS_API_KEY: optionalSecret(z.string().min(1)),
  OPENAI_API_KEY: optionalSecret(z.string().min(1)),
  JWT_SECRET: optionalSecret(z.string().min(32)),
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
