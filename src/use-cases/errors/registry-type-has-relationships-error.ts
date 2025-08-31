import { ConflictException } from '@nestjs/common'

export class RegistryTypeHasRelationshipsError extends ConflictException {
  constructor() {
    super(
      'Não é possível editar ou excluir este tipo de registro pois existem profissionais vinculados a ele.',
    )
  }
}
