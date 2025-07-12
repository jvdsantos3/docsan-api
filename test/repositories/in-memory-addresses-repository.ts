import { AddressesRepository } from '@/database/repositories/addresses-repository'
import { Address, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export class InMemoryAddressRepository implements AddressesRepository {
  public items: Address[] = []

  async findById(id: string) {
    const address = this.items.find((item) => item.id === id)

    if (!address) {
      return null
    }

    return address
  }

  async create(data: Prisma.AddressCreateInput) {
    const address = {
      id: randomUUID(),
      zipCode: data.zipCode,
      uf: data.uf,
      city: data.city,
      street: data.street,
      number: data.number,
      neighborhood: data.neighborhood,
      complement: data.complement ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.items.push(address)

    return address
  }
}
