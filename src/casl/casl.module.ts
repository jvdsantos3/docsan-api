import { Module } from '@nestjs/common'
import { CaslAbilityFactory } from './casl-ability.factory'
import { DatabaseModule } from '@/database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CaslAbilityModule {}
