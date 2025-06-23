import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Company, CompanyProps } from '@/domain/enterprise/entities/company'

export function makeCompany(
  override: Partial<CompanyProps> = {},
  id?: UniqueEntityID,
) {
  const company = Company.create(
    {
      name: faker.company.name(),
      tradeName: faker.person.fullName(),
      cnpj: '77.488.944/0001-84',
      email: faker.internet.email(),
      password: faker.internet.password(),
      cnae: '112233',
      phone: faker.phone.number(),
      responsibleName: faker.person.fullName(),
      responsibleCpf: '85741611010',
      zipCode: faker.location.zipCode(),
      uf: faker.location.state(),
      city: faker.location.city(),
      street: faker.location.street(),
      number: faker.location.buildingNumber(),
      neighborhood: 'Teste',
      ...override,
    },
    id,
  )

  return company
}
