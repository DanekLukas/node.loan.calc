import express from 'express'
import * as path from 'path'
import url from 'url'
import fs from 'fs'

const app = express()
const protocol = process.env.PROTOCOL === 'https' ? 'https' : 'http'
const http = require(protocol).Server(app)

const hostname = process.env.HOSTNAME || '127.0.0.1'
const port = process.env.PORT || 8000

app.set('protocol', protocol)
app.set('port', port)
app.set('host', '0.0.0.0')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'static')))

app.get('*', async (req, res) => {
  const  parsedUrl = url.parse(req.url, true)
  if(parsedUrl === null) {
    res.sendFile('index.html', {'root': __dirname})
    return
  } 
  const path = [__dirname,parsedUrl!.path.replace(/^\/+|\/+$/g,"")].join('/')
  if(path === '' || (()=>{fs.access(path, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(err)
      return true
    }
  })
  return true
  })())
    res.sendFile(path)
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


http.listen(port, () => {
  console.log(`Socket server running at ${protocol}://0.0.0.0:${port}/`)
})
