import { describe, expect, it } from 'vitest'
import { validateEnvironment } from './env.validation'

describe('validateEnvironment', () => {
  it('applies safe defaults for local development', () => {
    expect(validateEnvironment({})).toMatchObject({
      NODE_ENV: 'development',
      PORT: 3000,
      APP_URL: 'http://localhost:5173',
    })
  })

  it('rejects an invalid port before the API starts', () => {
    expect(() => validateEnvironment({ PORT: 'not-a-port' })).toThrow(
      'Invalid environment configuration: PORT',
    )
  })

  it('treats blank optional values from the example environment as absent', () => {
    expect(
      validateEnvironment({
        DATABASE_URL: '',
        GOOGLE_MAPS_API_KEY: '',
        OPENAI_API_KEY: '',
        JWT_SECRET: '',
      }),
    ).toMatchObject({
      DATABASE_URL: undefined,
      GOOGLE_MAPS_API_KEY: undefined,
      OPENAI_API_KEY: undefined,
      JWT_SECRET: undefined,
    })
  })

  it('rejects a nonempty invalid secret or database URL', () => {
    expect(() => validateEnvironment({ JWT_SECRET: 'short' })).toThrow('JWT_SECRET')
    expect(() => validateEnvironment({ DATABASE_URL: 'invalid' })).toThrow('DATABASE_URL')
  })
})
