import express from 'express';
import groupController from '../Controllers/groupController';
import Validator from '../Middleware/validator';
import Auth from '../Middleware/authenticate';

const router = express();

router.post('/groups', Auth, Validator.validateNewGroup, groupController.newGroup);

export default router;
