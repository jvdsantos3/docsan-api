import { Action } from '../actions.enum'
import { AppAbility } from '../casl-ability.factory'
import { IPolicyHandler } from '../types'

export class ReadDocumentTypePolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Read, 'DocumentType')
  }
}
