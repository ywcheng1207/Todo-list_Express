// --------------------------------------------------------------------------------------
// ---------------------------------- require區 -----------------------------------------
// --------------------------------------------------------------------------------------
// 載入 express 並建構應用程式伺服器
const express = require('express')
const session = require('express-session')
const usePassport = require('./config/passport') // 載入設定檔，要寫在 express-session 以後
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const routes = require('./routes') // 對Express來說，等同./reoutes/index.js
require('./config/mongoose')
const port = process.env.PORT || 3000
// --------------------------------------------------------------------------------------
// ---------------------------------- use區 ---------------------------------------------
// --------------------------------------------------------------------------------------
const app = express()
app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
usePassport(app) // 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
app.use((req, res, next) => {
  console.log('【登入成功】',req.user) 
  // res.locals 是 Express.js 幫我們開的一條捷徑，放在 res.locals 裡的資料，所有的 view 都可以存取
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  next()
})
app.use(routes)
// --------------------------------------------------------------------------------------
// ----------------------------------- 啟動  ---------------------------------------------
// --------------------------------------------------------------------------------------
// 設定 port 3000
app.listen(port, () => {
  console.log('App is running on http://localhost:3000')
})
