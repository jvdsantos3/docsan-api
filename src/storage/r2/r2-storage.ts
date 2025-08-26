import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { EnvService } from '../../env/env.service'
import { Uploader, UploadParams } from '../upload'

@Injectable()
export class R2Storage implements Uploader {
  private client: S3Client

  constructor(private envService: EnvService) {
    const accountId = envService.get('ACCOUNT_ID')

    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: envService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: envService.get('AWS_SECRET_ACCESS_KEY'),
      },
    })
  }

  async upload({
    fileName,
    fileType,
    body,
  }: UploadParams): Promise<{ url: string }> {
    const uniqueFileName = `${fileName}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.envService.get('AWS_BUCKET_NAME'),
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      }),
    )

    return {
      url: uniqueFileName,
    }
  }

  async get(url: string): Promise<{ body: Buffer; contentType: string }> {
    const command = new GetObjectCommand({
      Bucket: this.envService.get('AWS_BUCKET_NAME'),
      Key: url,
    })

    const { Body, ContentType } = await this.client.send(command)

    if (!Body) {
      throw new Error('File not found or empty')
    }

    const body = Buffer.from(await Body.transformToByteArray())

    return {
      body,
      contentType: ContentType || 'application/octet-stream',
    }
  }

  async delete(url: string): Promise<void> {
    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.envService.get('AWS_BUCKET_NAME'),
          Key: url,
        }),
      )
    } catch (error) {
      console.warn(`Arquivo não encontrado para deleção no R2: ${url}`)
    }
  }
}
