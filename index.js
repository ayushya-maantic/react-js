const express = require('express')
const cors = require('cors')
const mysql = require('mysql');
var con;

function connect(){
  con = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "qwerty123",
    database: "ts_org",
    maxIdleTime: 2000
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });
}

function disconnect(){
  con.end()
}

connect()
var sql = "CREATE TABLE if not exists customers ( ID VARCHAR(38) NOT NULL PRIMARY KEY, ClientName VARCHAR(200) NOT NULL UNIQUE, CntrRplcMMnth smallint, EmailID VARCHAR(50) NOT NULL UNIQUE, AppBaseLink VARCHAR(500) NOT NULL, LogoImage VARCHAR(500), TimeZone VARCHAR(10) NOT NULL, HrsPerDay smallint UNSIGNED NOT NULL, NoOfWrkDay smallint UNSIGNED NOT NULL, RplcBudgetAllowed smallint UNSIGNED NOT NULL, FirstAsmntMonths smallint UNSIGNED NOT NULL, AssessReminderDueDay smallint UNSIGNED NOT NULL, Active tinyint(1) NOT NULL DEFAULT 1);"
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });

var sql = "CREATE TABLE if not exists email_templates ( ID VARCHAR(38) NOT NULL PRIMARY KEY, Name VARCHAR(20) NOT NULL UNIQUE, CreateDate datetime NOT NULL, Content VARCHAR(2000), Subject VARCHAR(500), NotificationType VARCHAR(20) NOT NULL, EventType VARCHAR(20) NOT NULL, OrganizationID VARCHAR(38) NOT NULL, Active tinyint(1) NOT NULL DEFAULT 1, FOREIGN KEY (OrganizationID) REFERENCES customers(ID));"
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });

disconnect()

	 
const app = express()
app.use(express.json());
app.use(cors());

app.get('/', function (req, res) {
  connect()
    sql = "SELECT * FROM customers"
    con.query(sql, function (error,results) {
      if (error) throw error;
      else{
      
        res.send({"r":results})
      }
    });
})



//CUSTOMERS


app.get('/customers', function (req, res) {
  connect()
    sql = "SELECT * FROM customers"
    con.query(sql, function (error,results) {
      if (error) throw error;
      else{
      
        res.send({"r":results})
      }
    });
})


app.get('/customers/count', (req,res) =>{
  sql = "SELECT COUNT(ID) AS count from customers where 1 = 1"

  if (req.query.active) sql += " AND Active = " + req.query.active;
  Object.keys(req.query).forEach(function(key) {
    if(key != 'asc' && key != 'desc' && key != 'active')
    sql += " AND " + key + " = '" +req.query[key] + "'"
  })
  
  connect()
  con.query(sql,(e,r)=>{
    if(e) throw e;
    else{
      res.send({"c":String(r[0]["count"])});
    }
  })
})


app.post('/customers/update', (req,res) =>{
  console.log(req.body)
  body = req.body
  tosend = ''
  connect()
  sql = "UPDATE customers SET ClientName = ?, CntrRplcMMnth = ?, EmailID = ?, AppBaseLink = ?, LogoImage = ?, TimeZone = ?, HrsPerDay = ?, NoOfWrkDay = ?, RplcBudgetAllowed = ?, FirstAsmntMonths = ?, AssessReminderDueDay = ?, Active = ? WHERE ID = ?"
    con.query(sql, [body.ClientName, body.CntrRplcMMnth, body.EmailID, body.AppBaseLink, body.LogoImage, body.TimeZone, body.HrsPerDay, body.NoOfWrkDay, body.RplcBudgetAllowed, body.FirstAsmntMonths, body.AssessReminderDueDay, body.Active,body.ID], function (error) {
      if (error){
        
        res.send({'m':error.sqlMessage})
      } 
      else{
        
        res.send({'m':'Updated'})
      }
    });
})


app.get('/customers/getPoss',(req,res) => {
  if (!req.query.n) res.send({'v':'Empty'})
  else{
    sql = "SELECT GROUP_CONCAT(DISTINCT "+req.query.n+") AS vals FROM customers"
    connect()
    con.query(sql, (error,results) => {
      if (error) throw error
      else{
        
        console.log(results)
        res.send({'v':results})
      }
    })
  }
})


app.get('/customers/:start', function (req, res) {
  connect()

    sql = "SELECT * FROM customers WHERE 1 = 1"
    
    if (req.query.active) sql += " AND Active = " + req.query.active;
    Object.keys(req.query).forEach(function(key) {
      if(key != 'asc' && key != 'desc' && key != 'active')
      sql += " AND " + key + " = '" +req.query[key] + "'"
    })

    if (req.query.asc) sql += " order by " + req.query.asc + " ASC" 
    else if (req.query.desc) sql += " order by " + req.query.desc + " DESC" 
    else sql += " order by ID ASC"

    sql += " LIMIT 5 OFFSET " + String(5*(Number(req.params.start)-1))
    console.log(sql)
    con.query(sql, function (error,results) {
      if (error) throw error;
      else{
        res.send({"r":results})
      }
    });
})


app.get('/email_templates', function (req, res) {
  connect()
    sql = "SELECT * FROM email_templates"
    con.query(sql, function (error,results) {
      if (error) throw error;
      else{
      
        res.send({"r":results})
      }
    });
})

app.get('/email_templates/count', (req,res) =>{
  sql = "SELECT COUNT(ID) AS count from email_templates where 1 = 1"

  if (req.query.active) sql += " AND Active = " + req.query.active;
  Object.keys(req.query).forEach(function(key) {
    if(key != 'asc' && key != 'desc' && key != 'active')
    sql += " AND " + key + " = '" +req.query[key] + "'"
  })
  
  connect()
  con.query(sql,(e,r)=>{
    if(e) throw e;
    else{
      res.send({"c":String(r[0]["count"])});
    }
  })
})


app.post('/email_templates/update', (req,res) =>{
  console.log(req.body)
  body = req.body
  tosend = ''
  connect()
  sql = "UPDATE email_templates SET Name = ?, CreateDate = ?, Content = ?, Subject = ?, NotificationType = ?, EventType = ?, OrganizationID = ?, Active = ? WHERE ID = ?"
    con.query(sql, [body.Name, body.CreateDate, body.Content, body.Subject, body.NotificationType, body.EventType, body.OrganizationID, body.Active, body.ID], function (error) {
      if (error){
        
        res.send({'m':error.sqlMessage})
      } 
      else{
        
        res.send({'m':'Updated'})
      }
    });
})

app.get('/email_templates/getPoss',(req,res) => {
  if (!req.query.n) res.send({'v':'Empty'})
  else{
    sql = "SELECT GROUP_CONCAT(DISTINCT "+req.query.n+") AS vals FROM email_templates"
    connect()
    con.query(sql, (error,results) => {
      if (error) throw error
      else{
        
        console.log(results)
        res.send({'v':results})
      }
    })
  }
})

app.get('/email_templates/:start', function (req, res) {
  connect()
    sql = "SELECT *, DATE_FORMAT(CreateDate, '%Y-%m-%dT%H:%i') AS CreateDate FROM email_templates WHERE 1 = 1"

    if (req.query.active) sql += " AND Active = " + req.query.active;
    Object.keys(req.query).forEach(function(key) {
      if(key != 'asc' && key != 'desc' && key != 'active')
      sql += " AND " + key + " = '" +req.query[key] + "'"
    })

    if (req.query.asc) sql += " order by " + req.query.asc + " ASC" 
    else if (req.query.desc) sql += " order by " + req.query.desc + " DESC" 
    else sql += " order by ID ASC"
    
    sql += " LIMIT 5 OFFSET " + String(5*(Number(req.params.start)-1))
    console.log(sql)
    con.query(sql, function (error,results) {
      if (error) throw error;
      else{
        res.send({"r":results})
      }
    });
})


app.post('/customers', (req,res) =>{
    console.log(req.body)
    body = req.body
    connect()
    sql = "INSERT INTO customers (ID, ClientName, CntrRplcMMnth, EmailID, AppBaseLink, LogoImage, TimeZone, HrsPerDay, NoOfWrkDay, RplcBudgetAllowed, FirstAsmntMonths, AssessReminderDueDay) VALUES ( UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    con.query(sql, [body.ClientName, body.CntrRplcMMnth, body.EmailID, body.AppBaseLink, body.LogoImage, body.TimeZone, body.HrsPerDay, body.NoOfWrkDay, body.RplcBudgetAllowed, body.FirstAsmntMonths, body.AssessReminderDueDay], function (error) {
      if (error) res.send({'m':error.code});
      else res.send({'m':'Added'})
    });
    
})

app.post('/email_templates', (req,res) =>{
  console.log(req.body)
  body = req.body
  connect()
  sql = "INSERT INTO email_templates (ID, Name, CreateDate, Content, Subject, NotificationType, EventType, OrganizationID) VALUES ( UUID(), ?, ?, ?, ?, ?, ?, ?)"
  con.query(sql, [body.Name, body.CreateDate, body.Content, body.Subject, body.NotificationType, body.EventType, body.OrganizationID], function (error) {
    if (error) res.send({'m':error.code});
    // if (error) throw error;
    else res.send({'m':'Added'})
  });
  
})

app.listen(3002)