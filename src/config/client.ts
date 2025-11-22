import 'dotenv/config'
import * as PrismaPkg from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// Support different Prisma client module shapes by resolving PrismaClient at runtime
const _PrismaPkgAny = PrismaPkg as any
const PrismaClient = _PrismaPkgAny.PrismaClient || _PrismaPkgAny.default?.PrismaClient

if (!PrismaClient) {
  throw new Error('PrismaClient not found in @prisma/client package')
}

const connectionString = process.env.DATABASE_URL || ''

const pool = new Pool({
  connectionString,
})

const adapter = new PrismaPg(pool)

export const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'production' ? [] : ['query', 'info', 'warn', 'error'],
})
