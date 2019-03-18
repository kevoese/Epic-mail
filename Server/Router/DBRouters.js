import express from 'express';
// import userController from '../Controllers/controller';
import Validator from '../Middleware/validator';
import Auth from '../Middleware/authenticate';
import DBUserController from '../Controllers/DB/DBUserController';
import DBMsgController from '../Controllers/DB/DBMsgController';

const router = express();

router.get('/', DBUserController.welcome);

router.post('/auth/signup', Validator.validateSignup, DBUserController.signup);
router.post('/auth/login', Validator.validateLogin, DBUserController.login);
export default router;
