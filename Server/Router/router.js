import express from 'express';
import userController from '../Controllers/controller';
import Validator from '../Middleware/validator';
import messageController from '../Controllers/messageControllers';
import Auth from '../Middleware/authenticate';

const router = express();

router.get('/', userController.welcome);

router.post('/auth/signup', Validator.validateSignup, userController.signup);
router.post('/auth/login', Validator.validateLogin, userController.login);
router.post('/messages', Auth, Validator.validateMessage, messageController.newMessage);
router.get('/messages', Auth, messageController.receivedMessage);
router.get('/messages/unread', Auth, messageController.unreadMessage);
router.get('/messages/sent', Auth, messageController.sentMessage);
router.get('/messages/draft', Auth, messageController.draftMessage);
router.get('/messages/:id', Auth, messageController.specificMessage);
router.delete('/messages/:id', Auth, messageController.deleteMessage);
router.put('/update', Auth, Validator.validateProfile, userController.updateProfile);

export default router;
