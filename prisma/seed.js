const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.event_tbl.upsert({
    where: { code: "ACFMombasa2026" },
    update: { isActive: true },
    create: {
      name: "ACF Mombasa 2026",
      code: "ACFMombasa2026",
      start_date: new Date("2026-10-13T09:00:00.000Z"),
      end_date: new Date("2026-10-17T17:00:00.000Z"),
      isActive: true,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
