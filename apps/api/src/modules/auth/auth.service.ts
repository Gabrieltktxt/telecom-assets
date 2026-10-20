import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Role } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../../common/prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });
    if (!user || !user.ativo)
      throw new UnauthorizedException("Credenciais inválidas");

    const ok = await bcrypt.compare(dto.senha, user.senhaHash);
    if (!ok) throw new UnauthorizedException("Credenciais inválidas");

    const token = await this.jwt.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
      nome: user.nome,
    });

    return {
      token,
      usuario: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
      },
    };
  }

  async register(dto: RegisterDto) {
    // 1) Verifica se e-mail já existe
    const exists = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });
    if (exists) throw new BadRequestException("E-mail já cadastrado");

    // 2) Cria usuário como CONSULTA (perfil mais restrito)
    const senhaHash = await bcrypt.hash(dto.senha, 10);
    const user = await this.prisma.usuario.create({
      data: {
        nome: dto.nome,
        email: dto.email,
        senhaHash,
        role: Role.CONSULTA,
      },
    });

    // 3) Gera token (login automático após cadastro)
    const token = await this.jwt.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
      nome: user.nome,
    });

    return {
      token,
      usuario: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
      },
    };
  }
}
