import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";
import { StatusAtivo, TipoAtivo } from "@prisma/client";

export class CreateAtivoDto {
  @IsEnum(TipoAtivo) tipo: TipoAtivo;
  @IsString() fabricante: string;
  @IsString() modelo: string;
  @IsString() numeroSerie: string;
  @IsOptional() @IsString() patrimonio?: string;
  @IsUUID() localId: string;
  @IsOptional() @IsEnum(StatusAtivo) status?: StatusAtivo;
  @IsOptional() @IsDateString() dataAquisicao?: string;
  @IsOptional() @IsString() observacoes?: string;
}

export class UpdateAtivoDto {
  @IsOptional() @IsEnum(TipoAtivo) tipo?: TipoAtivo;
  @IsOptional() @IsString() fabricante?: string;
  @IsOptional() @IsString() modelo?: string;
  @IsOptional() @IsString() numeroSerie?: string;
  @IsOptional() @IsString() patrimonio?: string;
  @IsOptional() @IsUUID() localId?: string;
  @IsOptional() @IsEnum(StatusAtivo) status?: StatusAtivo;
  @IsOptional() @IsDateString() dataAquisicao?: string;
  @IsOptional() @IsString() observacoes?: string;
}

export class FilterAtivoDto {
  @IsOptional() @IsEnum(TipoAtivo) tipo?: TipoAtivo;
  @IsOptional() @IsEnum(StatusAtivo) status?: StatusAtivo;
  @IsOptional() @IsUUID() localId?: string;
  @IsOptional() @IsString() q?: string;
}
