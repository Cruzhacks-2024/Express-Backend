/* eslint-disable */ // Disable annoying ESLint underlining

const locations = require('./database/locations.json');
const sessions = require('./database/sessions.json');

const express = require('express');
const app = express();
const port = 3000;
const sqlite3 = require('sqlite3').verbose();

// Local in-memory database initialization
// TWO TABLES: locations for storing locations, which links to sessions table storing the current sessions
const db = new sqlite3.Database(':memory:');
let locID = locations.length;
let sessID = sessions.length;
// Example SQL join statement + multi-column foreign key: https://stackoverflow.com/a/3178747/5661257
// SQL join statement reference: https://www.w3schools.com/sql/sql_join.asp
// SQLite reference: https://www.tutorialspoint.com/sqlite/sqlite_insert_query.htm
// SQL primary key ref: https://www.w3schools.com/sql/sql_primarykey.asp
db.serialize(
  function () {
    db.run('CREATE TABLE locations (id INT PRIMARY KEY, name VARCHAR, room VARCHAR, lat FLOAT, long FLOAT)');
    db.run('CREATE TABLE sessions (id INT PRIMARY KEY, title VARCHAR, room VARCHAR, locationID INT REFERENCES locations(locationID))');
    const stmt = db.prepare('INSERT INTO locations VALUES (?, ?, ?, ?, ?)');
    for (let i = 0; i < locations.length; i++) {
      e = locations[i];
      stmt.run(i, e.name, e.description, e.lat, e.long);
    }
    stmt.finalize();

    const stmt2 = db.prepare('INSERT INTO sessions VALUES (?, ?, ?, ?)');
    for (let i = 0; i < sessions.length; i++) {
      e = sessions[i];
      stmt2.run(i, e.title, e.room, e.locationID);
    }
    stmt2.finalize();
  }
);

// Make a GET request to get list of all locations from the in-memory sqlite3 database
app.get('/locations', (req, res) => {
  db.serialize(
    function () {
      db.all("SELECT * FROM locations;",
      function (err, rows) {
        if (err) {
          throw err;
        }
        res.send(rows);
      });
    }
  );
  // Endpoint to retrieve the list of sessions associated with a location
}).get('/locations/:locationID', (req, res) => {
  const params = req.params;
  db.serialize(
    function () {
      db.all("SELECT * FROM sessions WHERE locationID = ?", params.locationID, 
      function (err, rows) {
        if (err) {
          throw err;
        }
        res.send(rows);
      });
    }
  )
  // Endpoint to add a new location
}).put('/locations', (req, res) => {
  const body = req.body;
  if (body.name && body.description && body.lat && body.long) {
    locID += 1;
    db.serialize(
      function () {
        db.run("INSERT INTO locations VALUES (?, ?, ?, ?, ?)", [locID, body.name, body.description, body.lat, body.long]);
      }
    );
    res.status(201).end();
  } else {
    res.status(400).end()
  }
});

// Listen on localhost port 3000 for database connections
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
