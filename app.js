const path = require("path")
var express = require('express')
var cors = require('cors')
var app = express()
const mongose = require("mongoose")
const env = require("dotenv")
const message = require('./models/message')
const { IgApiClient } = require('instagram-private-api')
env.config()
app.use(cors())
app.use(express.json())
const PORT = 3000 || process.env.PORT;
let cb;

mongose.connect(process.env.MONGO_URL)
.then(()=>{console.log("[+ DB CONNECTED! +]")})

app.use(express.static(path.join(__dirname, 'public')));

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,'public','index.html'))
})


app.get("/stop",async (req,res,next)=>{
    try{
      cb = null
      return res.json("Session Closed!")
    }catch{
      console.log("error")
    }
})
// start chating...
app.get('/start/:id', async function  (req, res, next) {
    try{
        console.log("[+ CHAT IS ON ! +]")
        console.log("[+ Login..... +]")
        const ig = new IgApiClient()
        await ig.state.generateDevice(process.env.USERNAME)
        await ig.account.login(process.env.MY_USERNAME,process.env.MY_PASSWORD)
        console.log("[+ login Success! +]")
        cb = setInterval(async ()=>{
          const msg = await message.find()
          if(msg[0].message.length < 1){
            clearInterval(cb)
            console.log("[+ NO MESSAGE FOUNDED ! +]")
            return res.json("No messages found")
          }
          if(cb == null){
            console.log("[+ CHAT IS OFF +]")
            return res.end("Session Closed!")
          }
        //perviuos login command code --
          const user = await ig.user.searchExact('amine.bouzaid_')
          console.log("[+ User Found +]")
          await ig.entity.directThread([user.pk.toString()]).broadcastText(`${msg[0].message[0]}`)
          console.log("[+ Message Sent ! +]")
          const rm = await message.findByIdAndUpdate(req.params.id,{$pull:{message : msg[0].message[0]}})
        },150000)
      }catch{(err)=>{
        console.log(`Err => Automated Catched || tyr login manual !! \n ${err}`)
      }
  }})
   
  
  // get messagess
  app.get('/:id', async (req,res,next)=>{
    try{
      const msg = await message.find({_id:req.params.id})
      res.json(msg[0].message)
    }catch{
      res.json({msg: 'No messages found!'})
    }
  })
  
  //add message
  app.put("/:id",async function (req,res,next){
    const ms = await message.findByIdAndUpdate(req.params.id,{$push:{message:req.body.message}})
    res.json(ms)
  })



app.listen(PORT,()=>{
    console.log("Server is runnig on PORT",PORT)
})
