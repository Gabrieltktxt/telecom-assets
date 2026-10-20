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
import { Role, StatusManutencao } from "@prisma/client";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { ManutencoesService } from "./manutencoes.service";
import { CreateManutencaoDto, UpdateManutencaoDto } from "./dto/manutencao.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("manutencoes")
export class ManutencoesController {
  constructor(private service: ManutencoesService) {}

  // Todos podem ver
  @Get()
  list(
    @Query("status") status?: StatusManutencao,
    @Query("ativoId") ativoId?: string,
    @Query("tecnicoId") tecnicoId?: string,
    @Query("mes") mes?: string,
  ) {
    return this.service.list({ status, ativoId, tecnicoId, mes });
  }

  // ADMIN e TECNICO podem abrir chamado
  @Roles(Role.ADMIN, Role.TECNICO)
  @Post()
  create(@Body() dto: CreateManutencaoDto) {
    return this.service.create(dto);
  }

  // ADMIN e TECNICO podem atualizar status (avançar, concluir)
  @Roles(Role.ADMIN, Role.TECNICO)
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateManutencaoDto) {
    return this.service.update(id, dto);
  }

  // ⚠️ SÓ ADMIN pode excluir chamado
  @Roles(Role.ADMIN)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
