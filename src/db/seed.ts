import prisma from '../config/database';
import { RolUsuario, TipoEvento, TipoMaterial } from '@prisma/client';

async function seed() {
  console.log('🌱 Iniciando seed de datos...');

  // Limpiar datos existentes (en orden por dependencias)
  await prisma.comentario.deleteMany();
  await prisma.resena.deleteMany();
  await prisma.pedidoItem.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.mensaje.deleteMany();
  await prisma.material.deleteMany();
  await prisma.evento.deleteMany();
  await prisma.usuarioSeccion.deleteMany();
  await prisma.seccion.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.usuario.deleteMany();

  console.log('🗑️  Datos anteriores eliminados');

  // ==================== USUARIOS ====================
  const usuario1 = await prisma.usuario.create({
    data: {
      nombre: 'Juan Pérez',
      email: 'juan.perez@ulima.edu.pe',
      rol: RolUsuario.alumno,
    },
  });

  const usuario2 = await prisma.usuario.create({
    data: {
      nombre: 'María García',
      email: 'maria.garcia@ulima.edu.pe',
      rol: RolUsuario.profesor,
    },
  });

  const usuario3 = await prisma.usuario.create({
    data: {
      nombre: 'Carlos Mendoza',
      email: 'carlos.mendoza@ulima.edu.pe',
      rol: RolUsuario.delegado,
    },
  });

  const usuario4 = await prisma.usuario.create({
    data: {
      nombre: 'Ana Torres',
      email: 'ana.torres@ulima.edu.pe',
      rol: RolUsuario.alumno,
    },
  });

  console.log('✅ Usuarios creados');

  // ==================== MENÚ ====================
  const menuItems = await prisma.menuItem.createMany({
    data: [
      {
        nombre: 'Ceviche de Pescado',
        descripcion: 'Ceviche fresco con pescado del día, limón, cebolla morada y camote',
        imagenUrl: 'https://via.placeholder.com/300x200?text=Ceviche',
        precio: 18.50,
      },
      {
        nombre: 'Lomo Saltado',
        descripcion: 'Lomo de res salteado con cebolla, tomate y papas fritas',
        imagenUrl: 'https://via.placeholder.com/300x200?text=Lomo+Saltado',
        precio: 22.00,
      },
      {
        nombre: 'Ají de Gallina',
        descripcion: 'Pollo desmenuzado en salsa de ají amarillo con arroz',
        imagenUrl: 'https://via.placeholder.com/300x200?text=Aji+de+Gallina',
        precio: 16.00,
      },
      {
        nombre: 'Arroz con Pollo',
        descripcion: 'Arroz verde con pollo, papa a la huancaína y ensalada',
        imagenUrl: 'https://via.placeholder.com/300x200?text=Arroz+con+Pollo',
        precio: 15.00,
      },
      {
        nombre: 'Tacu Tacu con Lomo',
        descripcion: 'Tacu tacu de frejoles con lomo al jugo',
        imagenUrl: 'https://via.placeholder.com/300x200?text=Tacu+Tacu',
        precio: 20.00,
      },
    ],
  });

  const allMenuItems = await prisma.menuItem.findMany();
  console.log('✅ Menu items creados');

  // ==================== PEDIDOS ====================
  const pedido1 = await prisma.pedido.create({
    data: {
      codigo: 'PED-2024-001',
      total: 40.50,
      usuarioId: usuario1.id,
      items: {
        create: [
          {
            nombre: 'Ceviche de Pescado',
            cantidad: 1,
            precio: 18.50,
            menuItemId: allMenuItems[0].id,
          },
          {
            nombre: 'Lomo Saltado',
            cantidad: 1,
            precio: 22.00,
            menuItemId: allMenuItems[1].id,
          },
        ],
      },
    },
  });

  const pedido2 = await prisma.pedido.create({
    data: {
      codigo: 'PED-2024-002',
      total: 31.00,
      usuarioId: usuario1.id,
      items: {
        create: [
          {
            nombre: 'Ají de Gallina',
            cantidad: 1,
            precio: 16.00,
            menuItemId: allMenuItems[2].id,
          },
          {
            nombre: 'Arroz con Pollo',
            cantidad: 1,
            precio: 15.00,
            menuItemId: allMenuItems[3].id,
          },
        ],
      },
    },
  });

  console.log('✅ Pedidos creados');

  // ==================== RESEÑAS ====================
  await prisma.resena.create({
    data: {
      productId: allMenuItems[0].id,
      calificacion: 4.5,
      usuarioId: usuario1.id,
      comentarios: {
        create: [
          {
            comentario: 'Excelente ceviche, muy fresco',
            calificacion: 4.5,
          },
        ],
      },
    },
  });

  await prisma.resena.create({
    data: {
      productId: allMenuItems[1].id,
      calificacion: 5.0,
      usuarioId: usuario4.id,
      comentarios: {
        create: [
          {
            comentario: 'El mejor lomo saltado que he probado',
            calificacion: 5.0,
          },
        ],
      },
    },
  });

  console.log('✅ Reseñas creadas');

  // ==================== SECCIONES ====================
  const seccion1 = await prisma.seccion.create({
    data: {
      nombre: 'Sección 1',
      codigo: 'ING-SW1-01',
      cursoNombre: 'Ingeniería de Software 1',
      profesorNombre: 'María García',
      delegadoNombre: 'Carlos Mendoza',
    },
  });

  const seccion2 = await prisma.seccion.create({
    data: {
      nombre: 'Sección 2',
      codigo: 'BD-01',
      cursoNombre: 'Base de Datos',
      profesorNombre: 'María García',
      delegadoNombre: null,
    },
  });

  console.log('✅ Secciones creadas');

  // ==================== ASIGNACIONES ====================
  await prisma.usuarioSeccion.createMany({
    data: [
      { usuarioId: usuario1.id, seccionId: seccion1.id },
      { usuarioId: usuario2.id, seccionId: seccion1.id },
      { usuarioId: usuario3.id, seccionId: seccion1.id },
      { usuarioId: usuario4.id, seccionId: seccion1.id },
      { usuarioId: usuario1.id, seccionId: seccion2.id },
      { usuarioId: usuario2.id, seccionId: seccion2.id },
      { usuarioId: usuario4.id, seccionId: seccion2.id },
    ],
  });

  console.log('✅ Asignaciones usuario-sección creadas');

  // ==================== MENSAJES ====================
  await prisma.mensaje.createMany({
    data: [
      {
        contenido: 'Bienvenidos al curso de Ingeniería de Software 1',
        autorId: usuario2.id,
        autorNombre: 'María García',
        seccionId: seccion1.id,
        esAnuncio: true,
        fecha: new Date('2024-01-15T10:00:00Z'),
      },
      {
        contenido: 'Hola a todos! Tienen alguna duda sobre el primer trabajo?',
        autorId: usuario3.id,
        autorNombre: 'Carlos Mendoza',
        seccionId: seccion1.id,
        esAnuncio: false,
        fecha: new Date('2024-01-16T14:30:00Z'),
      },
      {
        contenido: 'Sí, tengo una duda sobre el diagrama de clases',
        autorId: usuario1.id,
        autorNombre: 'Juan Pérez',
        seccionId: seccion1.id,
        esAnuncio: false,
        fecha: new Date('2024-01-16T15:00:00Z'),
      },
      {
        contenido: 'IMPORTANTE: La entrega del proyecto ha sido extendida hasta el viernes',
        autorId: usuario2.id,
        autorNombre: 'María García',
        seccionId: seccion1.id,
        esAnuncio: true,
        fecha: new Date('2024-01-17T09:00:00Z'),
      },
    ],
  });

  console.log('✅ Mensajes creados');

  // ==================== MATERIALES ====================
  await prisma.material.createMany({
    data: [
      {
        nombre: 'Introducción a UML.pdf',
        tipo: TipoMaterial.pdf,
        url: 'https://example.com/uml-intro.pdf',
        autorId: usuario2.id,
        autorNombre: 'María García',
        seccionId: seccion1.id,
        fechaSubida: new Date('2024-01-10T08:00:00Z'),
      },
      {
        nombre: 'Video tutorial - Patrones de Diseño',
        tipo: TipoMaterial.video,
        url: 'https://example.com/patrones-video.mp4',
        autorId: usuario2.id,
        autorNombre: 'María García',
        seccionId: seccion1.id,
        fechaSubida: new Date('2024-01-12T10:00:00Z'),
      },
      {
        nombre: 'Plantilla de documentación.docx',
        tipo: TipoMaterial.documento,
        url: 'https://example.com/plantilla.docx',
        autorId: usuario3.id,
        autorNombre: 'Carlos Mendoza',
        seccionId: seccion1.id,
        fechaSubida: new Date('2024-01-15T16:00:00Z'),
      },
    ],
  });

  console.log('✅ Materiales creados');

  // ==================== EVENTOS ====================
  await prisma.evento.createMany({
    data: [
      {
        titulo: 'Entrega del Proyecto Final',
        descripcion: 'Subir el proyecto completo con documentación al campus virtual',
        fecha: new Date('2024-02-15T23:59:00Z'),
        tipo: TipoEvento.entrega,
        autorId: usuario2.id,
        seccionId: seccion1.id,
      },
      {
        titulo: 'Examen Parcial',
        descripcion: 'Examen teórico-práctico de los temas vistos hasta la semana 8',
        fecha: new Date('2024-02-01T10:00:00Z'),
        tipo: TipoEvento.evaluacion,
        autorId: usuario2.id,
        seccionId: seccion1.id,
      },
      {
        titulo: 'Taller de Git y GitHub',
        descripcion: 'Sesión práctica de control de versiones',
        fecha: new Date('2024-01-25T14:00:00Z'),
        tipo: TipoEvento.evento,
        autorId: usuario2.id,
        seccionId: seccion1.id,
      },
      {
        titulo: 'Entrega Trabajo Grupal',
        descripcion: 'Presentación del análisis de requerimientos',
        fecha: new Date('2024-01-30T18:00:00Z'),
        tipo: TipoEvento.entrega,
        autorId: usuario2.id,
        seccionId: seccion1.id,
      },
    ],
  });

  console.log('✅ Eventos creados');

  console.log('🎉 Seed completado exitosamente!');
  console.log('\nEstadísticas:');
  console.log(`- Usuarios: ${await prisma.usuario.count()}`);
  console.log(`- Menu Items: ${await prisma.menuItem.count()}`);
  console.log(`- Pedidos: ${await prisma.pedido.count()}`);
  console.log(`- Reseñas: ${await prisma.resena.count()}`);
  console.log(`- Secciones: ${await prisma.seccion.count()}`);
  console.log(`- Mensajes: ${await prisma.mensaje.count()}`);
  console.log(`- Materiales: ${await prisma.material.count()}`);
  console.log(`- Eventos: ${await prisma.evento.count()}`);
}

seed()
  .catch((error) => {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
