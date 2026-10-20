import { Module } from "@nestjs/common";
import { PrismaModule } from "./common/prisma/prisma.module";
import { HealthController } from "./common/health.controller";
import { AuthModule } from "./modules/auth/auth.module";
import { UsuariosModule } from "./modules/usuarios/usuarios.module";
import { LocaisModule } from "./modules/locais/locais.module";
import { AtivosModule } from "./modules/ativos/ativos.module";
import { ManutencoesModule } from "./modules/manutencoes/manutencoes.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsuariosModule,
    LocaisModule,
    AtivosModule,
    ManutencoesModule,
    DashboardModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
