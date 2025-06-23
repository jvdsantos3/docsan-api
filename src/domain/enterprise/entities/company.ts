import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface CompanyProps {
  name: string
  tradeName: string
  cnpj: string
  email: string
  password: string
  cnae: string
  phone: string
  responsibleName: string
  responsibleCpf: string
  zipCode: string
  uf: string
  city: string
  street: string
  number: string
  neighborhood: string
  complement?: string | null
}

export class Company extends Entity<CompanyProps> {
  get name() {
    return this.props.name
  }

  get tradeName() {
    return this.props.tradeName
  }

  get cnpj() {
    return this.props.cnpj
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get cnae() {
    return this.props.cnae
  }

  get phone() {
    return this.props.phone
  }

  get responsibleName() {
    return this.props.responsibleName
  }

  get responsibleCpf() {
    return this.props.responsibleCpf
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

  static create(props: CompanyProps, id?: UniqueEntityID) {
    const student = new Company(props, id)

    return student
  }
}
