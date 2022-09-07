import { DepresionTypeController } from '@depresion_type/interface_adapters/web/depresion_type_controller';
import { Router } from 'express';
import checkPermissions from '@fnd/web/middlewares/auth/check_permissions';
import filter from '@fnd/web/middlewares/validators/build_filters/depresion_type/depresion_type_filter';

const controller = new DepresionTypeController();

const router = Router();

router.post('/create-one', checkPermissions(true), controller.createOne);
router.get('/get-all', checkPermissions(false), filter, controller.getAll);

export { router };
