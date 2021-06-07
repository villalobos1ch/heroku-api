/*
// Check connect
connection.connect(error => {
  if (error) throw error;
  console.log('Database server running!');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
*/
var mysql      = require('mysql');
const express = require('express');

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3050;

const app = express();

app.use(bodyParser.json());

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'testdb'
});
 
connection.connect(error => {
  if (error) throw error;
  console.log('Database server running!');
});

// Route
app.get('/', (req, res) => {
  res.send('Welcome to my API!');
});

app.get('/people', (req, res) => {
  const sql = 'SELECT * FROM people';

  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send('Not result');
    }
  });
});

app.get('/people/:id', (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM people WHERE id = ${id}`;
  connection.query(sql, (error, result) => {
    if (error) throw error;

    if (result.length > 0) {
      res.json(result);
    } else {
      res.send('Not result');
    }
  });
});

app.post('/add', (req, res) => {
  const sql = 'INSERT INTO people SET ?';

  if(req.body.id !== ""){
    const customerObj = {
      name: req.body.name,
      lastname: req.body.lastname
    };
    connection.query(sql, customerObj, error => {
      if (error)
      {
        res.send("{}");
      }
      else{
        res.send('Person created!');
      }
    });
  } 
  else{
    res.send("ID is mandatory");
  } 

});

app.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { name, city } = req.body;
  const sql = `UPDATE people SET name = '${name}', city='${city}' WHERE id =${id}`;

  connection.query(sql, error => {
    if (error) throw error;
    res.send('Person updated!');
  });
});

app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM people WHERE id= ${id}`;

  connection.query(sql, error => {
    if (error) throw error;
    res.send('Delete Person');
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));