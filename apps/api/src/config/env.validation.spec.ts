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
})
