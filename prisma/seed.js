import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data
  console.log('🧹 Clearing existing data...')
  await prisma.serverLog.deleteMany()
  await prisma.log.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.serverProductPrice.deleteMany()
  await prisma.serverProduct.deleteMany()
  await prisma.productPrice.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.voucher.deleteMany()
  await prisma.setting.deleteMany()
  await prisma.user.deleteMany()
  console.log('✅ Existing data cleared')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pteroca.com' },
    update: {},
    create: {
      email: 'admin@pteroca.com',
      password: adminPassword,
      name: 'Admin',
      surname: 'User',
      balance: '1000.00',
      isVerified: true,
      roles: ['ADMIN'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })

  // Create test user
  const userPassword = await bcrypt.hash('user123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'user@pteroca.com' },
    update: {},
    create: {
      email: 'user@pteroca.com',
      password: userPassword,
      name: 'Test',
      surname: 'User',
      balance: '50.00',
      isVerified: true,
      roles: ['USER'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })

  // Create categories
  const minecraftCategory = await prisma.category.create({
    data: {
      name: 'Minecraft',
      description: 'Minecraft server hosting plans',
    },
  })

  const gameCategory = await prisma.category.create({
    data: {
      name: 'Game Servers',
      description: 'Various game server hosting',
    },
  })

  // Create products
  const basicMinecraft = await prisma.product.create({
    data: {
      name: 'Basic Minecraft Server',
      description: 'Perfect for small communities and friends',
      diskSpace: 10240,
      memory: 2048,
      cpu: 50,
      io: 500,
      dbCount: 1,
      swap: 0,
      backups: 1,
      ports: 1,
      isActive: true,
      categoryId: minecraftCategory.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })

  const premiumMinecraft = await prisma.product.create({
    data: {
      name: 'Premium Minecraft Server',
      description: 'High-performance server for large communities',
      diskSpace: 51200,
      memory: 8192,
      cpu: 100,
      io: 1000,
      dbCount: 2,
      swap: 0,
      backups: 3,
      ports: 3,
      isActive: true,
      categoryId: minecraftCategory.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })

  // Create product prices
  await prisma.productPrice.create({
    data: {
      productId: basicMinecraft.id,
      type: 'monthly',
      value: 1,
      unit: 'month',
      price: '9.99',
    },
  })

  await prisma.productPrice.create({
    data: {
      productId: premiumMinecraft.id,
      type: 'monthly',
      value: 1,
      unit: 'month',
      price: '29.99',
    },
  })

  // Create sample settings
  const settings = [
    { name: 'site_name', value: 'PteroCA', type: 'text', context: 'General', hierarchy: 1 },
    { name: 'site_description', value: 'Game Server Hosting Platform', type: 'textarea', context: 'General', hierarchy: 2 },
    { name: 'default_theme', value: 'default', type: 'text', context: 'Appearance', hierarchy: 1 },
    { name: 'enable_dark_mode', value: 'true', type: 'boolean', context: 'Appearance', hierarchy: 2 },
    { name: 'max_servers_per_user', value: '5', type: 'number', context: 'Limits', hierarchy: 1 },
    { name: 'enable_registrations', value: 'true', type: 'boolean', context: 'Security', hierarchy: 1 },
    { name: 'pterodactyl_panel_url', value: 'https://panel.example.com', type: 'text', context: 'Pterodactyl', hierarchy: 1 },
    { name: 'pterodactyl_api_key', value: '', type: 'text', context: 'Pterodactyl', hierarchy: 2 },
    { name: 'stripe_publishable_key', value: '', type: 'text', context: 'Stripe', hierarchy: 1 },
    { name: 'stripe_secret_key', value: '', type: 'text', context: 'Stripe', hierarchy: 2 },
    { name: 'stripe_webhook_secret', value: '', type: 'text', context: 'Stripe', hierarchy: 3 },
  ]

  console.log('📝 Creating settings...')

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { name: setting.name },
      update: {},
      create: setting,
    })
  }
  console.log('✅ Settings created')

  // Create sample vouchers
  await prisma.voucher.create({
    data: {
      code: 'WELCOME10',
      discount: '10',
      type: 'percentage',
      uses: 0,
      maxUses: 100,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })

  await prisma.voucher.create({
    data: {
      code: 'SAVE5',
      discount: '5',
      type: 'fixed',
      uses: 0,
      maxUses: 50,
      expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })

  console.log('✅ Database seeding completed!')
  console.log('Admin user: admin@pteroca.com / admin123')
  console.log('Test user: user@pteroca.com / user123')
  console.log('')
  console.log('📊 Seeded data summary:')
  console.log(`   • ${await prisma.user.count()} users`)
  console.log(`   • ${await prisma.category.count()} categories`)
  console.log(`   • ${await prisma.product.count()} products`)
  console.log(`   • ${await prisma.setting.count()} settings`)
  console.log(`   • ${await prisma.voucher.count()} vouchers`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
