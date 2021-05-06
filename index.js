const express = require('express')
const app = express()
const path = require('path')
const { Pool, Client } = require('pg')
const bodyParser = require('body-parser');



const pool = new Pool({
    user: 'dbuser',
    host: 'localhost',
    database: 'api',
    password: 'pass',
    port: 5432,
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, }));
app.set('views', path.join(__dirname, '/view'));
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs');

app.post('/add', (req, res) => {
    let values = req.body;
    let table = req.body.table;
    delete values.table;
    let str = '(';
    for (value of Object.keys(values)) {
        str += value + ', ';
    }
    str = str.slice(0, -2);
    let valString = '(';
    for (value of Object.values(values)) {
        valString += "'" + value + "', ";
    }
    valString = valString.slice(0, -2);
    str += ")";
    valString += ")";
    console.log(`INSERT INTO ${table} ${str} VALUES ${valString}`);
    pool
        .query(`INSERT INTO ${table} ${str} VALUES ${valString}`, (err, result) => {
            if (!err) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        })
})

app.get('/', (req, res) => {
    let tableName = "";
    if (req.query.table)
        tableName += `?table=${req.query.table}`;
    else tableName = "";
    res.redirect(`/admin${tableName}`);
})

app.get('/admin', (req, res) => {
    let data = null;
    if (!req.query.table)
        req.query.table = "program";
    pool.query(`SELECT table_name
    FROM information_schema.tables
   WHERE table_schema='public'
     AND table_type='BASE TABLE';`, (error, tables) => {
        pool
        .query(`SELECT * FROM ${req.query.table}`, (err, result) => {
            if (!err)
                data = result;
            res.render('index.ejs', {
                data: data,
                tableName: req.query.table,
                tables: tables.rows,
            })
        })
     })
    
})

app.post('/delete', (req, res) => {
    pool.query(`DELETE FROM ${req.body.table} WHERE id=${req.body.index}`, (err, result) => {
        if (!err) {
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    })
})

app.post('/edit', (req, res) => {
    let data = req.body;
    let table = req.body.table;
    let index = req.body.index;
    delete data.table;
    delete data.index;
    let str = "";
    for (let val in data) {
        str += `${val}='${data[val]}',`;
    }
    str = str.slice(0, -1);
    pool.query(`UPDATE ${table} SET ${str} WHERE id=${index}`, (err, result) => {
        if (!err) {
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    })
})

app.listen(3000, () => {
    console.log("link: https://localhost:3000");
})
