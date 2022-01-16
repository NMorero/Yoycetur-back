const express = require('express')
const app = express()
const port = 3002
const mysql = require('mysql');
const path = require('path');
const multer = require('multer');
const sharp = require('sharp')
const fs = require('fs')
const fileUpload = require('express-fileupload');
const cors = require('cors')

app.use(express.static('public'));
app.use(cors({
  origin: '*'
}));
app.use(fileUpload());


var connection;

function handleDisconnect() {
connection = mysql.createConnection({
    host: '192.169.147.133',
    user: 'yoycetur',
    password: '.})WH7EQl.dv',
    database: 'yoycetur'
    }); 
    // Recreate the connection, since
                                                // the old one cannot be reused.

connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
    console.log('error when connecting to db:', err);
    setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
});                                     // process asynchronous requests in the meantime.
                                        // If you're also serving http, display a 503 error.
connection.on('error', function(err) {
    //console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
    handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
    throw err;                                  // server variable configures this)
    }
});
}

handleDisconnect();

app.get('/getTravelOuts', (req, res) => {
  connection.query('SELECT * FROM `travel_outs`', function (error, results, fields) {
    if (error) throw error;
    if (results.length > 0) {
      res.send(JSON.stringify({ status: 0, travelOuts: results}))      
    } else {
      res.send(JSON.stringify({ status: 2 }))
    }
  });   
})

app.get('/getTravel/:travel', (req, res) => {
  var sql = "SELECT * FROM travels WHERE travels.title="+"'"+req.params.travel.replaceAll('-',' ')+"'";
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    if (results.length > 0) {
      res.send(JSON.stringify({ status: 0, travel: results[0]}))      
    } else {
      res.send(JSON.stringify({ status: 2 }))
    }
  });   
})

app.get('/getTravelOutBanner/:travelOut', (req, res) => {
  connection.query("SELECT banner FROM `travel_outs`  WHERE travel_outs.title = "+"'"+req.params.travelOut.replaceAll('-',' ')+"'", function (error, results, fields) {
    if (error) throw error;
    if (results.length > 0) {
      res.send(JSON.stringify({ status: 0, banner: results[0]}))      
    } else {
      res.send(JSON.stringify({ status: 2 }))
    }
  });   
})

app.get('/getTravels/:travelOut', (req, res) => {
  var sql ="SELECT t.travelId, t.title, t.price, t.image FROM travels t JOIN travel_outs ON t.travelsTravelOutId = travel_outs.travelOutId WHERE travel_outs.title = "+"'"+req.params.travelOut.replaceAll('-',' ')+"'";
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    if (results.length > 0) {
      res.send(JSON.stringify({ status: 0, travels: results}))      
    } else {
      res.send(JSON.stringify({ status: 2 }))
    }
  });   
})


app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})