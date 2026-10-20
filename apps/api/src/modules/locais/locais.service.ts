import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CreateLocalDto } from "./dto/local.dto";

@Injectable()
export class LocaisService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.local.findMany({
      include: {
        responsavel: { select: { id: true, nome: true } },
        _count: { select: { ativos: true } },
      },
      orderBy: { nome: "asc" },
    });
  }

  async get(id: string) {
    const l = await this.prisma.local.findUnique({
      where: { id },
      include: {
        responsavel: { select: { id: true, nome: true } },
        ativos: { orderBy: { criadoEm: "desc" } },
      },
    });
    if (!l) throw new NotFoundException();
    return l;
  }

  create(dto: CreateLocalDto) {
    return this.prisma.local.create({ data: dto });
  }

  update(id: string, dto: CreateLocalDto) {
    return this.prisma.local.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    const count = await this.prisma.ativo.count({ where: { localId: id } });
    if (count > 0)
      throw new BadRequestException("Local possui ativos vinculados");
    await this.prisma.local.delete({ where: { id } });
    return { ok: true };
  }
}
