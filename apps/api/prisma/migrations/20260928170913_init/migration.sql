-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'TECNICO', 'CONSULTA');

-- CreateEnum
CREATE TYPE "TipoAtivo" AS ENUM ('RADIO', 'ANTENA', 'REPETIDORA', 'CABO', 'SWITCH', 'OUTRO');

-- CreateEnum
CREATE TYPE "StatusAtivo" AS ENUM ('ATIVO', 'INATIVO', 'MANUTENCAO', 'DESCARTADO', 'RESERVADO');

-- CreateEnum
CREATE TYPE "StatusManutencao" AS ENUM ('ABERTA', 'EM_ANDAMENTO', 'AGUARDANDO_PECA', 'CONCLUIDA', 'CANCELADA');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CONSULTA',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Local" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "responsavelId" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Local_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ativo" (
    "id" TEXT NOT NULL,
    "tipo" "TipoAtivo" NOT NULL,
    "fabricante" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "numeroSerie" TEXT NOT NULL,
    "patrimonio" TEXT,
    "localId" TEXT NOT NULL,
    "status" "StatusAtivo" NOT NULL DEFAULT 'ATIVO',
    "dataAquisicao" TIMESTAMP(3),
    "observacoes" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ativo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manutencao" (
    "id" TEXT NOT NULL,
    "ativoId" TEXT NOT NULL,
    "problema" TEXT NOT NULL,
    "servico" TEXT,
    "pecas" TEXT,
    "tecnicoId" TEXT NOT NULL,
    "dataAbertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataFechamento" TIMESTAMP(3),
    "status" "StatusManutencao" NOT NULL DEFAULT 'ABERTA',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Manutencao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Ativo_numeroSerie_key" ON "Ativo"("numeroSerie");

-- CreateIndex
CREATE UNIQUE INDEX "Ativo_patrimonio_key" ON "Ativo"("patrimonio");

-- CreateIndex
CREATE INDEX "Ativo_localId_idx" ON "Ativo"("localId");

-- CreateIndex
CREATE INDEX "Ativo_status_idx" ON "Ativo"("status");

-- CreateIndex
CREATE INDEX "Ativo_tipo_idx" ON "Ativo"("tipo");

-- CreateIndex
CREATE INDEX "Manutencao_ativoId_idx" ON "Manutencao"("ativoId");

-- CreateIndex
CREATE INDEX "Manutencao_status_idx" ON "Manutencao"("status");

-- AddForeignKey
ALTER TABLE "Local" ADD CONSTRAINT "Local_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ativo" ADD CONSTRAINT "Ativo_localId_fkey" FOREIGN KEY ("localId") REFERENCES "Local"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manutencao" ADD CONSTRAINT "Manutencao_ativoId_fkey" FOREIGN KEY ("ativoId") REFERENCES "Ativo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manutencao" ADD CONSTRAINT "Manutencao_tecnicoId_fkey" FOREIGN KEY ("tecnicoId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
