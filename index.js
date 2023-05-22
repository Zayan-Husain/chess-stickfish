const express = require('express')

const app = express()

app.use(express.static('home'))

app.get('/home', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.use((req, res, next) => {
    res.status(404).send("<h1>404</h1>")
})