import * as XLSX from 'xlsx'
import { PrismaClient, type DocumentType } from '@prisma/client'
import * as path from 'path'

const prisma = new PrismaClient()

export async function seedDocumentTypes() {
  try {
    const excelFilePath = path.join(__dirname, 'seed_document_type.xlsx')

    const workbook = XLSX.readFile(excelFilePath)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    const data = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
    }) as string[][]

    const rows = data.slice(1).filter((row) => row.length > 0 && row[1])

    const documentTypesMap = new Map<
      string,
      { name: string; validityPeriod: number }
    >()

    for (const row of rows) {
      const name = row[1]?.toString().trim()
      const validityPeriodRaw = row[4]?.toString().trim()

      if (!name) {
        console.warn(
          `⚠️  Linha ignorada por nome vazio: ${JSON.stringify(row.slice(0, 6))}`,
        )
        continue
      }

      let validityPeriod = 365
      if (validityPeriodRaw && validityPeriodRaw !== '') {
        const parsedPeriod = parseInt(validityPeriodRaw, 10)
        if (!isNaN(parsedPeriod) && parsedPeriod > 0) {
          validityPeriod = parsedPeriod
        } else {
          console.warn(
            `⚠️  Período de validade inválido para '${name}', usando padrão (365): ${validityPeriodRaw}`,
          )
        }
      }

      if (!documentTypesMap.has(name)) {
        documentTypesMap.set(name, {
          name,
          validityPeriod,
        })
      } else {
        console.warn(`⚠️  DocumentType duplicado ignorado: ${name}`)
      }
    }

    const documentTypesCreated: DocumentType[] = []

    for (const documentTypeData of documentTypesMap.values()) {
      const documentType = await prisma.documentType.upsert({
        where: {
          name_companyId: {
            name: documentTypeData.name,
            companyId: '',
          },
        },
        update: {
          validityPeriod: documentTypeData.validityPeriod,
        },
        create: {
          name: documentTypeData.name,
          validityPeriod: documentTypeData.validityPeriod,
          isActive: true,
          prompt:
            'Regras para coleta da informação: Data da situação cadastral: [Data em formato brasileiro DD/MM/YYYY].',
          metadata: [
            {
              name: 'Data de vencimento',
              type: 'date',
              required: true,
            },
          ],
        },
      })
      documentTypesCreated.push(documentType)
    }
  } catch (error) {
    console.error('❌ Erro durante o seed:', error)
    throw error
  }
}

if (require.main === module) {
  seedDocumentTypes()
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
