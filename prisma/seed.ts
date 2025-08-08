import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash =
    '$2y$10$fC.1N.nq.uVN7oXR.62EeOhjqyvaN8vArCstrJkvKjlA30i6YefJe'

  const user = await prisma.user.upsert({
    where: { email: 'admin@system.com' },
    update: {},
    create: {
      email: 'admin@docsan.com',
      password: passwordHash,
      role: 'ADMIN',
    },
  })

  await prisma.admin.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      name: 'Administrador geral',
      isMain: true,
      userId: user.id,
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
