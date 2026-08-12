import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany({ include: { discountCode: true } });
  console.log(users.map(u => ({ email: u.email, discountCodeId: u.discountCodeId, code: u.discountCode?.code })));
}
main().catch(console.error).finally(() => prisma.$disconnect());
