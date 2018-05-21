var express = require("express");
var app = express();
var mysql = require('mysql');
var aws = require('aws-sdk');
var bodyParser = require('body-parser');

app.use(bodyParser());

var port = process.env.PORT || 3000;

var con = mysql.createPool({
  host: "janelaaj.ct3gisbrr8uy.ap-south-1.rds.amazonaws.com",
  user: "pratyush_singh",
  password: "password",
  database: "dbname"
});


app.post("/form",function(req,res){


  var FNAME = req.body.fname;
  var LNAME = req.body.lname;
  var AGE = parseInt(req.body.age);
  var DID = req.body.did;

  var obj = {
    status : "SUCCESS"
  }


  var sql = "INSERT INTO usersdata (FIRST_NAME, LAST_NAME, AGE, DEPARTMENT_ID) VALUES((?),(?),(?),(?))";


  con.getConnection(function(err, connection) {

    if(err){
      obj.status = "FAIL";
      res.send(JSON.stringify(obj));
    }else{

      connection.query(sql,[FNAME,LNAME,AGE,DID], function(err, result) {

        if(err){
          obj.status = "FAIL";
          res.send(JSON.stringify(obj));
        }else{

          if(result.affectedRows == 1){
            obj.status = "SUCCESS";
            updatetimestamp(DID,res,obj);
            // res.send(JSON.stringify(obj));
          }else{
            obj.status = "FAIL";
            res.send(JSON.stringify(obj));
          }
        }

          connection.release();
      });

    }
  });

});



function updatetimestamp(val,res,obj){

  var sql = '';
  var time = Math.floor(Date.now() / 1000);

  if(val == '123'){
    console.log('123');
    sql = `UPDATE development SET TIMESTAMP = ? WHERE ID = ?`;
  }else if(val == '234'){
    console.log('234');
    sql = `UPDATE managment SET TIMESTAMP = ? WHERE ID = ?`;
  }else if(val == '345'){
    console.log('345');
    sql = `UPDATE sales SET TIMESTAMP = ? WHERE ID = ?`;
  }


  con.getConnection(function(err, connection) {

    if(err){
      res.send(JSON.stringify(obj));
    }else{

      connection.query(sql,[time,1], function(err, result) {

        if(err){
          res.send(JSON.stringify(obj));
        }else{

          if(result.affectedRows == 1){
            console.log("ho gyaaaaaa");
            res.send(JSON.stringify(obj));
          }else{
            res.send(JSON.stringify(obj));
          }
        }

          connection.release();
      });

    }
  });


};


app.get("/all",function(req,res){


    var obj = {

      status : "FAIL",
      devtime : 0,
      mantime : 0,
      saletime : 0,
      data : []
    };

    var sql = `SELECT * FROM usersdata`;
    var sql0 = `SELECT TIMESTAMP FROM development`;
    var sql1 = `SELECT TIMESTAMP FROM managment`;
    var sql2 = `SELECT TIMESTAMP FROM sales`;




    con.getConnection(function(err, connection) {

      if(err){
        obj.status = "FAIL";
        res.send(JSON.stringify(obj));
      }else{


        connection.query(sql0,function(err,row0){

          if(err){
            obj.status = "FAIL";
            res.send(JSON.stringify(obj));
          }else{
            obj.devtime = row0[0].TIMESTAMP;

            connection.query(sql1,function(err,row1){

              if(err){
                obj.status = "FAIL";
                res.send(JSON.stringify(obj));
              }else{
                obj.mantime = row1[0].TIMESTAMP;

                connection.query(sql2,function(err,row2){

                  if(err){
                    obj.status = "FAIL";
                    res.send(JSON.stringify(obj));
                  }else{
                    obj.saletime = row2[0].TIMESTAMP;


                    connection.query(sql, function(err, row) {

                      if(err){
                        obj.status = "FAIL";
                        res.send(JSON.stringify(obj));
                      }else{

                          for(var i = 0; i < row.length ; i++){

                            var temp = {
                              id:0,
                              age:0,
                              fname:"",
                              lname:"",
                              did:""
                            }

                            temp.id = row[i].ID;
                            temp.age = row[i].AGE;
                            temp.fname = row[i].FIRST_NAME;
                            temp.lname = row[i].LAST_NAME;
                            temp.did = row[i].DEPARTMENT_ID;

                            obj.data.push(temp);

                          }


                          obj.status = "SUCCESS";
                          res.send(JSON.stringify(obj));


                      }

                        // connection.release();
                    });
                  }

                });
              }

            });


          }

          connection.release();
        });




      }
    });


});


app.get("/del",function(req,res){

  var obj = {
    status : ""
  }

  var sql = 'TRUNCATE TABLE usersdata';

  con.getConnection(function(err, connection) {

    if(err){
      obj.status = "FAIL";
      res.send(JSON.stringify(obj));
    }else{

      connection.query(sql, function(err, result) {

        if(err){
          obj.status = "FAIL";
          res.send(JSON.stringify(obj));
        }else{
          obj.status = "SUCCESS";
          res.send(JSON.stringify(obj));
        }

          connection.release();
      });

    }
  });


});


app.listen(port,function(err1){
  console.log("Listening on the port 3000");
});
