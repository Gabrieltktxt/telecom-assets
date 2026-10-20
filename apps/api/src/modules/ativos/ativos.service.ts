import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import {
  CreateAtivoDto,
  FilterAtivoDto,
  UpdateAtivoDto,
} from "./dto/ativo.dto";

@Injectable()
export class AtivosService {
  constructor(private prisma: PrismaService) {}

  list(f: FilterAtivoDto) {
    const where: Prisma.AtivoWhereInput = {};
    if (f.tipo) where.tipo = f.tipo;
    if (f.status) where.status = f.status;
    if (f.localId) where.localId = f.localId;
    if (f.q) {
      where.OR = [
        { numeroSerie: { contains: f.q, mode: "insensitive" } },
        { patrimonio: { contains: f.q, mode: "insensitive" } },
        { modelo: { contains: f.q, mode: "insensitive" } },
        { fabricante: { contains: f.q, mode: "insensitive" } },
      ];
    }
    return this.prisma.ativo.findMany({
      where,
      include: { local: { select: { id: true, nome: true } } },
      orderBy: { criadoEm: "desc" },
    });
  }

  async get(id: string) {
    const a = await this.prisma.ativo.findUnique({
      where: { id },
      include: {
        local: {
          include: { responsavel: { select: { id: true, nome: true } } },
        },
        manutencoes: {
          include: { tecnico: { select: { id: true, nome: true } } },
          orderBy: { dataAbertura: "desc" },
        },
      },
    });
    if (!a) throw new NotFoundException();
    return a;
  }

  async create(dto: CreateAtivoDto) {
    try {
      return await this.prisma.ativo.create({
        data: {
          ...dto,
          dataAquisicao: dto.dataAquisicao ? new Date(dto.dataAquisicao) : null,
        },
      });
    } catch (e: any) {
      if (e.code === "P2002")
        throw new ConflictException("Número de série ou patrimônio já existe");
      throw e;
    }
  }

  async update(id: string, dto: UpdateAtivoDto) {
    try {
      return await this.prisma.ativo.update({
        where: { id },
        data: {
          ...dto,
          dataAquisicao: dto.dataAquisicao
            ? new Date(dto.dataAquisicao)
            : undefined,
        },
      });
    } catch (e: any) {
      if (e.code === "P2002")
        throw new ConflictException("Número de série ou patrimônio já existe");
      throw e;
    }
  }

  async remove(id: string) {
    await this.prisma.ativo.delete({ where: { id } });
    return { ok: true };
  }
}
