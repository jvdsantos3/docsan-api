import { Uploader, UploadParams } from '@/storage/upload'
import { randomUUID } from 'crypto'

interface Upload {
  fileName: string
  url: string
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = []

  async upload({ fileName }: UploadParams): Promise<{ url: string }> {
    const url = randomUUID()

    this.uploads.push({
      fileName,
      url,
    })

    return { url }
  }

  async get(url: string): Promise<{ body: Buffer; contentType: string }> {
    return {
      body: Buffer.from('fake file content'),
      contentType: 'application/octet-stream',
    }
  }

  async delete(url: string): Promise<void> {
    const index = this.uploads.findIndex(upload => upload.url === url)
    if (index !== -1) {
      this.uploads.splice(index, 1)
    }
  }
}
