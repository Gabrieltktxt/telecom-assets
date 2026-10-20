import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CreateUsuarioDto, UpdateUsuarioDto } from "./dto/usuario.dto";

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        ativo: true,
        criadoEm: true,
      },
      orderBy: { nome: "asc" },
    });
  }

  async create(dto: CreateUsuarioDto) {
    const exists = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });
    if (exists) throw new BadRequestException("E-mail já cadastrado");

    const senhaHash = await bcrypt.hash(dto.senha, 10);
    const u = await this.prisma.usuario.create({
      data: { nome: dto.nome, email: dto.email, senhaHash, role: dto.role },
    });

    const { senhaHash: _, ...rest } = u;
    return rest;
  }

  async update(id: string, dto: UpdateUsuarioDto) {
    const u = await this.prisma.usuario.findUnique({ where: { id } });
    if (!u) throw new NotFoundException();

    const updated = await this.prisma.usuario.update({
      where: { id },
      data: dto,
    });
    const { senhaHash: _, ...rest } = updated;
    return rest;
  }

  async remove(id: string) {
    await this.prisma.usuario.update({ where: { id }, data: { ativo: false } });
    return { ok: true };
  }
}
