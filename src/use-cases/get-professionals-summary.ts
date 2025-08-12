import { ProfessionalsRepository } from '@/database/repositories/professionals-repository'
import { Injectable } from '@nestjs/common'

interface GetProfessionalsSummaryUseCaseResponse {
  summary: {
    total: number
    totalApproved: number
    totalPending: number
    totalRejected: number
    totalBanned: number
  }
}

@Injectable()
export class GetProfessionalsSummaryUseCase {
  constructor(private professionalsRepository: ProfessionalsRepository) {}

  async execute(): Promise<GetProfessionalsSummaryUseCaseResponse> {
    const summary = {
      total: await this.professionalsRepository.getProfessionalsCount(),
      totalApproved: await this.professionalsRepository.getApprovedCount(),
      totalPending: await this.professionalsRepository.getPendingCount(),
      totalRejected: await this.professionalsRepository.getRejectedCount(),
      totalBanned: await this.professionalsRepository.getBannedCount(),
    }

    return {
      summary,
    }
  }
}
