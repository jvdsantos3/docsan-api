import {
  PrismaClient,
  type BranchActivity,
  type RegistryType,
} from '@prisma/client'
import * as XLSX from 'xlsx'
import * as path from 'path'

const prisma = new PrismaClient()

export async function seedBranchActivityAndRegistryType() {
  try {
    const excelFilePath = path.join(__dirname, 'seed_branch_registry.xlsx')

    const workbook = XLSX.readFile(excelFilePath)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    const data = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
    }) as string[][]

    const rows = data.slice(1).filter((row) => row.length > 0 && row[0])

    // Mapear dados únicos para evitar duplicatas
    const branchActivitiesMap = new Map<string, string>()
    const registryTypesMap = new Map<
      string,
      { name: string; fullName: string; branchActivityName: string }
    >()

    for (const row of rows) {
      const branchActivityName = row[0]?.toString().trim()
      const registryTypeName = row[3]?.toString().trim()
      const registryTypeFullName = row[4]?.toString().trim()

      if (!branchActivityName || !registryTypeName || !registryTypeFullName) {
        console.warn(
          `⚠️  Linha ignorada por dados incompletos: ${JSON.stringify(row.slice(0, 5))}`,
        )
        continue
      }

      if (!branchActivitiesMap.has(branchActivityName)) {
        branchActivitiesMap.set(branchActivityName, branchActivityName)
      }

      const registryKey = `${registryTypeName}_${branchActivityName}`
      if (!registryTypesMap.has(registryKey)) {
        registryTypesMap.set(registryKey, {
          name: registryTypeName,
          fullName: registryTypeFullName,
          branchActivityName,
        })
      }
    }

    const branchActivitiesCreated: BranchActivity[] = []

    for (const branchActivityName of branchActivitiesMap.keys()) {
      const branchActivity = await prisma.branchActivity.upsert({
        where: { name: branchActivityName },
        update: {},
        create: {
          name: branchActivityName,
          isActive: true,
        },
      })

      branchActivitiesCreated.push(branchActivity)
    }

    const registryTypesCreated: RegistryType[] = []

    for (const registryTypeData of registryTypesMap.values()) {
      const branchActivity = await prisma.branchActivity.findUnique({
        where: { name: registryTypeData.branchActivityName },
      })

      if (!branchActivity) {
        console.error(
          `❌ BranchActivity não encontrada: ${registryTypeData.branchActivityName}`,
        )
        continue
      }

      const registryType = await prisma.registryType.upsert({
        where: {
          name_branchActivityId: {
            name: registryTypeData.name,
            branchActivityId: branchActivity.id,
          },
        },
        update: {
          fullName: registryTypeData.fullName,
        },
        create: {
          name: registryTypeData.name,
          fullName: registryTypeData.fullName,
          branchActivityId: branchActivity.id,
          isActive: true,
        },
      })

      registryTypesCreated.push(registryType)
    }
  } catch (error) {
    console.error('❌ Erro durante o seed:', error)
    throw error
  }
}

if (require.main === module) {
  seedBranchActivityAndRegistryType()
    .then(() => {
      console.log('✅ Seed executado com sucesso!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Erro no seed:', error)
      process.exit(1)
    })
    .finally(() => {
      prisma.$disconnect()
    })
}
