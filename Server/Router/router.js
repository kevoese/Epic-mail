import express from 'express';
import Controller from '../Controllers/controller';
import Validator from '../Middleware/validator';

const router = express();

router.get('/', Controller.welcome);

router.post('/auth/signup', Validator.validateSignup, Controller.signup);

export default router;
