import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiQuery,
} from '@nestjs/swagger';
import { NoticiasService } from './noticias.service';
import { CreateNoticiaDto } from './dto/create-noticia.dto';
import { UpdateNoticiaDto } from './dto/update-noticia.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, Public, CurrentUser } from '../common/decorators/auth.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@ApiTags('Noticias')
@Controller('noticias')
export class NoticiasController {
  constructor(private readonly noticiasService: NoticiasService) {}

  // ─── POST /noticias ─────────────────────────────────────────────────────────
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.NOTICIAS, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @UseInterceptors(FilesInterceptor('imagenes', 10))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Crear noticia (redactor o admin)' })
  @ApiResponse({ status: 201, description: 'Noticia creada exitosamente' })
  create(
    @Body() createDto: CreateNoticiaDto,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: any,
  ) {
    return this.noticiasService.create(createDto, user.id, files);
  }

  // ─── GET /noticias (públicas aprobadas) ─────────────────────────────────────
  @Get()
  @Public()
  @ApiOperation({ summary: 'Listar noticias aprobadas (público)' })
  @ApiResponse({ status: 200, description: 'Lista de noticias aprobadas' })
  findAll() {
    return this.noticiasService.findAllPublic();
  }

  // ─── GET /noticias/admin ────────────────────────────────────────────────────
  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todas las noticias (admin)' })
  @ApiResponse({ status: 200, description: 'Lista completa de noticias' })
  findAllAdmin() {
    return this.noticiasService.findAllAdmin();
  }

  // ─── GET /noticias/mis-noticias ─────────────────────────────────────────────
  @Get('mis-noticias')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.NOTICIAS, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar noticias del redactor autenticado' })
  @ApiQuery({ name: 'estado', required: false, description: 'Filtrar por estado' })
  @ApiResponse({ status: 200, description: 'Lista de noticias del redactor' })
  findMisNoticias(
    @CurrentUser() user: any,
    @Query('estado') estado?: string,
  ) {
    return this.noticiasService.findByAutor(user.id, estado);
  }

  // ─── GET /noticias/:id ──────────────────────────────────────────────────────
  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Obtener noticia por ID (público)' })
  @ApiResponse({ status: 200, description: 'Noticia encontrada' })
  @ApiResponse({ status: 404, description: 'Noticia no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.noticiasService.findOne(id);
  }

  // ─── PATCH /noticias/:id ────────────────────────────────────────────────────
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.NOTICIAS, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @UseInterceptors(FilesInterceptor('imagenes', 10))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Actualizar noticia (solo si pendiente, solo autor)' })
  @ApiResponse({ status: 200, description: 'Noticia actualizada' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateNoticiaDto,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: any,
  ) {
    return this.noticiasService.update(id, updateDto, user.id, files);
  }

  // ─── PATCH /noticias/:id/aprobar ────────────────────────────────────────────
  @Patch(':id/aprobar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Aprobar noticia (admin)' })
  @ApiResponse({ status: 200, description: 'Noticia aprobada' })
  aprobar(@Param('id', ParseIntPipe) id: number) {
    return this.noticiasService.aprobar(id);
  }

  // ─── PATCH /noticias/:id/rechazar ───────────────────────────────────────────
  @Patch(':id/rechazar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rechazar noticia (admin)' })
  @ApiResponse({ status: 200, description: 'Noticia rechazada' })
  rechazar(@Param('id', ParseIntPipe) id: number) {
    return this.noticiasService.rechazar(id);
  }

  // ─── DELETE /noticias/:id ───────────────────────────────────────────────────
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar noticia (admin)' })
  @ApiResponse({ status: 200, description: 'Noticia eliminada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.noticiasService.remove(id);
  }
}
