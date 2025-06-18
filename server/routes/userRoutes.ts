import { Router } from 'express';
import verifyToken from '../middleware/verifyToken';
import {
  deleteUser,
  updateUserName,
  updateUsername,
  updatePassword,
} from '../controllers/userController';

const router: Router = Router();

router.delete('/', verifyToken, deleteUser);
router.put('/update-name', verifyToken, updateUserName);
router.put('/update-username', verifyToken, updateUsername);
router.put('/update-password', verifyToken, updatePassword);

export default router;