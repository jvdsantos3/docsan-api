import { AppAbility } from '@/casl/casl-ability.factory'
import { Action } from '@/casl/actions.enum'
import { IPolicyHandler } from '../types'

export class ReadServicePolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Read, 'Service')
  }
}
