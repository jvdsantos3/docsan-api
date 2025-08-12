import { Action } from '../actions.enum'
import { AppAbility } from '../casl-ability.factory'
import { IPolicyHandler } from '../types'

export class ReadProfessionalPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Read, 'Professional')
  }
}
