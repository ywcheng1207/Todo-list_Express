const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, {
  // Mongoose 6 以上已預設 useNewUrlParser 、useUnifiedTopology、useCreateIndex為 true
  // 若沒有出現 DeprecationWarning 則可以跳過這個步驟
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
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

module.exports = db
