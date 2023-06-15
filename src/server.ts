import express, { Request, Response, NextFunction } from 'express';
import dotenv from "dotenv";
import cors from "cors";
import { INVALID_API_KEY, STATUS_OK, UNAUTHORIZED_ACCESS, X_API_KEY_HEADER } from './utils/constants';

dotenv.config();
const app = express();

const options: cors.CorsOptions = {
  origin: '*',
  methods: ['GET', 'POST']
};

// Then pass these options to cors:
app.use(cors(options));

app.use(express.json());

// Unprotected endpoint for LB health check
app.get('/lb/healthz', (req, res) => {
  res.status(STATUS_OK).send('ok!!');
})

// Only allow whitelisted api keys to access the api
function authenticate_whitelisted_api_key(req: Request, res: Response, next: NextFunction) {
  try {
    const api_key = req.header(X_API_KEY_HEADER)!
    if (api_key === process.env.ALLOWED_API_KEY_REAL)
      next()
    else
      res.status(UNAUTHORIZED_ACCESS).send({ status: UNAUTHORIZED_ACCESS, message: INVALID_API_KEY })
  } catch (err) {
    res.status(UNAUTHORIZED_ACCESS).send({ status: UNAUTHORIZED_ACCESS, message: INVALID_API_KEY })
  }
}

app.use(authenticate_whitelisted_api_key);

const marcoRouter = require("./routes/marco");
app.use("/marco", marcoRouter);

const litRouter = require("./routes/lit");
app.use("/lit", litRouter);

app.listen(process.env.SERVER_PORT, () => console.log("Server Started!!"));
