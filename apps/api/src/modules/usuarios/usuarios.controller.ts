import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Role } from "@prisma/client";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UsuariosService } from "./usuarios.service";
import { CreateUsuarioDto, UpdateUsuarioDto } from "./dto/usuario.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("usuarios")
export class UsuariosController {
  constructor(private service: UsuariosService) {}

  @Roles(Role.ADMIN)
  @Get()
  list() {
    return this.service.list();
  }

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() dto: CreateUsuarioDto) {
    return this.service.create(dto);
  }

  @Roles(Role.ADMIN)
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateUsuarioDto) {
    return this.service.update(id, dto);
  }

  @Roles(Role.ADMIN)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
