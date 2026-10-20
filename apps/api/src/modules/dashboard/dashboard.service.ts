import { Injectable } from "@nestjs/common";
import { StatusAtivo, StatusManutencao } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async resumo() {
    const [total, ativos, inativos, emManutencao] = await Promise.all([
      this.prisma.ativo.count(),
      this.prisma.ativo.count({ where: { status: "ATIVO" } }),
      this.prisma.ativo.count({ where: { status: "INATIVO" } }),
      this.prisma.ativo.count({ where: { status: "MANUTENCAO" } }),
    ]);

    const now = new Date();
    const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1);
    const manutencoesNoMes = await this.prisma.manutencao.count({
      where: { dataAbertura: { gte: inicioMes } },
    });

    // NOVO: quantos chamados estão em aberto (não finalizados)
    const chamadosAbertos = await this.prisma.manutencao.count({
      where: {
        status: {
          in: [
            StatusManutencao.ABERTA,
            StatusManutencao.EM_ANDAMENTO,
            StatusManutencao.AGUARDANDO_PECA,
          ],
        },
      },
    });

    return {
      totalEquipamentos: total,
      ativos,
      inativos,
      emManutencao,
      chamadosAbertos,
      manutencoesNoMes,
    };
  }

  async porLocal() {
    const locais = await this.prisma.local.findMany({
      include: { _count: { select: { ativos: true } } },
      orderBy: { nome: "asc" },
    });
    return locais.map((l) => ({ local: l.nome, total: l._count.ativos }));
  }

  async porTipo() {
    const grupos = await this.prisma.ativo.groupBy({
      by: ["tipo"],
      _count: true,
    });
    return grupos.map((g) => ({ tipo: g.tipo, total: g._count }));
  }

  async manutencoesMes() {
    const anoAtual = new Date().getFullYear();
    const rows = await this.prisma.$queryRaw<{ mes: number; total: bigint }[]>`
      SELECT EXTRACT(MONTH FROM "dataAbertura")::int AS mes, COUNT(*)::bigint AS total
      FROM "Manutencao"
      WHERE EXTRACT(YEAR FROM "dataAbertura") = ${anoAtual}
      GROUP BY 1 ORDER BY 1`;
    const labels = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];
    const mapa = new Map(rows.map((r) => [Number(r.mes), Number(r.total)]));
    return labels.map((label, i) => ({
      mes: label,
      total: mapa.get(i + 1) ?? 0,
    }));
  }

  async ativosComProblema() {
    return this.prisma.manutencao.findMany({
      where: {
        status: {
          in: [
            StatusManutencao.ABERTA,
            StatusManutencao.EM_ANDAMENTO,
            StatusManutencao.AGUARDANDO_PECA,
          ],
        },
      },
      include: {
        ativo: {
          select: {
            id: true,
            numeroSerie: true,
            modelo: true,
            tipo: true,
            local: { select: { nome: true } },
          },
        },
        tecnico: { select: { nome: true } },
      },
      orderBy: { dataAbertura: "desc" },
      take: 10,
    });
  }

  // NOVO: lista ativos com status MANUTENCAO que não possuem nenhum chamado aberto
  async ativosOrfaos() {
    return this.prisma.ativo.findMany({
      where: {
        status: StatusAtivo.MANUTENCAO,
        manutencoes: {
          none: {
            status: {
              in: [
                StatusManutencao.ABERTA,
                StatusManutencao.EM_ANDAMENTO,
                StatusManutencao.AGUARDANDO_PECA,
              ],
            },
          },
        },
      },
      select: {
        id: true,
        numeroSerie: true,
        modelo: true,
        tipo: true,
        fabricante: true,
        local: { select: { nome: true } },
      },
      orderBy: { numeroSerie: "asc" },
    });
  }
}
