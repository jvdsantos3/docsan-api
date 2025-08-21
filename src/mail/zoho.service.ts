import { EnvService } from '@/env/env.service'
import { Injectable, Logger } from '@nestjs/common'
import axios, { AxiosError } from 'axios'
import * as Handlebars from 'handlebars'
import * as path from 'node:path'
import * as fs from 'node:fs'
import { ZohoTimeoutError } from './errors/zoho-timeout.error'

@Injectable()
export class ZohoService {
  private clientId: string
  private clientSecret: string
  private refreshToken: string
  private fromEmail: string
  private readonly logger = new Logger(ZohoService.name)

  constructor(private env: EnvService) {
    this.clientId = this.env.get('ZOHO_CLIENT_ID')
    this.clientSecret = this.env.get('ZOHO_CLIENT_SECRET')
    this.refreshToken = this.env.get('ZOHO_REFRESH_TOKEN')
    this.fromEmail = this.env.get('ZOHO_FROM_EMAIL')
  }

  private async getAccessToken(): Promise<string | undefined> {
    try {
      const url = 'https://accounts.zoho.com/oauth/v2/token'
      const body = new URLSearchParams({
        refresh_token: this.refreshToken,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'refresh_token',
      })

      const { data } = await axios.post(url, body.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 15000,
      })

      if (!data) {
        throw new Error('Erro ao gerar access_token')
      }

      return data.access_token
    } catch (error: any) {
      if (error instanceof AxiosError && error.code === 'ECONNABORTED') {
        this.logger.error('Timeout ao obter access token do Zoho.')

        throw new ZohoTimeoutError()
      }

      this.logger.error('Erro ao obter access token do Zoho:', error)

      throw error
    }
  }

  private renderTemplate(
    templateName: string,
    context?: Record<string, unknown>,
  ): string {
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      'mail',
      'templates',
      `${templateName}.hbs`,
    )
    const source = fs.readFileSync(filePath, 'utf8')
    const template = Handlebars.compile(source)

    return template(context)
  }

  async sendEmail(
    to: string,
    subject: string,
    templateName: string,
    context: Record<string, unknown>,
  ) {
    try {
      const accessToken = await this.getAccessToken()
      const accountsUrl = `https://mail.zoho.com/api/accounts`
      const accountsRes = await axios.get(accountsUrl, {
        headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
        timeout: 15000,
      })

      const accountId = accountsRes.data.data.find(
        (acc: any) => acc.primaryEmailAddress === this.fromEmail,
      )?.accountId

      if (!accountId) {
        throw new Error('Conta Zoho não encontrada')
      }

      const htmlContent = this.renderTemplate(templateName, context)

      const sendUrl = `https://mail.zoho.com/api/accounts/${accountId}/messages`

      const body = {
        fromAddress: `"Docsan" <${this.env.get('ZOHO_FROM_EMAIL')}>`,
        toAddress: to,
        subject,
        content: htmlContent,
        mailFormat: 'html',
      }

      const sendRes = await axios.post(sendUrl, body, {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      })

      return sendRes.data
    } catch (error: any) {
      if (error instanceof AxiosError && error.code === 'ECONNABORTED') {
        this.logger.error(`Timeout ao enviar e-mail para ${to}.`)

        throw new ZohoTimeoutError()
      }

      this.logger.error(`Erro ao enviar e-mail para ${to}:`, error)

      throw error
    }
  }
}
