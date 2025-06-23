import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Professional,
  ProfessionalProps,
} from '@/domain/enterprise/entities/professional'

export function makeProfessional(
  override: Partial<ProfessionalProps> = {},
  id?: UniqueEntityID,
) {
  const professional = Professional.create(
    {
      name: faker.person.fullName(),
      cpf: '85741611010',
      birthDate: faker.date.birthdate(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      phone: faker.phone.number(),
      fieldOfExpertise: 'teste',
      professionalRegistry: 'teste',
      registryState: 'teste',
      cnae: '112233',
      ...override,
    },
    id,
  )

  return professional
}
