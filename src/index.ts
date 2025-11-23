import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import { errorHandler } from './shared/errorHandler';
import prisma from './config/database';

// Importar routers
import menuRoutes from './modules/menu/menu.routes';
import pedidosRoutes from './modules/pedidos/pedidos.routes';
import resenasRoutes from './modules/resenas/resenas.routes';
import usuariosRoutes from './modules/usuarios/usuarios.routes';
import aulavirtualRoutes from './modules/aulavirtual/aulavirtual.routes';

const app = express();

// ==================== MIDDLEWARES ====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== HEALTH CHECK ====================
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'ULima API is running',
    timestamp: new Date().toISOString(),
  });
});

// ==================== API ROUTES ====================
app.use('/api/menu', menuRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/resenas', resenasRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/aula-virtual', aulavirtualRoutes);

// ==================== ERROR HANDLER ====================
app.use(errorHandler);

// ==================== 404 HANDLER ====================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

// ==================== SERVER START ====================
const PORT = config.port;

async function startServer() {
  try {
    // Verificar conexión a la base de datos
    await prisma.$connect();
    console.log('✅ Conexión a PostgreSQL establecida');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API Base: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Manejar cierre graceful
process.on('SIGINT', async () => {
  console.log('\n⏹️  Cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⏹️  Cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
