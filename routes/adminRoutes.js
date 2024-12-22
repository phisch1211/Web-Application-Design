const express = require('express')

const { MongoClient} = require('mongodb');
const router = express.Router()

async function validateADMToken(token)
{
  const url = 'mongodb://Philipp:dim1.PWfdMDB!@localhost:27017/LLL'; // Adjust if using a different host/port
  const dbName = 'BlindBookShopping'; // Use your desired database name
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);
  var vector = await db.collection("Users").find({token:token}).toArray();
  await client.close();
  if(vector.length>0)
  {
    if(vector[0].admin&&Date.now()<=vector[0].timeout)
    {
      let timeout=new Date(Date.now());
      let temp=timeout.getMinutes()
      timeout.setMinutes(temp+30)
      vector[0].timeout=timeout.getTime()
      await db.collection("Users").replaceOne({token:token},vector[0])
      return true;
    }
  }
  return false;
}

async function deleteUser(mail, ID)
{
  const url = 'mongodb://Philipp:dim1.PWfdMDB!@localhost:27017/LLL'; // Adjust if using a different host/port
  const dbName = 'BlindBookShopping'; // Use your desired database name
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);
  var vector = await db.collection("Users").find({email:mail}).toArray();
  if(vector.length>0)
  {
    await db.collection("Users").deleteOne({email:mail})
    await client.close();
    return true;
  }
  vector = await db.collection("Users").find({_id:ID}).toArray();
  if(vector.length>0)
  {
    await db.collection("Users").deleteOne({_id:ID})
    await client.close();
    return true;
  }
  await client.close();
  return false;
}

async function updateUser(password, ID)
{
  const url = 'mongodb://Philipp:dim1.PWfdMDB!@localhost:27017/LLL'; // Adjust if using a different host/port
  const dbName = 'BlindBookShopping'; // Use your desired database name
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);
  let result=false
  var vector = await db.collection("Users").find({}).toArray();
  for(let i=0;i<vector.length;i++)
  {
    if(vector[i]._id==ID)
      result=vector[i]
  }
  if(result)
  {
    result.password=password
    await db.collection("Users").replaceOne({email:result.email},result)
    await client.close();
    return true;
  }
  await client.close();
  return false;
}

router.get("/", (req,res)=>{
    res.send('handling admin routes')
})

router.delete('/user', async (req, res) => {
    const {email,userID, adminID} = req.body;
    const {token}=req.headers;
  
    // Here you would typically validate the user credentials
    // For simplicity, we'll assume validation is successful
    if ((email||userID)&&adminID) {
      if(! await validateADMToken(token)&&adminID==userID)
      {var message="you need to log-in an admin account"
       var status=401
      }
      else
      {
        if(await deleteUser(email,userID))
        {
          var message="user deleted"
          var status=200
        }
        else
        {
          var message="user does not exist"
          var status=404
        }
      }
      res.status(status).json({
        message,
        data: {
          email,
          userID,
          adminID,
          token
        }
      });
    } else {
      res.status(400).json({
        message: 'Invalid request data',
        data: {
          email,
          userID,
          adminID,
          token
        }
      });
    }
  });

router.put('/user', async (req, res) => {
    const {userID, adminID, password} = req.body;
    const {token}=req.headers;
  
    // Here you would typically validate the user credentials
    // For simplicity, we'll assume validation is successful
    if ((userID)&&adminID&&token&&password) {
      if(! await validateADMToken(token)&&adminID==userID)
      {var message="you need to log-in an admin account"
       var status=401
      }
      else
      {
        if(await updateUser(password,userID))
        {
          var message="password updated"
          var status=200
        }
        else
        {
          var message="user does not exist"
          var status=404
        }
      }
      res.status(status).json({
        message,
        data: {
          userID,
          adminID,
        }
      });
    } else {
      res.status(400).json({
        message: 'Invalid request data',
        data: {
          password,
          userID,
          adminID
        }
      });
    }
  });

  router.delete('/remove-book', (req, res) => {
    const {title} = req.body;
  
    // Here you would typically validate the user credentials
    // For simplicity, we'll assume validation is successful
    if (title) {
      res.status(200).json({
        message: 'Book Deleted',
        data: {
          title,
          BookID:"1234"
        }
      });
    } else {
      res.status(400).json({
        message: 'Invalid request data'
      });
    }
  });
  
  module.exports = router