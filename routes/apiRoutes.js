const express = require("express")
const app =express()
const bookRoutes= require("./bookRoutes")
const genreRoutes= require("./genreRoutes")
const userRoutes = require("./userRoutes")
const adminRoutes = require("./adminRoutes")

app.use("/books", bookRoutes)
app.use('/api/genre/:genre_id/books', bookRoutes);
app.use("/genre", genreRoutes)
app.use("/user", userRoutes)
app.use("/admin", adminRoutes)

app.get('/', (req, res) => {
    res.json({message:'API is running here too...'})
  })

module.exports=app