import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ProfessionalProps {
  name: string
  cpf: string
  birthDate: Date
  email: string
  password: string
  phone: string
  fieldExpertise: string
  professionalRegistry: string
  registryUf: string
  cnae: string
  zipCode: string
  uf: string
  city: string
  street: string
  number: string
  neighborhood: string
  complement?: string | null
}

export class Professional extends Entity<ProfessionalProps> {
  get name() {
    return this.props.name
  }

  get cpf() {
    return this.props.cpf
  }

  get birthDate() {
    return this.props.birthDate
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get phone() {
    return this.props.phone
  }

  get fieldExpertise() {
    return this.props.fieldExpertise
  }

  get professionalRegistry() {
    return this.props.professionalRegistry
  }

  get registryUf() {
    return this.props.registryUf
  }

  get cnae() {
    return this.props.cnae
  }

  get zipCode() {
    return this.props.zipCode
  }

  get uf() {
    return this.props.uf
  }

  get city() {
    return this.props.city
  }

  get street() {
    return this.props.street
  }

  get number() {
    return this.props.number
  }

  get neighborhood() {
    return this.props.neighborhood
  }

  get complement() {
    return this.props.complement
  }

  static create(props: ProfessionalProps, id?: UniqueEntityID) {
    const student = new Professional(props, id)

    return student
  }
}
