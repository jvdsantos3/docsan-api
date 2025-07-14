import { BadRequestException, Injectable } from '@nestjs/common'

interface SaveTmpFileUseCaseRequest {
  file: Express.Multer.File
}

interface SaveTmpFileUseCaseResponse {
  filePath: string
}

@Injectable()
export class SaveTmpFileUseCase {
  async execute({
    file,
  }: SaveTmpFileUseCaseRequest): Promise<SaveTmpFileUseCaseResponse> {
    if (!file) {
      throw new BadRequestException('No file uploaded.')
    }

    return { filePath: file.path }
  }
}
