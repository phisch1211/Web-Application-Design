const express = require('express')

const router = express.Router()

const { MongoClient} = require('mongodb');

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

async function newUser(email,password,token,admin)
{
  const url = 'mongodb://Philipp:dim1.PWfdMDB!@localhost:27017/LLL'; // Adjust if using a different host/port
  const dbName = 'BlindBookShopping'; // Use your desired database name
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);
  var vector = await db.collection("Users").find({}).toArray();
  var found = false;
  let i=0;
  while(!found&&i<vector.length)
  {
    if(vector[i].email==email)
    {found = true}
    i++;
  }
  if(found)
  {
    return false;
  }
  else
  {
    let timeout=new Date(Date.now());
    let temp=timeout.getMinutes()
    timeout.setMinutes(temp+30)
    vector[0].timeout=timeout.getTime()
    timeout=Date.now()+(30*60*1000)
    db.collection("Users").insertOne({email,password,admin,token, timeout})
    return true;
  }
}

async function getCreatorID(Email)
{
  const url = 'mongodb://Philipp:dim1.PWfdMDB!@localhost:27017/LLL'; // Adjust if using a different host/port
  const dbName = 'BlindBookShopping'; // Use your desired database name
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);
  var vector = await db.collection("Users").find({email:Email}).toArray();
  if(vector.length>0)
  {
    return vector[0]._id
  }
  else return "0";
}

async function existingUser(Email,Password)
{
  const url = 'mongodb://Philipp:dim1.PWfdMDB!@localhost:27017/LLL'; // Adjust if using a different host/port
  const dbName = 'BlindBookShopping'; // Use your desired database name
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);
  var vector = await db.collection("Users").find({email:Email,password:Password}).toArray();
  if(vector.length==1)
  {
  let TOKEN_SECRET = process.env.TOKEN_SECRET;
    if (!TOKEN_SECRET) {
       TOKEN_SECRET = crypto.randomBytes(64).toString('hex');
       console.log('Generated Token Secret:', TOKEN_SECRET);
    }
    var token = jwt.sign({Email, Password}, TOKEN_SECRET, { expiresIn: '1800s' });
    vector[0].token=token
    let timeout=new Date(Date.now());
    let temp=timeout.getMinutes()
    timeout.setMinutes(temp+30)
    vector[0].timeout=timeout.getTime()
    await db.collection("Users").replaceOne({email:Email,password:Password},vector[0])
    return {Email,Password,token,id:vector[0]._id};
  }
  return {Email,Password,token:false};
}

router.get("/", async (req,res)=>{
  const {token}=req.headers;
  const url = 'mongodb://Philipp:dim1.PWfdMDB!@localhost:27017/LLL'; // Adjust if using a different host/port
  const dbName = 'BlindBookShopping'; // Use your desired database name
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);
  var vector = await db.collection("Users").find({token:token}).toArray();
  var vector2=false
  if(vector.length>0)
  {
    if(vector[0].admin)
    {
      let timeout=new Date(Date.now());
      let temp=timeout.getMinutes()
      timeout.setMinutes(temp+30)
      vector[0].timeout=timeout.getTime()
      await db.collection("Users").replaceOne({token:token},vector[0])
      vector2 = await db.collection("Users").find({}).toArray();
    }
  }
  if(vector2)
    res.status(200).json({users:vector2})
  else if(vector.length>0)
    res.status(200).json({user:vector[0]})
  else
    res.status(401).json({message:"user is not logged in"})
  await client.close();
})

router.get("/:user_id", async (req,res)=>{
  const {token,user}=req.headers;
  const url = 'mongodb://Philipp:dim1.PWfdMDB!@localhost:27017/LLL'; // Adjust if using a different host/port
  const dbName = 'BlindBookShopping'; // Use your desired database name
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);
  var vector = await db.collection("Users").find({token:token}).toArray();
  var vector2=false
  if(vector.length>0)
  {
    if(vector[0].admin||user==vector[0])
    {
      let timeout=Date(Date.now()+(30*60*1000));
      vector[0].timeout=timeout
      await db.collection("Users").replaceOne({token:token},vector[0])
      vector2 = await db.collection("Users").find({}).toArray();
    }
  }
  if(vector2)
    res.status(200).json({user:vector2[0]})
  else if(vector.length>0)
    res.status(401).json({message: "only admin can use this"})
  else
    res.status(404).json({message:"user not found"})
  await client.close();
})

router.delete("/", async (req,res)=>{
  const {token} = req.headers
  var Token =token
  const url = 'mongodb://Philipp:dim1.PWfdMDB!@localhost:27017/LLL'; // Adjust if using a different host/port
  const dbName = 'BlindBookShopping'; // Use your desired database name
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);
  var vector = await db.collection("Users").find({token:Token}).toArray();
  if(vector.length==1)
  {
    vector[0].token=false;
    await db.collection("Users").replaceOne({token:Token},vector[0])
    res.status(200).json({
      message: 'Logged out',
      data: {email:vector[0].email, password:vector[0].password, _id:vector[0]._id}
    });
  }
  else
  {
    res.status(400).json({
      message: 'Log-out not possible'
    });
  }
})

router.post('/', async (req, res) => {
  const {email,password, confirm, admin} = req.body;

  // Here you would typically validate the user credentials
  // For simplicity, we'll assume validation is successful
  if (email&&password&&password===confirm) {
    let TOKEN_SECRET = process.env.TOKEN_SECRET;
    if (!TOKEN_SECRET) {
       TOKEN_SECRET = crypto.randomBytes(64).toString('hex');
       console.log('Generated Token Secret:', TOKEN_SECRET);
    }
    var token = jwt.sign({ email, password,admin }, TOKEN_SECRET, { expiresIn: '1800s' });
    console.log('Generated JWT Token:', token);
    let created=await newUser(email,password, token, admin);
    if(created)
    {
      var status=201;
      var message="Creating account successful";
    }
    else{
      var status=403;
      var message="Creating account failed, email is already used";
      token=false;
    }
    res.status(status).json({
      message,
      data: {
        email,
        password,
        confirm,
        admin,
        token,
        creatorID:await getCreatorID(email)
      }
    });
  } else if(password==confirm){
    res.status(400).json({
      message: 'Invalid request data'
    });
  }
    else
    {
      res.status(401).json({
        message: 'Password and confirmation are not the same'
      });
    }
});

router.put('/', async (req, res) => {
    const {email,password} = req.body;
    var found = await existingUser(email, password);
    if (found.token) {
      res.status(200).json({
        message: 'Login successful',
        data: found
      });
    } else {
      res.status(400).json({
        message: "Login Failed",
        data:found
      });
    }
  });

module.exports = router
