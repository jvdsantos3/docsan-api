import { ConflictException } from '@nestjs/common'

export class CnaeHasRelationshipsError extends ConflictException {
  constructor() {
    super(
      'Não é possível editar ou excluir este CNAE pois existem profissionais ou empresas vinculados a ele.',
    )
  }
}
