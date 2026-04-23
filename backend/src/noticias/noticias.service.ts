import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Noticia, NoticiaEstado } from './entities/noticia.entity';
import { CreateNoticiaDto } from './dto/create-noticia.dto';
import { UpdateNoticiaDto } from './dto/update-noticia.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class NoticiasService {
  constructor(
    @InjectRepository(Noticia)
    private noticiaRepository: Repository<Noticia>,
    private cloudinaryService: CloudinaryService,
  ) {}

  // ─── Crear noticia (rol noticias) ──────────────────────────────────────────

  async create(
    createDto: CreateNoticiaDto,
    autorId: string,
    files?: Express.Multer.File[],
  ): Promise<Noticia> {
    let imagenes: string | undefined;

    if (files && files.length > 0) {
      const urls = await this.cloudinaryService.uploadImages(files);
      imagenes = urls.join(',');
    }

    const noticia = this.noticiaRepository.create({
      ...createDto,
      autorId,
      imagenes,
      estado: NoticiaEstado.PENDIENTE,
    });

    return this.noticiaRepository.save(noticia);
  }

  // ─── Listar públicas (aprobadas) ──────────────────────────────────────────

  async findAllPublic(): Promise<Noticia[]> {
    return this.noticiaRepository.find({
      where: { estado: NoticiaEstado.APROBADA },
      order: { fechaCreacion: 'DESC' },
    });
  }

  // ─── Listar todas (admin) ─────────────────────────────────────────────────

  async findAllAdmin(): Promise<Noticia[]> {
    return this.noticiaRepository.find({
      order: { fechaCreacion: 'DESC' },
    });
  }

  // ─── Mis noticias (redactor) ──────────────────────────────────────────────

  async findByAutor(
    autorId: string,
    estado?: string,
  ): Promise<Noticia[]> {
    const where: any = { autorId };
    if (estado) {
      where.estado = estado;
    }
    return this.noticiaRepository.find({
      where,
      order: { fechaCreacion: 'DESC' },
    });
  }

  // ─── Detalle público ──────────────────────────────────────────────────────

  async findOne(id: number): Promise<Noticia> {
    const noticia = await this.noticiaRepository.findOne({ where: { id } });
    if (!noticia) {
      throw new NotFoundException(`Noticia con ID ${id} no encontrada`);
    }
    return noticia;
  }

  // ─── Actualizar (solo si pendiente, y solo su autor) ──────────────────────

  async update(
    id: number,
    updateDto: UpdateNoticiaDto,
    autorId: string,
    files?: Express.Multer.File[],
  ): Promise<Noticia> {
    const noticia = await this.findOne(id);

    if (noticia.autorId !== autorId) {
      throw new ForbiddenException('No puedes editar una noticia que no es tuya');
    }

    if (noticia.estado !== NoticiaEstado.PENDIENTE) {
      throw new ForbiddenException('Solo se pueden editar noticias en estado pendiente');
    }

    if (files && files.length > 0) {
      const urls = await this.cloudinaryService.uploadImages(files);
      const existentes = noticia.imagenes
        ? noticia.imagenes.split(',').map((u) => u.trim())
        : [];
      noticia.imagenes = [...existentes, ...urls].filter(Boolean).join(',');
    }

    Object.assign(noticia, updateDto);
    return this.noticiaRepository.save(noticia);
  }

  // ─── Aprobar (admin) ──────────────────────────────────────────────────────

  async aprobar(id: number): Promise<Noticia> {
    const noticia = await this.findOne(id);
    noticia.estado = NoticiaEstado.APROBADA;
    return this.noticiaRepository.save(noticia);
  }

  // ─── Rechazar (admin) ─────────────────────────────────────────────────────

  async rechazar(id: number): Promise<Noticia> {
    const noticia = await this.findOne(id);
    noticia.estado = NoticiaEstado.RECHAZADA;
    return this.noticiaRepository.save(noticia);
  }

  // ─── Eliminar (admin) ─────────────────────────────────────────────────────

  async remove(id: number): Promise<void> {
    const noticia = await this.findOne(id);

    // Eliminar imágenes de Cloudinary si existen
    if (noticia.imagenes) {
      const urls = noticia.imagenes.split(',').map((u) => u.trim());
      for (const url of urls) {
        const publicId = this.cloudinaryService.extractPublicId(url);
        await this.cloudinaryService.deleteImage(publicId);
      }
    }

    await this.noticiaRepository.remove(noticia);
  }
}
