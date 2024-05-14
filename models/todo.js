const mongoose = require('mongoose')
const Schema = mongoose.Schema // Mongoose 提供了一個 mongoose.Schema 模組
const todoSchema = new Schema({
  name: {
    type: String, // 資料型別是字串
    required: true // 這是個必填欄位
  },
  isDone: {
    type: Boolean,
    default: false
  },
  // 參照 User 的 ObjectId => Mongoose的Populate功能，建立不同collections的關聯
  userId: {  // 加入關聯設定
    type: Schema.Types.ObjectId, // 定義 userId 這個項目是一個 ObjectId，也就是它會連向另一個資料物件
    ref: 'User', // 定義參考對象是 User model
    index: true, // 用 index: true 把 userId 設定成「索引」
    required: true
  }
})
module.exports = mongoose.model('Todo', todoSchema)
