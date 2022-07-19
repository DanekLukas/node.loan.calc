import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import fs from 'fs'

dotenv.config();

const app: Express = express()
const protocol = process.env.PROTOCOL || 'http'
const port = process.env.PORT || 8080
const host = process.env.HOST || '0.0.0.0'
app.set('protocol', protocol)
app.set('credentials', app.get('protocol')==='https' ? {
  key: fs.readFileSync(process.env.PRIVATE_KEY || '', 'utf8'),
  cert: fs.readFileSync(process.env.CERTIFICATE || '', 'utf8')
} : undefined );
app.set('port', port);
app.set('host', host);

app.use('/', express.static('www'));
app.use(express.json())
app.post('/calc', (req: Request, res: Response) => {
  const LoanCalc = require('loan-calc')
  try{
    const result:number = LoanCalc.paymentCalc({
      amount: req.body.amount,
      rate: req.body.rate,
      termMonths: req.body.termMonths
  })
  res.send(JSON.stringify({data: result}))
}catch(err) {
    res.send(JSON.stringify({error: (err as Error).message}))
  }

})
const http = require(protocol).Server(app)
http.listen(port, () => {
  console.log(`Socket server running at ${protocol}://${host}:${port}/`)
})
