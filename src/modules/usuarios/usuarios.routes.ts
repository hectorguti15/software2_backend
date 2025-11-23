import { Router } from 'express';
import * as usuariosController from './usuarios.controller';

const router = Router();

router.get('/', usuariosController.getUsuarios);
router.get('/actual', usuariosController.getUsuarioActual);
router.get('/:id', usuariosController.getUsuarioById);
router.post('/', usuariosController.createUsuario);
router.patch('/:id/rol', usuariosController.updateRol);

export default router;
