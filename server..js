const express = require('express')
const app = express()
const port = 3001
const mysql = require('mysql');
const path = require('path');
const multer = require('multer');
const upload = multer({dest: 'public/images/'});
const sharp = require('sharp')
const fs = require('fs')
const fileUpload = require('express-fileupload');
const cors = require('cors')
const bodyParser = require('body-parser');

app.use("/images", express.static(path.resolve(__dirname + '/public/images')));
app.use(cors({
  origin: '*'
}));
app.use(fileUpload());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.json());

var connection;

function handleDisconnect() {
connection = mysql.createConnection({
    host: '192.169.147.133',
    user: 'yoycetur',
    password: '.})WH7EQl.dv',
    database: 'yoycetur'
    }); 
connection.connect(function(err) {             
    if(err) {                                     
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

app.post('/login', (req, res) => {
  console.log(req.body)
  if(req.body.user == 'yoycetur' && req.body.pass == 'Yoycetur@2021'){
    res.json({status:0})
  }else{
    res.json({status:1})
  }
})


app.post('/addTravelOut', (req, res) => {
  let image = req.files.image;
  let fileNameImage = Date.now()+'.'+image.mimetype.split('/')[1];
  uploadPathImage = __dirname + '/public/images/travel_outs/image/' + fileNameImage;
  image.mv(uploadPathImage, function(err) {
  });

  let banner = req.files.banner;
  let fileNameBanner = Date.now()+'.'+banner.mimetype.split('/')[1];
  uploadPathBanner = __dirname + '/public/images/travel_outs/banner/' + fileNameBanner;
  image.mv(uploadPathBanner, function(err) {
  });

  
  var sql ="INSERT INTO travel_outs (title, image, banner) VALUES (?)";
  var values = [req.body.title, fileNameImage, fileNameBanner];
  connection.query(sql,[values], function (error, results, fields) {
    if (error) throw error;
    if (results.length > 0) {
      res.json({status:0})   
    } else {
      res.json({status:0})
    }
  }); 
  
})

app.post('/addTravel', (req, res) => {
  console.log(req.files)
  let image = req.files.image;
  let fileNameImage = Date.now()+'.'+image.mimetype.split('/')[1];
  uploadPathImage = __dirname + '/public/images/travels/' + fileNameImage;
  image.mv(uploadPathImage, function(err) {
  });
  
  var sql ="INSERT INTO travels (title, price, image, travelsTravelOutId, departure, destination, excursions, file,stay) VALUES (?)";
  var values = [req.body.title, req.body.price,fileNameImage, req.body.travelOutId, req.body.departure, req.body.destination, req.body.excursions, req.body.file, req.body.stay];
  connection.query(sql,[values], function (error, results, fields) {
    if (error) throw error;
    if (results.length > 0) {
      res.json({status:0})   
    } else {
      res.json({status:0})
    }
  }); 
  
})


app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})