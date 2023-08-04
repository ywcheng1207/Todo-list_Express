// --------------------------------------------------------------------------------------
// ---------------------------------- 設定區 ---------------------------------------------
// --------------------------------------------------------------------------------------
// 載入 express 並建構應用程式伺服器
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose') // 載入 mongoose
const Todo = require('./models/todo')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

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

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
// --------------------------------------------------------------------------------------
// ---------------------------------- 路由區 ---------------------------------------------
// --------------------------------------------------------------------------------------
// 設定首頁路由
app.get('/', (req, res) => {
  Todo.find() // 跟js的Array.prototype.find()意思不同
    .lean() // 這也是mongoose方法
    .sort({ _id: 'asc' })
    .then((todos) => res.render('index', { todos }))
    .catch((error) => console.error(error))
})

app.get('/todos/new', (req, res) => {
  return res.render('new')
})

// Create 功能：資料庫新增資料

// 作法1
// app.post('/todos', (req, res) => {
//   const name = req.body.name // 從 req.body 拿出表單裡的 name 資料
//   return Todo.create({ name }) // 存入資料庫
//     .then(() => res.redirect('/')) // 新增完成後導回首頁
//     .catch((error) => console.log(error))
// })
// 作法2
app.post('/todos', (req, res) => {
  const name = req.body.name
  const todo = new Todo({ name })
  console.log(name)
  return todo
    .save() // 存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch((error) => console.log(error))
})
// Read
app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render('detail', { todo }))
    .catch((error) => console.log(error))
})
// Update
app.get('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render('edit', { todo }))
    .catch((error) => console.log(error))
})
app.put('/todos/:id', (req, res) => {
  const id = req.params.id
  const { name, isDone } = req.body
  return Todo.findById(id)
    .then((todo) => {
      todo.name = name
      todo.isDone = isDone === 'on'
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch((error) => console.log(error))
})
// Delete
app.delete('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .then((todo) => todo.remove())
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error))
})
// --------------------------------------------------------------------------------------
// ----------------------------------- 啟動  ---------------------------------------------
// --------------------------------------------------------------------------------------
// 設定 port 3000
app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})
