const express = require('express');
const app = express();

const { MongoClient} = require('mongodb');
const router = express.Router();
const bookRoutes = require('./bookRoutes');

async function authenticateUser(jwt, ID)
{
  const url = 'mongodb://Philipp:dim1.PWfdMDB!@localhost:27017/LLL'; // Adjust if using a different host/port
  const dbName = 'BlindBookShopping'; // Use your desired database name
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);
  var vector = await db.collection("Users").find({token:jwt}).toArray();
  await client.close();
  if(vector.length>0)
  {
    let temp=vector[0]._id
    if(temp&&vector[0].timeout+(30*60*1000)>Date.now())
      { 
        let timeout=new Date(Date.now());
        let temp=timeout.getMinutes()
        timeout.setMinutes(temp+30)
        vector[0].timeout=timeout.getTime()
        await client.connect();
        await db.collection("Users").replaceOne({token:jwt},vector[0])
        return true;
      }
  }
  return false;
}

async function isAdmin(ID)
{ 
const url = 'mongodb://Philipp:dim1.PWfdMDB!@localhost:27017/LLL'; // Adjust if using a different host/port
const dbName = 'BlindBookShopping'; // Use your desired database name
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
await client.connect();
const db = client.db(dbName);
var vector = await db.collection("Users").find({}).toArray();
var result=false
for(let i=0; i<vector.length;i++)
{
  if(vector[i]._id==ID)
    result=true
}
await client.close();
return result;
}

async function addGenre(name, info, creator)
{
  const url = 'mongodb://Philipp:dim1.PWfdMDB!@localhost:27017/LLL'; // Adjust if using a different host/port
  const dbName = 'BlindBookShopping'; // Use your desired database name
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);
  var vector = await db.collection("Genres").find({title:name}).toArray();
  if (vector.length<1)
  {
    await db.collection("Genres").insertOne({title:name, description:info, createdBy:creator})
    await client.close();
    return true;
  }
  await client.close();
  return false;
}

async function deleteGenre(genre, user)
{
  const url = 'mongodb://Philipp:dim1.PWfdMDB!@localhost:27017/LLL'; // Adjust if using a different host/port
  const dbName = 'BlindBookShopping'; // Use your desired database name
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);
  var vector = await db.collection("Genres").find({}).toArray();
  var result=false
  for(let i=0; i<vector.length; i++)
  {
    if(vector[i]._id==genre)
      result=vector[i]
  }
  if(!result)
  {
    return false;
  }
  if(user==result.createdBy||await isAdmin(user))
  {
    await db.collection("Genres").deleteOne({title:result.title})
    client.connect()
    await db.collection("Books").deleteOne({genre:result._id})
    client.connect()
    await db.collection("Reviews").deleteOne({genre:result._id})
    return true
  }
  result.requestDelete=true;
  await db.collection("Genres").replaceOne({title:result.title},{result})
  await client.close()
  return false
}

async function updateGenre(id, creatorID, name, info)
{
  const url = 'mongodb://Philipp:dim1.PWfdMDB!@localhost:27017/LLL'; // Adjust if using a different host/port
  const dbName = 'BlindBookShopping'; // Use your desired database name
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);
  var vector = await db.collection("Genres").find({}).toArray();
  var result=false
  for(let i=0; i<vector.length; i++)
  {
    if(vector[i]._id==id)
      result=vector[i]
  }
  if(!result)
  {
    return false;
  }
  if(creatorID==result.createdBy||await isAdmin(creatorID))
  {
    temp=result.title;
    result.description=info;
    result.title=name;
    await db.collection("Genres").replaceOne({title:temp},result)
    return true
  }
  await client.close()
  return false
}

async function genreExists(id)
{
  const url = 'mongodb://Philipp:dim1.PWfdMDB!@localhost:27017/LLL'; // Adjust if using a different host/port
  const dbName = 'BlindBookShopping'; // Use your desired database name
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);
  var vector = await db.collection("Genres").find({}).toArray();
  let result=false
  for(let i=0;i<vector.length;i++)
  {
    if (vector[i]._id==id)
      result=true
  }
  return result
}

async function bookExists(id)
{
  const url = 'mongodb://Philipp:dim1.PWfdMDB!@localhost:27017/LLL'; // Adjust if using a different host/port
  const dbName = 'BlindBookShopping'; // Use your desired database name
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);
  var vector = await db.collection("Books").find({}).toArray();
  let result=false
  for(let i=0;i<vector.length;i++)
  {
    if (vector[i]._id==id)
      result=true
  }
  return result
}

async function reviewExists(id)
{
  const url = 'mongodb://Philipp:dim1.PWfdMDB!@localhost:27017/LLL'; // Adjust if using a different host/port
  const dbName = 'BlindBookShopping'; // Use your desired database name
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);
  var vector = await db.collection("Reviews").find({}).toArray();
  let result=false
  for(let i=0;i<vector.length;i++)
  {
    if (vector[i]._id==id)
      result=true
  }
  return result
}

async function addBook(name, info,address, creator, genre)
{
  const url = 'mongodb://Philipp:dim1.PWfdMDB!@localhost:27017/LLL'; // Adjust if using a different host/port
  const dbName = 'BlindBookShopping'; // Use your desired database name
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);
  await db.collection("Books").insertOne({title:name, description:info,link:address, createdBy:creator, genre:genre})
  await client.close();
  return true;
}

async function updateBook(id, creatorID,genre, name, info)
{
  const url = 'mongodb://Philipp:dim1.PWfdMDB!@localhost:27017/LLL'; // Adjust if using a different host/port
  const dbName = 'BlindBookShopping'; // Use your desired database name
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);
  var vector = await db.collection("Books").find({}).toArray();
  var result=false
  for(let i=0; i<vector.length; i++)
  {
    if(vector[i]._id==id)
      result=vector[i]
  }
  if(creatorID==result.createdBy||await isAdmin(creatorID))
  {
    temp=result.title;
    result.description=info;
    result.title=name;
    if(await genreExists(genre))
      result.genre=genre
    await db.collection("Books").replaceOne({title:temp},result)
    return true
  }
  await client.close()
  return false
}

async function updateReview(id, creatorID, name, info)
{
  const url = 'mongodb://Philipp:dim1.PWfdMDB!@localhost:27017/LLL'; // Adjust if using a different host/port
  const dbName = 'BlindBookShopping'; // Use your desired database name
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);
  var vector = await db.collection("Reviews").find({}).toArray();
  var result=false
  for(let i=0; i<vector.length; i++)
  {
    if(vector[i]._id==id)
      result=vector[i]
  }
  if(creatorID==result.createdBy||await isAdmin(creatorID))
  {
    temp=result.title;
    result.description=info;
    result.title=name;
    await db.collection("Reviews").replaceOne({title:temp},result)
    return true
  }
  await client.close()
  return false
}

async function deleteBook(book, user)
{
  const url = 'mongodb://Philipp:dim1.PWfdMDB!@localhost:27017/LLL'; // Adjust if using a different host/port
  const dbName = 'BlindBookShopping'; // Use your desired database name
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);
  var vector = await db.collection("Books").find({}).toArray();
  var result=false
  for(let i=0; i<vector.length; i++)
  {
    if(vector[i]._id==book)
      result=vector[i]
  }
  if(!result)
  {
    return false;
  }
  if(user==result.createdBy||await isAdmin(user))
  {
    await db.collection("Books").deleteOne({title:result.title})
    client.connect()
    await db.collection("Reviews").deleteOne({genre:result._id})
    return true
  }
  result.requestDelete=true;
  await db.collection("Genres").replaceOne({title:result.title},{result})
  await client.close()
  return false
}

async function addReview(name, info,rating, creator, genre, book)
{
  const url = 'mongodb://Philipp:dim1.PWfdMDB!@localhost:27017/LLL'; // Adjust if using a different host/port
  const dbName = 'BlindBookShopping'; // Use your desired database name
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);
  var vector = await db.collection("Reviews").find({title:name}).toArray();
  await db.collection("Reviews").insertOne({title:name, description:info, createdBy:creator, genre:genre,book:book, rating})
  await client.close();
  return true;
}

async function deleteReview(review, user)
{
  const url = 'mongodb://Philipp:dim1.PWfdMDB!@localhost:27017/LLL'; // Adjust if using a different host/port
  const dbName = 'BlindBookShopping'; // Use your desired database name
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);
  var vector = await db.collection("Reviews").find({}).toArray();
  var result=false
  for(let i=0; i<vector.length; i++)
  {
    if(vector[i]._id==review)
      result=vector[i]
  }
  if(!result)
  {
    return false;
  }
  if(user==result.createdBy||await isAdmin(user))
  {
    await db.collection("Reviews").deleteOne({title:result.title})
    return true
  }
  result.requestDelete=true;
  await db.collection("Reviews").replaceOne({title:result.title},{result})
  await client.close()
  return false
}

app.use(express.json()); // For parsing application/json

// Use bookRoutes for book-related routes

router.get('/', async (req, res) => {
  const {token, creatorID}=req.headers;
  if(await authenticateUser(token,creatorID)){
  const url = 'mongodb://Philipp:dim1.PWfdMDB!@localhost:27017/LLL'; // Adjust if using a different host/port
  const dbName = 'BlindBookShopping'; // Use your desired database name
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);
  var vector = await db.collection("Genres").find({}).toArray();
  await client.close();
  if(vector.length>0)
    res.status(200).json({genreList: vector});
  else
    res.status(404).json({message:"no genres found"})}
  else{res.status(401).json({message:"client is not logged in"})}
});

router.get('/:genre_id', async (req, res) => {
  const genre_id = req.params.genre_id;
  const {token, creatorID}=req.headers;
  if(authenticateUser(token, creatorID)){
  const url = 'mongodb://Philipp:dim1.PWfdMDB!@localhost:27017/LLL'; // Adjust if using a different host/port
  const dbName = 'BlindBookShopping'; // Use your desired database name
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);
  var vector = await db.collection("Genres").find({}).toArray();
  var result=false
  for(let i=0; i<vector.length; i++)
  {
    if(vector[i]._id==genre_id)
      result=vector[i]
  }
  await client.close();
  if(result)
    res.status(200).json({message:"genre found",genre:result});
  else 
    res.status(404).json({message:"genre not found", id:genre_id})}
  else{res.status(401).json({message:"user is not logged in"})}
});

router.put('/:genre_id',async (req, res) => {
  const genre_id = req.params.genre_id;
  const { title, definition, creatorID} = req.body;
  const {token}=req.headers;
  data={genre_id, title,definition,creatorID}
  var exists=await genreExists(genre_id)
  if (creatorID&&token&&exists) {
    if(! await authenticateUser(token,creatorID))
    {
      res.status(401).json({
        message: 'User is not logged in',
        data})}
    else{
      if(await updateGenre(genre_id, creatorID ,title, definition))
      {
        res.status(200).json({
          message: 'Updating successful',
          data});}
    else{
      res.status(403).json({
        message: 'you can not update this genre',
        data});
    }}} else {
      if(exists)
    res.status(400).json({
      message: 'Invalid request data',
      data});
    else
    res.status(404).json({
      message: 'Genre does not exist',
      data});
  }});

router.post('/', async (req, res) => {
  const { title, definition, creatorID} = req.body;
  const {token}=req.headers;
  data={title,definition,creatorID}
  if (!!title && !!definition&&creatorID&&token) {
    if(! await authenticateUser(token,creatorID))
    {
      res.status(401).json({
        message: 'User is not logged in',
        data})}
    else{
      if(await addGenre(title, definition, creatorID))
      {
        res.status(201).json({
          message: 'Adding successful',
          data});}
    else{
      res.status(405).json({
        message: 'Genre already exists',
        data});
    }}} else {
    res.status(400).json({
      message: 'Invalid request data',
      data});}});

router.delete('/:genre_id', async (req, res) => {
  const genre_id = req.params.genre_id;
  const {creatorID} = req.body;
  const {token}=req.headers;
  data={genre_id,creatorID}
  if (creatorID&&token) {
    if(! await authenticateUser(token,creatorID))
    {
      res.status(401).json({
        message: 'User is not logged in',
        data})}
    else{
      if(await deleteGenre(genre_id, creatorID))
      {
        res.status(200).json({
          message: 'Deleting successful',
          data});}
    else{
      if(! await isAdmin(creatorID))
      {
      res.status(403).json({
        message: 'you can not delete this genre, because it is not yours',
        data});}
        else
        {
          res.status(404).json({
            message: 'you can not delete this genre, because it does not exist',
            data}) 
        }
    }}} else {
    res.status(400).json({
      message: 'Invalid request data',
      data});}});


router.get("/:genre_id/books", async (req,res)=>{
  const genre_id = req.params.genre_id;
  const {token, creatorID} = req.headers;
  if(authenticateUser(token, creatorID)){
  const url = 'mongodb://Philipp:dim1.PWfdMDB!@localhost:27017/LLL'; // Adjust if using a different host/port
  const dbName = 'BlindBookShopping'; // Use your desired database name
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);
  var vector = await db.collection("Books").find({genre:genre_id}).toArray();
  await client.close();
  if(vector.length>0)
  res.status(200).json({ bookList: vector});
  else if(!await genreExists(genre_id))
  res.status(404).json({message:"genre does not exist"})
  else
  res.status(404).json({message:"genre does not have any books"})}
  else
    res.status(401).json({message:"user is not logged in"})
  })

router.get("/:genre_id/books/:book_id", async (req, res) => {
    const book_id = req.params.book_id;
    const genre_id = req.params.genre_id;
    const {token, creatorID}=req.headers
    if(authenticateUser(token,creatorID)){
    const url = 'mongodb://Philipp:dim1.PWfdMDB!@localhost:27017/LLL'; // Adjust if using a different host/port
    const dbName = 'BlindBookShopping'; // Use your desired database name
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db(dbName);
    var vector = await db.collection("Books").find({genre:genre_id}).toArray();
    var result=false
    for (let i =0;i<vector.length;i++)
    {
      if (vector[i]._id==book_id)
        result=vector[i]
    }
    await client.close();
    if(!result)
    {
      if(await genreExists(genre_id))
        res.status(404).json({message:"book does not exist", genre:genre_id, book:book_id});
      else
        res.status(404).json({message:"genre does not exist", genre:genre_id});
    }
    else
      res.status(200).json(result);}
    else
    res.status(401).json({message:"user is not authenticated"})
  });

router.put('/:genre_id/books/:book_id', async (req, res) => {
  const genre_id = req.params.genre_id;
  const book_id = req.params.book_id;
  const { title, description,genre, link, creatorID} = req.body;
  var newGenre=genre
  const {token}=req.headers;
  data={genre_id,newGenre, title,description,link, creatorID,token}
  var existG=await genreExists(genre_id)
  var existB=await bookExists(book_id)
  if (creatorID&&token&&existG&&existB) {
    if(! await authenticateUser(token,creatorID))
    {
      res.status(401).json({
        message: 'User is not logged in',
        data})}
    else{
      if(await updateBook(book_id, creatorID,genre_id ,title, description))
      {
        res.status(200).json({
          message: 'Updating successful',
          data});}
    else{
      res.status(403).json({
        message: 'you can not update this book',
        data});
    }}} else {
      if(! existG)
      res.status(404).json({
        message: 'Genre does not exist',
        data});
      else if(! existB)
      res.status(404).json({
        message: 'Book does not exist',
        data});
      else 
    res.status(400).json({
      message: 'Invalid request data',
      data});}});

router.post('/:genre_id/books/', async (req, res) => {
  const genre_id=req.params.genre_id
  const { title, definition, creatorID, link} = req.body;
  const {token}=req.headers;
  data={title,definition,creatorID,genre_id}
  var exists=await genreExists(genre_id)
  if (!!title && !!definition&&creatorID&&token&&exists) {
    if(! await authenticateUser(token,creatorID))
    {
      res.status(401).json({
        message: 'User is not logged in',
        data})}
    else{
      if(await addBook(title, definition,link, creatorID, genre_id))
      {
        res.status(201).json({
          message: 'Adding successful',
          data});
    }}} else {
      if(exists)
      {res.status(400).json({
        message: 'Invalid request data',
        data})}
      else{
    res.status(404).json({
      message: 'Genre does not exist',
      data});}}});

router.delete('/:genre_id/books/:id', async (req, res) => {
  const {creatorID} = req.body;
  const book_id = req.params.id;
  const genre_id=req.params.genre_id;
  const {token}=req.headers;
  data={genre_id,book_id,creatorID}
  if (creatorID&&token) {
    if(! await authenticateUser(token,creatorID))
    {
      res.status(401).json({
        message: 'User is not logged in',
        data})}
    else{
      if(await deleteBook(book_id, creatorID))
      {
        res.status(200).json({
          message: 'Deleting successful',
          data});}
    else{
      if(! await isAdmin(creatorID))
      {
      res.status(401).json({
        message: 'you can not delete this genre, because it is not yours, admin will be informed',
        data});}
        else
        {
          if(await genreExists(genre_id))
          res.status(404).json({
            message: 'you can not delete this book, because it does not exist',
            data}) 
            else
            res.status(404).json({
              message: 'you can not delete this book, because its genre does not exist',
              data}) 
        }
    }}} else {
    res.status(400).json({
      message: 'Invalid request data',
      data});}});

router.get("/:genre_id/books/:book_id/reviews/", async (req,res)=>{
    const genre_id = req.params.genre_id;
    const book_id = req.params.book_id;
    const {token, creatorID}=req.headers;
    if(authenticateUser(token, creatorID)){
    const url = 'mongodb://Philipp:dim1.PWfdMDB!@localhost:27017/LLL'; // Adjust if using a different host/port
    const dbName = 'BlindBookShopping'; // Use your desired database name
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db(dbName);
    var vector = await db.collection("Reviews").find({genre:genre_id, book:book_id}).toArray();
    await client.close();
    if(vector.length>0)
    res.status(200).json({ reviewList: vector});
    else if(!await genreExists(genre_id))
      res.status(404).json({message:"genre does not exist"})
    else if(!await bookExists(book_id))
      res.status(404).json({message:"book does not exist"})
    else
      res.status(404).json({message:"book does not have reviews"})
    }
    else
    res.status(401).json({message:"user is not authenticated"})
    })

router.get("/:genre_id/books/:book_id/reviews/:review_id",async (req, res) => {
    const review_id = req.params.review_id;
    const book_id = req.params.book_id;
    const genre_id = req.params.genre_id;
    const {creatorID, token}=req.headers
    if(authenticateUser(token, creatorID))
    {
    const url = 'mongodb://Philipp:dim1.PWfdMDB!@localhost:27017/LLL'; // Adjust if using a different host/port
    const dbName = 'BlindBookShopping'; // Use your desired database name
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db(dbName);
    var vector = await db.collection("Reviews").find({genre:genre_id, book:book_id}).toArray();
    var result=false
      for (let i =0;i<vector.length;i++)
      {
        if (vector[i]._id==review_id)
          result=vector[i]
      }
      await client.close();
      if(!result)
      {
        if(! await genreExists(genre_id))
          res.status(404).json({message:"genre does not exist", genre:genre_id});
        else if(! await bookExists(book_id))
          res.status(404).json({message:"book does not exist", genre:genre_id, book:book_id});
        else
          res.status(404).json({message:"review does not exist", genre:genre_id, book:book_id, review:review_id});
      }
      else
        res.status(200).json(result);}
        else
        res.status(401).json({message:"user is not authenticated"})
    });

router.put("/:genre_id/books/:book_id/reviews/:review_id", async (req, res) => {
  const {title, text, creatorID} = req.body;
  const review_id = req.params.review_id;
  const book_id=req.params.book_id;
  const genre_id=req.params.genre_id;
  const {token}=req.headers;
  data={genre_id,book_id, title,text,creatorID}
  var existG=await genreExists(genre_id)
  var existB=await bookExists(book_id)
  var existR=await reviewExists(review_id)
  if (creatorID&&token&&existG&&existB&&existR) {
    if(! await authenticateUser(token,creatorID))
    {
      res.status(401).json({
        message: 'User is not logged in',
        data})}
    else{
      if(await updateReview(review_id, creatorID,title,text))
      {
        res.status(200).json({
          message: 'Updating successful',
          data});}
    else{
      res.status(405).json({
        message: 'you can not update this book',
        data});
    }}} else {
      if(! existG)
      res.status(404).json({
        message: 'Genre does not exist',
        data});
      else if(! existB)
      res.status(404).json({
        message: 'Book does not exist',
        data});
        else if(! existR)
        res.status(404).json({
          message: 'Review does not exist',
          data});
      else 
    res.status(400).json({
      message: 'Invalid request data',
      data});}});

router.post('/:genre_id/books/:book_id/reviews', async (req, res) => {
  const genre_id=req.params.genre_id
  const book_id = req.params.book_id
  const { title, text, creatorID, rating} = req.body;
  const {token}=req.headers;
  data={title,text,creatorID,genre_id,book_id}
  var existsG=await genreExists(genre_id)
  var existsB= await bookExists(book_id)
  if (!!title && !!text&&creatorID&&token&&existsG&&existsB&&rating+1) {
    if(! await authenticateUser(token,creatorID))
    {
      res.status(401).json({
        message: 'User is not logged in',
        data})}
    else{
      if(await addReview(title, text,rating,creatorID, genre_id, book_id))
      {
        res.status(201).json({
          message: 'Adding successful',
          data});
    }}} else {
      if(existsB)
      {res.status(400).json({
        message: 'Invalid request data',
        data})}
        else if(existsG)
        {
          res.status(404).json({
            message: 'Book does not exist',
            data})
        }
      else{
    res.status(404).json({
      message: 'Genre does not exist',
      data});}}});

router.delete('/:genre_id/books/:book_id/reviews/:review_id', async (req, res) => {
  const {creatorID} = req.body;
  const book_id = req.params.book_id;
  const genre_id=req.params.genre_id;
  const review_id=req.params.review_id;
  const {token}=req.headers;
  data={genre_id,book_id,review_id,creatorID}
  if (creatorID&&token) {
    if(! await authenticateUser(token,creatorID))
    {
      res.status(401).json({
        message: 'User is not logged in',
        data})}
    else{
      if(await deleteReview(review_id, creatorID))
      {
        res.status(200).json({
          message: 'Deleting successful',
          data});}
    else{
      if(! await isAdmin(creatorID))
      {
      res.status(401).json({
        message: 'you can not delete this genre, because it is not yours, admin will be informed',
        data});}
        else
        {
          if(!await genreExists(genre_id))
          res.status(404).json({
            message: 'you can not delete this review, because its genre does not exist',
            data}) 
          else if (!await bookExists(genre_id))
          res.status(404).json({
            message: 'you can not delete this review, because its book does not exist',
            data}) 
          else
          res.status(404).json({
            message: 'you can not delete this review, because it does not exist',
            data}) 
        }
    }}} else {
    res.status(400).json({
      message: 'Invalid request data',
      data});}});

module.exports = router;