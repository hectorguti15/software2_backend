import { Router } from 'express';
import * as menuController from './menu.controller';

const router = Router();

router.get('/', menuController.getMenuItems);
router.get('/:id', menuController.getMenuItemDetail);

export default router;
