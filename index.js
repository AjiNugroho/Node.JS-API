//path module
const path = require('path');
//express
const express = require('express');
//hbs view engine
const hbs = require('hbs');
//use body parser
const bodyParser = require('body-parser');
//mysql client
const mysql = require('mysql');
//app
const app = express();

//membuat koneksi ke mysql
const conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    dabatase:'store_db'
});

//connect ke database
conn.connect((err)=>{
    if(err) throw err;
    console.log('database connected');
});

//set view file
app.set('views',path.join(__dirname,'views'));

//set view engine
app.set('view engine','hbs');

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//set static file
app.use('/assets',express.static(__dirname+'/public'));

//home page , tampilkan semua data
app.get('/',(req,res)=>{
    let sql = 'SELECT * FROM store_db.product';
    let query = conn.query(sql,(err,results)=>{
        if(err) throw err;
        res.render('product_view',{results:results});
    });
});

//insert data 
app.post('/save',(req,res)=>{
    let data = {product_name: req.body.product_name, product_price: req.body.product_price};
    let sql = 'INSERT INTO store_db.product SET ?';
    let query = conn.query(sql,data,(err,results)=>{
        if(err) throw err;
        res.redirect('/');
    });
});

//update data
app.post('/update',(req,res)=>{
    let sql = 'UPDATE store_db.product SET product_name ="'+req.body.product_name+'",product_price="'+req.body.product_price+'" WHERE product_id='+req.body.id;
    let query = conn.query(sql,(err,results)=>{
        if(err) throw err;
        res.redirect('/');
    });
});

//delete data
app.post('/delete',(req,res)=>{
    let sql = 'DELETE FROM store_db.product WHERE product_id='+req.body.product_id+'';
    let query = conn.query(sql,(err,result)=>{
        if(err) throw err;
        res.redirect('/');
    });
});

//server listening
app.listen(8000,()=>{
    console.log('Server is running at port 8000');
});