import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Setting up Sauna Cult database...')

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@saunacult.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin User'
    }
  })

  console.log('Admin user created:', admin.email)

  // Create sample sessions
  const today = new Date()
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
  const dayAfter = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)

  const sampleSessions = [
    {
      title: 'Morning Wellness Session',
      description: 'Start your day with a rejuvenating sauna session',
      date: tomorrow,
      startTime: '07:00',
      endTime: '08:00',
      capacity: 2,
      price: 45.00,
      isActive: true
    },
    {
      title: 'Afternoon Relaxation',
      description: 'Perfect for unwinding after a busy day',
      date: tomorrow,
      startTime: '15:00',
      endTime: '16:00',
      capacity: 3,
      price: 50.00,
      isActive: true
    },
    {
      title: 'Evening Detox Session',
      description: 'End your day with a cleansing sauna experience',
      date: tomorrow,
      startTime: '19:00',
      endTime: '20:00',
      capacity: 2,
      price: 55.00,
      isActive: true
    },
    {
      title: 'Weekend Special',
      description: 'Extended session for maximum relaxation',
      date: dayAfter,
      startTime: '10:00',
      endTime: '11:30',
      capacity: 4,
      price: 75.00,
      isActive: true
    }
  ]

  for (const sessionData of sampleSessions) {
    const session = await prisma.session.upsert({
      where: {
        id: `${sessionData.date.toISOString().split('T')[0]}-${sessionData.startTime}`
      },
      update: {},
      create: sessionData
    })
    console.log('Sample session created:', session.title)
  }

  console.log('Setup completed successfully!')
  console.log('Admin credentials:')
  console.log('Email:', adminEmail)
  console.log('Password:', adminPassword)
}

main()
  .catch((e) => {
    console.error('Setup failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })