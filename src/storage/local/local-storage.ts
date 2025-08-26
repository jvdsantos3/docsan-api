import { Injectable } from '@nestjs/common'
import { promises as fs } from 'fs'
import { dirname, join } from 'path'
import { Uploader, UploadParams } from '../upload'
import { EnvService } from '@/env/env.service'

@Injectable()
export class LocalStorage implements Uploader {
  private basePath: string

  constructor(private env: EnvService) {
    this.basePath = this.env.get('VOLUME_PATH')
  }

  async upload({ fileName, body }: UploadParams): Promise<{ url: string }> {
    const filePath = join(this.basePath, fileName)

    await fs.mkdir(dirname(filePath), { recursive: true })

    await fs.writeFile(filePath, body)

    return { url: `/uploads/${fileName}` }
  }

  async get(url: string): Promise<{ body: Buffer; contentType: string }> {
    const filePath = join(this.basePath, url.replace('/uploads/', ''))

    const body = await fs.readFile(filePath)

    const ext = filePath.split('.').pop()?.toLowerCase() || ''
    const contentType = this.getContentType(ext)

    return { body, contentType }
  }

  async delete(url: string): Promise<void> {
    const filePath = join(this.basePath, url.replace('/uploads/', ''))

    try {
      await fs.unlink(filePath)
    } catch (error) {
      console.warn(`Arquivo não encontrado para deleção: ${filePath}`)
    }
  }

  private getContentType(ext: string): string {
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg'
      case 'png':
        return 'image/png'
      case 'gif':
        return 'image/gif'
      case 'pdf':
        return 'application/pdf'
      case 'txt':
        return 'text/plain'
      default:
        return 'application/octet-stream'
    }
  }
}
