import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { StatusManutencao } from "@prisma/client";

export class CreateManutencaoDto {
  @IsUUID() ativoId: string;
  @IsString() problema: string;
  @IsOptional() @IsString() servico?: string;
  @IsOptional() @IsString() pecas?: string;
  @IsUUID() tecnicoId: string;
}

export class UpdateManutencaoDto {
  @IsOptional() @IsString() problema?: string;
  @IsOptional() @IsString() servico?: string;
  @IsOptional() @IsString() pecas?: string;
  @IsOptional() @IsEnum(StatusManutencao) status?: StatusManutencao;
}
