import { Module } from "@nestjs/common";
import { AtivosController } from "./ativos.controller";
import { AtivosService } from "./ativos.service";

@Module({ controllers: [AtivosController], providers: [AtivosService] })
export class AtivosModule {}
