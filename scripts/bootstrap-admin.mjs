import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function assertEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Variavel obrigatoria ausente: ${name}`);
  }

  return value;
}

async function main() {
  const email = assertEnv("ADMIN_EMAIL").toLowerCase();
  const password = assertEnv("ADMIN_PASSWORD");
  const name = process.env.ADMIN_NAME?.trim() || "Administrador";

  if (password.length < 10) {
    throw new Error("ADMIN_PASSWORD precisa ter pelo menos 10 caracteres.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      role: "ADMIN",
      passwordHash,
    },
    create: {
      name,
      email,
      role: "ADMIN",
      passwordHash,
    },
    select: {
      id: true,
      email: true,
      role: true,
      updatedAt: true,
    },
  });

  console.log("Admin bootstrap concluido com sucesso.");
  console.log(`Usuario: ${user.email} (${user.role})`);
}

main()
  .catch((error) => {
    console.error("Falha no bootstrap administrativo:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
