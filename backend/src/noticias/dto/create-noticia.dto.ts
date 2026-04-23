import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateNoticiaDto {
  @ApiProperty({ example: 'Nueva convocatoria SENA 2026', description: 'Título de la noticia' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  titulo: string;

  @ApiPropertyOptional({ example: 'Breve resumen de la noticia', description: 'Resumen corto' })
  @IsOptional()
  @IsString()
  resumen?: string;

  @ApiProperty({ example: 'Contenido en texto plano...', description: 'Contenido en texto plano' })
  @IsString()
  @IsNotEmpty()
  contenidoTexto: string;

  @ApiPropertyOptional({ example: '<p>Contenido HTML...</p>', description: 'Contenido HTML' })
  @IsOptional()
  @IsString()
  contenidoHtml?: string;
}
