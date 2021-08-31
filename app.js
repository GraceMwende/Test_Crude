const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

//create a database connection
const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'node_crud'
});

connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Connected!');
})
//define view engine with ejs/ public path / view files path / bodyParser
//set views file
app.set('views', path.join(__dirname, 'views'));

//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));


app.get('/', (req, res) => {
    // res.send('Crud Operations');
    let sql = "SELECT *FROM users";
    let query = connection.query(sql, (err, rows) =>{
        if(err) throw err;
        res.render('user_index', {
            title: 'CRUD Operation using ExpressJs/ MySQL',
            user:rows
        })
    })
});

app.get('/add', (req, res) => {
    res.render('user_add',{
      title: 'CRUD Operation using ExpressJs/ MySQL',
    })
});

app.post('/save', (req,res) =>{
    let data = {name:req.body.name, email:req.body.email, phone_no:req.body.phone_no};
    let sql = "INSERT INTO users SET ?";
    let query = connection.query(sql, data,(err, results) => {
        if(err) throw err;
        res.redirect('/');
    })
})

app.get('/edit/:userId', (req,res) => {
    const userId = req.params.userId;
    let sql = `select * from users where id = ${userId}`;
    let query = connection.query(sql, (err, result) => {
        if(err) throw err;
        res.render('user_edit', {
            title: 'CRUD Operation using ExpressJs/ MySQL',
            user:result[0]
        });
    });
});

//update
app.post('/update',(req, res) => {
    const userId = req.body.id;
    let sql = "update users SET name='"+req.body.name+"',  email='"+req.body.email+"',  phone_no='"+req.body.phone_no+"' where id ="+userId;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});

//delete
app.get('/delete/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `DELETE from users where id = ${userId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
});
//server listening
app.listen(3000, () => {
    console.log('Server is listening at port 30000');
})