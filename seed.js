// seed.js — Crea datos de prueba de software en la BD
// Ejecutar: node seed.js

const BASE = 'http://localhost:3001/api';

const softwareList = [
  {
    nombre: 'Sistema de Gestión Escolar',
    descripcion:
      'Plataforma web para la gestión académica de instituciones educativas. Permite manejar estudiantes, docentes, horarios y calificaciones de forma eficiente.',
    tags: 'web,educacion,gestion',
    autores: 'Carlos Martínez, Ana Gómez',
    urlAplicacion: 'https://gestion-escolar.sena.edu.co',
    valoracion: 4.5,
    estado: 'activo',
  },
  {
    nombre: 'App Inventario SENA',
    descripcion:
      'Aplicación móvil y web para el control de inventarios y activos físicos en centros de formación del SENA. Incluye escaneo de QR y reportes en tiempo real.',
    tags: 'mobile,inventario,qr',
    autores: 'Luis Rodríguez, María Torres',
    urlAplicacion: 'https://inventario.sena.edu.co',
    valoracion: 4.0,
    estado: 'activo',
  },
  {
    nombre: 'Plataforma E-learning SENA',
    descripcion:
      'LMS (Learning Management System) desarrollado para la impartición de cursos virtuales. Soporta videoconferencias, foros y evaluaciones en línea.',
    tags: 'elearning,educacion,virtual,lms',
    autores: 'Paola Herrera, Diego Cárdenas',
    urlAplicacion: 'https://elearning.sena.edu.co',
    valoracion: 5.0,
    estado: 'activo',
  },
  {
    nombre: 'Sistema de Nómina Institucional',
    descripcion:
      'Software de gestión de nómina para instituciones públicas. Automatiza liquidaciones, deducciones y genera informes DIAN compatibles.',
    tags: 'nomina,backend,gestion',
    autores: 'Jorge Salazar',
    urlAplicacion: 'https://nomina.sena.edu.co',
    valoracion: 3.5,
    estado: 'activo',
  },
  {
    nombre: 'Portal de Emprendimiento',
    descripcion:
      'Plataforma para conectar emprendedores egresados del SENA con inversores y mentores. Incluye vitrina de proyectos y módulo de postulación a fondos.',
    tags: 'emprendimiento,web,startup',
    autores: 'Sandra López, Andrés Morales',
    urlAplicacion: 'https://emprendimiento.sena.edu.co',
    valoracion: 4.2,
    estado: 'activo',
  },
];

async function seed() {
  console.log('🌱 Iniciando seed de datos...\n');
  let creados = 0;

  for (const sw of softwareList) {
    try {
      const res = await fetch(`${BASE}/software`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sw),
      });
      const json = await res.json();
      if (res.ok) {
        const id = json?.data?.id ?? json?.id ?? '?';
        console.log(`✅ Creado [${id}]: ${sw.nombre}`);
        creados++;
      } else {
        console.error(`❌ Error creando "${sw.nombre}":`, JSON.stringify(json));
      }
    } catch (err) {
      console.error(`❌ Error de red creando "${sw.nombre}":`, err.message);
    }
  }

  console.log(`\n🎉 Seed completado: ${creados}/${softwareList.length} registros creados.`);
}

seed();
