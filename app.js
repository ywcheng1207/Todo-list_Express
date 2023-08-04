// --------------------------------------------------------------------------------------
// ---------------------------------- require區 -----------------------------------------
// --------------------------------------------------------------------------------------
// 載入 express 並建構應用程式伺服器
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose') // 載入 mongoose
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const routes = require('./routes') // 對Express來說，等同./reoutes/index.js

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// --------------------------------------------------------------------------------------
// ------------------------------------- db區 -------------------------------------------
// --------------------------------------------------------------------------------------
const app = express()
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}) // 設定連線到 mongoDB

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})
// --------------------------------------------------------------------------------------
// ---------------------------------- use區 ---------------------------------------------
// --------------------------------------------------------------------------------------

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)

// --------------------------------------------------------------------------------------
// ----------------------------------- 啟動  ---------------------------------------------
// --------------------------------------------------------------------------------------
// 設定 port 3000
app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})
