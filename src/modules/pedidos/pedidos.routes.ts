import { Router } from 'express';
import * as pedidosController from './pedidos.controller';

const router = Router();

router.post('/', pedidosController.createPedido);
router.get('/', pedidosController.getHistorial);
router.get('/:codigo', pedidosController.getPedidoByCodigo);
router.post('/:codigo/notificacion', pedidosController.enviarNotificacion);
router.post('/:codigo/boleta', pedidosController.generarBoleta);

export default router;
