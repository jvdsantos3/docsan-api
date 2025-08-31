import { ConflictException } from '@nestjs/common'

export class BranchActivityHasRelationshipsError extends ConflictException {
  constructor() {
    super(
      'Não é possível editar ou excluir esta atividade pois existem profissionais vinculados a ela.',
    )
  }
}
