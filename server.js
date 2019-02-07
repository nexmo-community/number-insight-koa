require('dotenv').config()
const Koa = require('koa')
const serve = require('koa-static')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')
const Nexmo = require('nexmo')

const nexmo = new Nexmo({
  apiKey: process.env.NEXMO_API_KEY,
  apiSecret: process.env.NEXMO_API_SECRET
})

const app = new Koa()
const router = new Router()
app.use(serve('./public'))
app.use(bodyParser())

router.post('/submit', async (ctx, next) => {
  const payload = await ctx.request.body
  const number = await payload.phone

  const insight = await getInsight(number)
  ctx.status = 200
  ctx.body = insight
})

async function getInsight(number) {
  return new Promise(function(resolve, reject){
    nexmo.numberInsight.get({
      level: 'basic', 
      number: number,
    }, (error, result) => {
      if (error) {
        console.error(error)
        reject(error)
      }  
      else {
        console.error(result)
        resolve(result)
      }
    })
  })
}

app.use(router.routes()).use(router.allowedMethods())

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port)
})
