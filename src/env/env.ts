import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  ACCOUNT_ID: z.string(),
  AWS_BUCKET_NAME: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  GOOGLE_API_KEY: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number(),
  MAIL_HOST: z.string(),
  MAIL_PORT: z.string(),
  MAIL_USER: z.string(),
  MAIL_PASSWORD: z.string(),
  MAIL_SECURE: z.coerce.boolean(),
  VOLUME_PATH: z.string(),
  APP_PORT: z.coerce.number().optional().default(3333),
  CHAT_LIMIT: z.coerce.number().optional().default(3),
  CHAT_LIMIT_EXPIRE: z.coerce
    .number()
    .optional()
    .default(60 * 60 * 24 * 7), // 7d
  CLIENT_URL: z.string().url(),
})

export type Env = z.infer<typeof envSchema>
