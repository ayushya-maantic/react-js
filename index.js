const express = require('express')
const cors = require('cors')
const mysql = require('mysql');
let forge = require("node-forge");
var pki = forge.pki;
const path = require('path')
const fs = require('fs')
var con;

function lock(encrypted) {
  const absolutePath = path.resolve('private.pem')
  const key = fs.readFileSync(absolutePath, 'utf8')
  var privateKey = forge.pki.decryptRsaPrivateKey(key, '');
  var decrypted = ''
  try {
    decrypted = privateKey.decrypt(forge.util.decode64(encrypted))
  }
  catch (e) {
    console.log(e)
  }
  if (decrypted.length > 1 && decrypted.includes('@maantic.com')) {
    return true
  }
  return false
}

// console.log(encrypt('Hi'))
// lock(encrypt('Hello'))
// lock('KiontQEMIIeFShr3j+Ea7WhWdjT/Bmk70jwfBQbJ2arO7VVl/GDYS6wv/55B/WI4LDfrby32EBzTpZTq9yXAq5uTNT/LlacHr5k4VkOmX/L+MSoxlnJOZFbMDuF+TDZOd2p9M28ShiaCXJ/gdud9LcVTPyBdhxdvxuodcc47B+RgGJh080rmbYg7OqipimisPFKlRij7VXeNNLReVBpMe8V8APaM0ccvnskFvssJSrEsWqxcXYGb7+MUmUmZhyKJxR1UAbaVUTiy0xCI+zhG/oxrftZiddjHI0kJpivAsuijN9FSPq2YUyElY5RbY9kZmbD3Xhoz/5E9u77L0zpce+EcsyL70evDyYz2KZziz8J3PtiqstpZRDkaK/Fg4+adOmkK7024k4EeEDoafCY/FOBOopksbogmcMA+UggFmH9liW4XR8r5IjULr4TPf2iE9KEmjyme54bqfd5kBTmVTHn6QLNYTKTlQEiwjg4zLXFbFnHGGFQsY+Nb4qc8sxoRzaKKFcBO5uM+FuKBxkqAUsitMCCaq3jB1+oh0k5klDgpdoHYQEe+mSMgKqFUvrgvUGC6Q+G+Z45xaWadBCs5YmKNwepsgKGuWV967U6sph9VRJevjUNwardW2Z3g1swj9t3QR5yWzejB9Xe8C4SEyxoTmtDguV1lE6nQ9jUYykw=')

function connect() {
  con = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "qwerty123",
    database: "ts_org",
    maxIdleTime: 2000
  });

  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
  });
}

function disconnect() {
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
  con.query(sql, function (error, results) {
    if (error) throw error;
    else {

      res.send({ "r": results })
    }
  });
})



//CUSTOMERS


app.get('/customers', function (req, res) {
  connect()
  sql = "SELECT * FROM customers"
  con.query(sql, function (error, results) {
    if (error) throw error;
    else {

      res.send({ "r": results })
    }
  });
})


app.get('/customers/count', (req, res) => {
  if (!req.headers['accesskey'] || !lock(req.headers['accesskey'])) { res.send('No priv'); return 0 }
  sql = "SELECT COUNT(ID) AS count from customers where 1 = 1"

  if (req.query.active) sql += " AND Active = " + req.query.active;
  Object.keys(req.query).forEach(function (key) {
    if (key != 'asc' && key != 'desc' && key != 'active')
      sql += " AND " + key + " = '" + req.query[key] + "'"
  })

  connect()
  con.query(sql, (e, r) => {
    if (e) throw e;
    else {
      res.send({ "c": String(r[0]["count"]) });
    }
  })
})


app.post('/customers/update', (req, res) => {
  if (!req.headers['accesskey'] || !lock(req.headers['accesskey'])) { res.send('No priv'); return 0 }
  console.log(req.body)
  body = req.body
  tosend = ''
  connect()
  sql = "UPDATE customers SET ClientName = ?, CntrRplcMMnth = ?, EmailID = ?, AppBaseLink = ?, LogoImage = ?, TimeZone = ?, HrsPerDay = ?, NoOfWrkDay = ?, RplcBudgetAllowed = ?, FirstAsmntMonths = ?, AssessReminderDueDay = ?, Active = ? WHERE ID = ?"
  con.query(sql, [body.ClientName, body.CntrRplcMMnth, body.EmailID, body.AppBaseLink, body.LogoImage, body.TimeZone, body.HrsPerDay, body.NoOfWrkDay, body.RplcBudgetAllowed, body.FirstAsmntMonths, body.AssessReminderDueDay, body.Active, body.ID], function (error) {
    if (error) {

      res.send({ 'm': error.sqlMessage })
    }
    else {

      res.send({ 'm': 'Updated' })
    }
  });
})


app.get('/customers/getPoss', (req, res) => {
  if (!req.headers['accesskey'] || !lock(req.headers['accesskey'])) { res.send('No priv'); return 0 }
  if (!req.query.n) res.send({ 'v': 'Empty' })
  else {
    sql = "SELECT GROUP_CONCAT(DISTINCT " + req.query.n + ") AS vals FROM customers"
    connect()
    con.query(sql, (error, results) => {
      if (error) throw error
      else {

        console.log(results)
        res.send({ 'v': results })
      }
    })
  }
})


app.get('/customers/:start', function (req, res) {
  if (!req.headers['accesskey'] || !lock(req.headers['accesskey'])) { res.send('No priv'); return 0 }
  // console.log(req.headers['accesskey'])
  if (!req.headers['accesskey'] || !lock(req.headers['accesskey'])) { res.send('No priv'); return 0 }
  connect()

  sql = "SELECT * FROM customers WHERE 1 = 1"

  if (req.query.active) sql += " AND Active = " + req.query.active;
  Object.keys(req.query).forEach(function (key) {
    if (key != 'asc' && key != 'desc' && key != 'active')
      sql += " AND " + key + " = '" + req.query[key] + "'"
  })

  if (req.query.asc) sql += " order by " + req.query.asc + " ASC"
  else if (req.query.desc) sql += " order by " + req.query.desc + " DESC"
  else sql += " order by ID ASC"

  sql += " LIMIT 5 OFFSET " + String(5 * (Number(req.params.start) - 1))
  console.log(sql)
  con.query(sql, function (error, results) {
    if (error) throw error;
    else {
      res.send({ "r": results })
    }
  });
})


app.get('/email_templates', function (req, res) {
  if (!req.headers['accesskey'] || !lock(req.headers['accesskey'])) { res.send('No priv'); return 0 }
  connect()
  sql = "SELECT * FROM email_templates"
  con.query(sql, function (error, results) {
    if (error) throw error;
    else {

      res.send({ "r": results })
    }
  });
})

app.get('/email_templates/count', (req, res) => {
  if (!req.headers['accesskey'] || !lock(req.headers['accesskey'])) { res.send('No priv'); return 0 }
  sql = "SELECT COUNT(ID) AS count from email_templates where 1 = 1"

  if (req.query.active) sql += " AND Active = " + req.query.active;
  Object.keys(req.query).forEach(function (key) {
    if (key != 'asc' && key != 'desc' && key != 'active')
      sql += " AND " + key + " = '" + req.query[key] + "'"
  })

  connect()
  con.query(sql, (e, r) => {
    if (e) throw e;
    else {
      res.send({ "c": String(r[0]["count"]) });
    }
  })
})


app.post('/email_templates/update', (req, res) => {
  if (!req.headers['accesskey'] || !lock(req.headers['accesskey'])) { res.send('No priv'); return 0 }
  console.log(req.body)
  body = req.body
  tosend = ''
  connect()
  sql = "UPDATE email_templates SET Name = ?, CreateDate = ?, Content = ?, Subject = ?, NotificationType = ?, EventType = ?, OrganizationID = ?, Active = ? WHERE ID = ?"
  con.query(sql, [body.Name, body.CreateDate, body.Content, body.Subject, body.NotificationType, body.EventType, body.OrganizationID, body.Active, body.ID], function (error) {
    if (error) {

      res.send({ 'm': error.sqlMessage })
    }
    else {

      res.send({ 'm': 'Updated' })
    }
  });
})

app.get('/email_templates/getPoss', (req, res) => {
  if (!req.headers['accesskey'] || !lock(req.headers['accesskey'])) { res.send('No priv'); return 0 }
  if (!req.query.n) res.send({ 'v': 'Empty' })
  else {
    sql = "SELECT GROUP_CONCAT(DISTINCT " + req.query.n + ") AS vals FROM email_templates"
    connect()
    con.query(sql, (error, results) => {
      if (error) throw error
      else {

        console.log(results)
        res.send({ 'v': results })
      }
    })
  }
})

app.get('/email_templates/:start', function (req, res) {
  if (!req.headers['accesskey'] || !lock(req.headers['accesskey'])) { res.send('No priv'); return 0 }
  connect()
  sql = "SELECT *, DATE_FORMAT(CreateDate, '%Y-%m-%dT%H:%i') AS CreateDate FROM email_templates WHERE 1 = 1"

  if (req.query.active) sql += " AND Active = " + req.query.active;
  Object.keys(req.query).forEach(function (key) {
    if (key != 'asc' && key != 'desc' && key != 'active')
      sql += " AND " + key + " = '" + req.query[key] + "'"
  })

  if (req.query.asc) sql += " order by " + req.query.asc + " ASC"
  else if (req.query.desc) sql += " order by " + req.query.desc + " DESC"
  else sql += " order by ID ASC"

  sql += " LIMIT 5 OFFSET " + String(5 * (Number(req.params.start) - 1))
  console.log(sql)
  con.query(sql, function (error, results) {
    if (error) throw error;
    else {
      res.send({ "r": results })
    }
  });
})


app.post('/customers', (req, res) => {
  if (!req.headers['accesskey'] || !lock(req.headers['accesskey'])) { res.send('No priv'); return 0 }
  console.log(req.body)
  body = req.body
  connect()
  sql = "INSERT INTO customers (ID, ClientName, CntrRplcMMnth, EmailID, AppBaseLink, LogoImage, TimeZone, HrsPerDay, NoOfWrkDay, RplcBudgetAllowed, FirstAsmntMonths, AssessReminderDueDay) VALUES ( UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  con.query(sql, [body.ClientName, body.CntrRplcMMnth, body.EmailID, body.AppBaseLink, body.LogoImage, body.TimeZone, body.HrsPerDay, body.NoOfWrkDay, body.RplcBudgetAllowed, body.FirstAsmntMonths, body.AssessReminderDueDay], function (error) {
    if (error) res.send({ 'm': error.code });
    else res.send({ 'm': 'Added' })
  });

})

app.post('/email_templates', (req, res) => {
  if (!req.headers['accesskey'] || !lock(req.headers['accesskey'])) { res.send('No priv'); return 0 }
  console.log(req.body)
  body = req.body
  connect()
  sql = "INSERT INTO email_templates (ID, Name, CreateDate, Content, Subject, NotificationType, EventType, OrganizationID) VALUES ( UUID(), ?, ?, ?, ?, ?, ?, ?)"
  con.query(sql, [body.Name, body.CreateDate, body.Content, body.Subject, body.NotificationType, body.EventType, body.OrganizationID], function (error) {
    if (error) res.send({ 'm': error.code });
    // if (error) throw error;
    else res.send({ 'm': 'Added' })
  });

})

app.listen(3002)