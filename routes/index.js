import express from 'express'

const app = express()

//================
// Login
//================
app.use(require('./login'))

app.use(require('./usuario'))



module.exports = app