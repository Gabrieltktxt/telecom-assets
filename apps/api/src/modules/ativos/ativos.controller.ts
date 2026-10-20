import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { Role } from "@prisma/client";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { AtivosService } from "./ativos.service";
import {
  CreateAtivoDto,
  FilterAtivoDto,
  UpdateAtivoDto,
} from "./dto/ativo.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("ativos")
export class AtivosController {
  constructor(private service: AtivosService) {}

  // Todos podem ver
  @Get()
  list(@Query() f: FilterAtivoDto) {
    return this.service.list(f);
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.service.get(id);
  }

  // ADMIN e TECNICO podem criar
  @Roles(Role.ADMIN, Role.TECNICO)
  @Post()
  create(@Body() dto: CreateAtivoDto) {
    return this.service.create(dto);
  }

  // ADMIN e TECNICO podem editar
  @Roles(Role.ADMIN, Role.TECNICO)
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateAtivoDto) {
    return this.service.update(id, dto);
  }

  // ⚠️ SÓ ADMIN pode excluir
  @Roles(Role.ADMIN)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
