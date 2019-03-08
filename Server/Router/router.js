import express from 'express';
import Controller from '../Controllers/controller';
import Validator from '../Middleware/validator';
import messageController from '../Controllers/messageControllers';

const router = express();

router.get('/', Controller.welcome);

router.post('/auth/signup', Validator.validateSignup, Controller.signup);
router.post('/auth/login', Validator.validateLogin, Controller.login);
router.post('/messages', Validator.validateMessage, messageController.newMessage);
router.get('/messages', messageController.allMessage);

export default router;
