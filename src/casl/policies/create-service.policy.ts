import { Action } from '../actions.enum'
import { AppAbility } from '../casl-ability.factory'
import { IPolicyHandler } from '../types'

export class CreateServicePolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Create, 'Service')
  }
}
