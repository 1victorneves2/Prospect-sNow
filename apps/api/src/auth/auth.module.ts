import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from './auth.guard'
import { IDENTITY_VERIFIER } from './auth.types'
import { RolesGuard } from './roles.guard'

// Until a provider is chosen and configured, every private request is denied.
const disabledVerifier = { verify: async () => null }

@Module({
  providers: [
    { provide: IDENTITY_VERIFIER, useValue: disabledVerifier },
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AuthModule {}
