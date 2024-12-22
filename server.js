const express = require('express')
const app = express()
const port = 5000
const apiRoutes = require('./routes/apiRoutes')

app.use(express.json())

app.get('/', (req, res) => {
  res.json({message:'API is running...'})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)

app.use('/api', apiRoutes)
})