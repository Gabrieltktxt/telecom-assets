import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreateLocalDto {
  @IsString()
  nome: string;

  @IsString()
  endereco: string;

  @IsOptional()
  @IsUUID()
  responsavelId?: string;
}
