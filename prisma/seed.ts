import { PrismaClient } from '@prisma/client'
import { seedBranchActivityAndRegistryType } from './seeds/seed-branch-registry'

const prisma = new PrismaClient()

async function main() {
  const adminPasswordHash =
    '$2y$10$fC.1N.nq.uVN7oXR.62EeOhjqyvaN8vArCstrJkvKjlA30i6YefJe'
  const dimasPasswordHash =
    '$2a$08$DElZGya0Tjzrw1kt85yOz.quqdOuVwXqaTVA.Of01uJwsbKoLU3qC'
  const moiseisPasswordHash =
    '$2a$08$BpaGDZZn4fFSp/0iLGkhsu3Oi26mT17bkTHRikWPvXUHvU73cZa66'

  const admin = await prisma.user.upsert({
    where: { email: 'admin@docsan.com' },
    update: {},
    create: {
      email: 'admin@docsan.com',
      password: adminPasswordHash,
      role: 'ADMIN',
    },
  })

  await prisma.admin.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      name: 'Administrador geral',
      isMain: true,
      userId: admin.id,
    },
  })

  const dimas = await prisma.user.upsert({
    where: { email: 'dimas@docsan.com' },
    update: {},
    create: {
      email: 'dimas@docsan.com',
      password: dimasPasswordHash,
      role: 'ADMIN',
    },
  })

  await prisma.admin.upsert({
    where: { userId: dimas.id },
    update: {},
    create: {
      name: 'Dimas Victor',
      isMain: true,
      userId: dimas.id,
    },
  })

  const moiseis = await prisma.user.upsert({
    where: { email: 'moiseis@docsan.com' },
    update: {},
    create: {
      email: 'moiseis@docsan.com',
      password: moiseisPasswordHash,
      role: 'ADMIN',
    },
  })

  await prisma.admin.upsert({
    where: { userId: moiseis.id },
    update: {},
    create: {
      name: 'Moiséis Almeida',
      isMain: true,
      userId: moiseis.id,
    },
  })

  await seedBranchActivityAndRegistryType()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
