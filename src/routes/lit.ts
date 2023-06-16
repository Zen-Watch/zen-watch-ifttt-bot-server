import express, { Request, Response } from 'express';
import dotenv from 'dotenv'; 
import { STATUS_OK, X_API_KEY_HEADER } from '../utils/constants';
import { handle_sign_and_send_general_ethereum_txn_payload } from '../handlers/lit.handler';
dotenv.config();

const router = express.Router()

router.get('/healthz', (req, res) => {
    res.status(STATUS_OK).send('hello world from lit!!');
})

router.post('/sign_and_send/ethereum/txn/payload', (req:Request, res:Response) => {
    handle_sign_and_send_general_ethereum_txn_payload(req.body)
    .then(_res => res.status(_res.status).send(_res))
})

module.exports = router

