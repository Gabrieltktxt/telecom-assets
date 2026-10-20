import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { DashboardService } from "./dashboard.service";

@UseGuards(JwtAuthGuard)
@Controller("dashboard")
export class DashboardController {
  constructor(private service: DashboardService) {}

  @Get("resumo") resumo() {
    return this.service.resumo();
  }
  @Get("por-local") porLocal() {
    return this.service.porLocal();
  }
  @Get("por-tipo") porTipo() {
    return this.service.porTipo();
  }
  @Get("manutencoes-mes") manutencoesMes() {
    return this.service.manutencoesMes();
  }
  @Get("ativos-com-problema") ativosComProblema() {
    return this.service.ativosComProblema();
  }
  @Get("ativos-orfaos") ativosOrfaos() {
    return this.service.ativosOrfaos();
  }
}
