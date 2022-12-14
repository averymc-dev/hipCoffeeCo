const express = require('express')
const app = express()
// const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('express-flash')
const logger = require('morgan')
const connectDB = require('./config/database')
const mainRoutes = require('./routes/main')
const todoRoutes = require('./routes/todos')

require('dotenv').config({path: './config/.env'})

// From slides ?? what is this? where does it go?
// let db,
//     dbConnectionStr = process.env.DB_STRING,
//     dbName = 'HCC'

// MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
//     .then(client => {
//         console.log(`Connected to ${dbName} Database`)
//         db = client.db(dbName)
//     })
//

// Passport config
require('./config/passport')(passport)

connectDB()

app.set('view engine', 'ejs')
app.use(express.static('public'))

// Body Parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(logger('dev'))
// Express Sessions
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  )
  
// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
  
app.use('/', mainRoutes)
app.use('/todos', todoRoutes)
 
app.listen(process.env.PORT, ()=>{
    console.log(`HCC Server running on PORT ${process.env.PORT}`)
})


