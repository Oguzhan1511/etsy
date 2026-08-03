import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@printysell.com' },
    update: {
      paymentStatus: true,
      role: 'ADMIN',
      password: hashedPassword
    },
    create: {
      name: 'PrintySell Admin',
      email: 'admin@printysell.com',
      password: hashedPassword,
      paymentStatus: true,
      role: 'ADMIN',
      isVerified: true
    }
  });

  console.log('Admin account created/updated successfully:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
