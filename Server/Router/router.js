import express from 'express';
import userController from '../Controllers/controller';
import Validator from '../Middleware/validator';
import messageController from '../Controllers/messageControllers';

const router = express();

router.get('/', userController.welcome);

router.post('/auth/signup', Validator.validateSignup, userController.signup);
router.post('/auth/login', Validator.validateLogin, userController.login);
router.post('/messages', Validator.validateMessage, messageController.newMessage);
router.get('/messages', messageController.receivedMessage);
router.get('/messages/unread', messageController.unreadMessage);
router.get('/messages/sent', messageController.sentMessage);
router.get('/messages/draft', messageController.draftMessage);
router.get('/messages/:id', messageController.specificMessage);
router.delete('/messages/:id', messageController.deleteMessage);
router.put('/update', Validator.validateProfile, userController.updateProfile);

export default router;
