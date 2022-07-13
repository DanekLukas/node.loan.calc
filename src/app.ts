import express from 'express'
import url from 'url'
import fs from 'fs'

const app = express()
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

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
const publicDir = __dirname+'/../www'
app.use(express.static(publicDir))
app.get('*', async (req, res) => {
  const  parsedUrl = url.parse(req.url, true)
  if(parsedUrl === null) {
    res.sendFile(publicDir+'index.html')
    return
  } 
  const file = __dirname+parsedUrl!.path.replace(/^\/+|\/+$/g,"")
  if(file === '' || (()=>{fs.access(file, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(err)
      return true
    }
  })
  return true
  })())
    res.sendFile(file)
})

app.post('/calc', (req, res) => {
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
