import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Prisma, StatusAtivo, StatusManutencao } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CreateManutencaoDto, UpdateManutencaoDto } from "./dto/manutencao.dto";

@Injectable()
export class ManutencoesService {
  private readonly logger = new Logger(ManutencoesService.name);

  constructor(private prisma: PrismaService) {}

  list(filter: {
    status?: StatusManutencao;
    ativoId?: string;
    tecnicoId?: string;
    mes?: string;
  }) {
    const where: Prisma.ManutencaoWhereInput = {};
    if (filter.status) where.status = filter.status;
    if (filter.ativoId) where.ativoId = filter.ativoId;
    if (filter.tecnicoId) where.tecnicoId = filter.tecnicoId;
    if (filter.mes) {
      const [y, m] = filter.mes.split("-").map(Number);
      where.dataAbertura = {
        gte: new Date(y, m - 1, 1),
        lt: new Date(y, m, 1),
      };
    }
    return this.prisma.manutencao.findMany({
      where,
      include: {
        ativo: {
          select: { id: true, numeroSerie: true, modelo: true, tipo: true },
        },
        tecnico: { select: { id: true, nome: true } },
      },
      orderBy: { dataAbertura: "desc" },
    });
  }

  async create(dto: CreateManutencaoDto) {
    return this.prisma.$transaction(async (tx) => {
      const m = await tx.manutencao.create({ data: dto });
      await tx.ativo.update({
        where: { id: dto.ativoId },
        data: { status: StatusAtivo.MANUTENCAO },
      });
      return m;
    });
  }

  async update(id: string, dto: UpdateManutencaoDto) {
    const m = await this.prisma.manutencao.findUnique({ where: { id } });
    if (!m) throw new NotFoundException();

    const data: any = { ...dto };
    const statusFinal: StatusManutencao[] = [
      StatusManutencao.CONCLUIDA,
      StatusManutencao.CANCELADA,
    ];

    if (dto.status && statusFinal.includes(dto.status)) {
      data.dataFechamento = new Date();
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.manutencao.update({ where: { id }, data });

      if (dto.status && statusFinal.includes(dto.status)) {
        await tx.ativo.update({
          where: { id: m.ativoId },
          data: { status: StatusAtivo.ATIVO },
        });
      }
      return updated;
    });
  }

  // NOVO: só ADMIN usa
  async remove(id: string) {
    const m = await this.prisma.manutencao.findUnique({ where: { id } });
    if (!m) throw new NotFoundException("Manutenção não encontrada");

    return this.prisma.$transaction(async (tx) => {
      // Se a manutenção não estava finalizada, libera o ativo
      if (
        m.status !== StatusManutencao.CONCLUIDA &&
        m.status !== StatusManutencao.CANCELADA
      ) {
        await tx.ativo.update({
          where: { id: m.ativoId },
          data: { status: StatusAtivo.ATIVO },
        });
      }
      await tx.manutencao.delete({ where: { id } });
      return { ok: true };
    });
  }
}
