import { PrismaClient, Role, TipoAtivo, StatusAtivo } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const senhaHash = await bcrypt.hash("admin123", 10);

  const admin = await prisma.usuario.upsert({
    where: { email: "admin@telecom.com" },
    update: {},
    create: {
      nome: "Administrador",
      email: "admin@telecom.com",
      senhaHash,
      role: Role.ADMIN,
    },
  });

  const tecnico = await prisma.usuario.upsert({
    where: { email: "tecnico@telecom.com" },
    update: {},
    create: {
      nome: "João Técnico",
      email: "tecnico@telecom.com",
      senhaHash,
      role: Role.TECNICO,
    },
  });

  const local1 = await prisma.local.create({
    data: {
      nome: "Estação Central",
      endereco: "Av. Principal, 100",
      responsavelId: admin.id,
    },
  });
  const local2 = await prisma.local.create({
    data: {
      nome: "Linha Norte - Torre 3",
      endereco: "Rod. BR-101, km 42",
      responsavelId: tecnico.id,
    },
  });

  await prisma.ativo.createMany({
    data: [
      {
        tipo: TipoAtivo.RADIO,
        fabricante: "Motorola",
        modelo: "APX 6000",
        numeroSerie: "SN-RD-001",
        patrimonio: "PAT-0001",
        localId: local1.id,
        status: StatusAtivo.ATIVO,
      },
      {
        tipo: TipoAtivo.ANTENA,
        fabricante: "Kathrein",
        modelo: "K-800",
        numeroSerie: "SN-AN-001",
        patrimonio: "PAT-0002",
        localId: local2.id,
        status: StatusAtivo.ATIVO,
      },
      {
        tipo: TipoAtivo.REPETIDORA,
        fabricante: "Hytera",
        modelo: "RD-982",
        numeroSerie: "SN-RP-001",
        patrimonio: "PAT-0003",
        localId: local2.id,
        status: StatusAtivo.MANUTENCAO,
      },
      {
        tipo: TipoAtivo.SWITCH,
        fabricante: "Cisco",
        modelo: "Catalyst 2960",
        numeroSerie: "SN-SW-001",
        patrimonio: "PAT-0004",
        localId: local1.id,
        status: StatusAtivo.ATIVO,
      },
    ],
  });

  console.log("✅ Seed concluído.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
