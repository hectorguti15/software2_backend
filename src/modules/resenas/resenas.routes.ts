import { Router } from 'express';
import * as resenasController from './resenas.controller';

const router = Router();

router.post('/', resenasController.createResena);
router.get('/item/:id', resenasController.getResenaItem);
router.get('/:productId', resenasController.getResenasByProduct);

export default router;
