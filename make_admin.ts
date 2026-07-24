import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
    take: 1
  });

  if (users.length > 0) {
    const user = users[0];
    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'ADMIN' }
    });
    console.log(`Successfully made user ${user.email} an ADMIN`);
  } else {
    console.log("No users found to promote.");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
