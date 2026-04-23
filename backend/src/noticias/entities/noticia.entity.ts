import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

export enum NoticiaEstado {
  PENDIENTE = 'pendiente',
  APROBADA = 'aprobada',
  RECHAZADA = 'rechazada',
}

@Entity('noticias')
export class Noticia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  resumen: string;

  @Column({ type: 'longtext', nullable: true, name: 'contenido_texto' })
  contenidoTexto: string;

  @Column({ type: 'longtext', nullable: true, name: 'contenido_html' })
  contenidoHtml: string;

  @Column({ type: 'text', nullable: true })
  imagenes: string;

  @Column({
    type: 'enum',
    enum: NoticiaEstado,
    default: NoticiaEstado.PENDIENTE,
  })
  estado: NoticiaEstado;

  // Relación con el usuario redactor
  @Column({ name: 'autor_id', nullable: true })
  autorId: string;

  @ManyToOne(() => User, { nullable: true, eager: false })
  @JoinColumn({ name: 'autor_id' })
  autor: User;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
}
