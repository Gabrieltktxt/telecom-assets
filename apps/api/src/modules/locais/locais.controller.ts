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
import { LocaisService } from "./locais.service";
import { CreateLocalDto } from "./dto/local.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("locais")
export class LocaisController {
  constructor(private service: LocaisService) {}

  // Todos podem ver
  @Get()
  list() {
    return this.service.list();
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.service.get(id);
  }

  // Só ADMIN cria/edita/exclui locais
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() dto: CreateLocalDto) {
    return this.service.create(dto);
  }

  @Roles(Role.ADMIN)
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: CreateLocalDto) {
    return this.service.update(id, dto);
  }

  @Roles(Role.ADMIN)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
