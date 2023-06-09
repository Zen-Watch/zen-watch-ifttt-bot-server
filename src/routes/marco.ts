import express, { Request, Response } from 'express';
import dotenv from 'dotenv'; 
import { STATUS_OK, X_API_KEY_HEADER } from '../utils/constants';
import { handle_email_notification } from '../handlers/email_notification.handler';
dotenv.config();

const router = express.Router()

router.get('/healthz', (req, res) => {
    res.status(STATUS_OK).send('hello world!!');
})

router.post('/notify/email', (req:Request, res:Response) => {
    handle_email_notification(req.body)
    .then(_res => res.status(_res.status).send(_res))
})

module.exports = router

