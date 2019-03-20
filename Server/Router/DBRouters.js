import express from 'express';
import groupController from '../Controllers/groupController';
import Validator from '../Middleware/validator';
import Auth from '../Middleware/authenticate';
import DBUserController from '../Controllers/DB/DBUserController';
import DBMsgController from '../Controllers/DB/DBMsgController';

const router = express();

router.get('/', DBUserController.welcome);

router.post('/auth/signup', Validator.validateSignup, DBUserController.signup);
router.post('/auth/login', Validator.validateLogin, DBUserController.login);
router.post('/messages', Auth, Validator.validateMessage, DBMsgController.newMessage);
router.get('/messages', Auth, DBMsgController.receivedMessage);
router.get('/messages/unread', Auth, DBMsgController.unreadMessage);
router.get('/messages/sent', Auth, DBMsgController.sentMessage);
router.get('/messages/draft', Auth, DBMsgController.draftMessage);
router.get('/messages/:id', Auth, DBMsgController.specificMessage);
router.delete('/messages/:id', Auth, DBMsgController.deleteMessage);
router.put('/user/update', Auth, Validator.validateProfile, DBUserController.updateProfile);
router.post('/groups', Auth, Validator.validateNewGroup, groupController.newGroup);
router.get('/groups', Auth, groupController.getGroup);
router.patch('/groups/:id', Auth, Validator.validateUpdateGroup, groupController.updateName);
router.delete('/groups/:id', Auth, groupController.deleteGroup);
router.delete('/groups/:groupId/users/:userToDeleteId', Auth, groupController.deleteUser);
router.post('/groups/:groupId/messages', Auth, Validator.validateGroupMsg, groupController.msgGroup);
router.post('/groups/:groupId/users', Auth, Validator.validateAddGroupUsers, groupController.addGroupUser);
export default router;
