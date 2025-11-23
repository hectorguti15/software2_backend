import { Router } from 'express';
import * as aulavirtualController from './aulavirtual.controller';

const router = Router();

// Rutas de secciones
router.get('/usuarios/:usuarioId/secciones', aulavirtualController.getSeccionesUsuario);
router.get('/secciones/:seccionId', aulavirtualController.getSeccionDetail);
router.post('/secciones', aulavirtualController.createSeccion);
router.post('/secciones/:seccionId/usuarios/:usuarioId', aulavirtualController.asignarUsuarioSeccion);

// Rutas de mensajes
router.get('/secciones/:seccionId/mensajes', aulavirtualController.getMensajes);
router.post('/secciones/:seccionId/mensajes', aulavirtualController.enviarMensaje);

// Rutas de materiales
router.get('/secciones/:seccionId/materiales', aulavirtualController.getMateriales);
router.post('/secciones/:seccionId/materiales', aulavirtualController.subirMaterial);

// Rutas de eventos
router.get('/secciones/:seccionId/eventos', aulavirtualController.getEventos);
router.post('/secciones/:seccionId/eventos', aulavirtualController.crearEvento);

export default router;
