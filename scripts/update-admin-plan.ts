import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.update({
    where: { email: 'admin@printysell.com' },
    data: { plan: 'PRO' }
  });

  console.log('Admin account plan updated to PRO.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
