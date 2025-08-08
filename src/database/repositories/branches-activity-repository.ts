import { Injectable } from '@nestjs/common'
import { BranchActivity, Prisma } from '@prisma/client'
import { PrismaService } from '../prisma.service'
import { PaginationParams } from '../interfaces/pagination-params'
import { paginate } from '../pagination'

export interface FetchFilters {
  filter?: string
  active?: boolean
}

@Injectable()
export class BranchesActivityRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return await this.prisma.branchActivity.findUnique({
      where: {
        id,
      },
    })
  }

  async findByName(name: string) {
    return await this.prisma.branchActivity.findUnique({
      where: {
        name,
      },
    })
  }

  async fetchPagination({
    page,
    limit = 15,
    order = 'asc',
    active,
    filter,
  }: PaginationParams<Prisma.BranchActivityOrderByWithAggregationInput> & FetchFilters) {
    const where: Prisma.BranchActivityWhereInput = {}

    if (typeof active === 'boolean') {
      where.isActive = active
    }

    if (filter) {
      where.name = {
        contains: filter,
        mode: 'insensitive',
      }
    }

    const [branchesActivity, total] = await Promise.all([
      this.prisma.branchActivity.findMany({
        where,
        orderBy: {
          name: order,
        },
        take: limit,
        skip: (page - 1) * limit,
      }),
      this.prisma.branchActivity.count({ where }),
    ])

    return paginate<BranchActivity>({
      data: branchesActivity,
      total,
      page,
      limit,
    })
  }

  async create(
    data: Prisma.BranchActivityCreateInput,
    prisma: Prisma.TransactionClient = this.prisma,
  ) {
    return await prisma.branchActivity.create({
      data,
    })
  }

  async save(
    data: Partial<Prisma.BranchActivityUpdateInput> & { id: string },
    prisma: Prisma.TransactionClient = this.prisma,
  ) {
    return await prisma.branchActivity.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(branchActivity: BranchActivity) {
    await this.prisma.branchActivity.delete({
      where: {
        id: branchActivity.id,
      },
    })
  }
}
