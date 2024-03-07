/* eslint-disable */ // Disable annoying ESLint underlining

const locations = require("./database/locations.json");
const sessions = require("./database/sessions.json");

const express = require("express");
const app = express();
const port = 3000;
const sqlite3 = require("sqlite3").verbose();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Local in-memory database initialization
// TWO TABLES: sessions for storing session, which links to a locations table storing the current locations
// Current locations table schema: { name, description, lat, long }
// Current session table schema: { title, room }
const db = new sqlite3.Database("./database/db");
const ids = { locID: locations.length, sessID: sessions.length };

// Example SQL join statement + multi-column foreign key: https://stackoverflow.com/a/3178747/5661257
// SQL join statement reference: https://www.w3schools.com/sql/sql_join.asp
// SQLite reference: https://www.tutorialspoint.com/sqlite/sqlite_insert_query.htm
// SQL primary key ref: https://www.w3schools.com/sql/sql_primarykey.asp
db.serialize(function () {
  db.get("SELECT MAX(id) as max FROM locations", function (err, row) {
    if (err) {
      db.run(
        "CREATE TABLE IF NOT EXISTS locations (id INT PRIMARY KEY, name VARCHAR, description VARCHAR, lat FLOAT, long FLOAT)",
        function (err) {
          if (err) {
            throw err;
          }
          const stmt = db.prepare(
            "INSERT INTO locations VALUES (?, ?, ?, ?, ?)",
          );
          for (let i = 0; i < locations.length; i++) {
            const e = locations[i];
            stmt.run(i, e.name, e.description, e.lat, e.long);
          }
          stmt.finalize();
        },
      );
    } else {
      ids.locID = row.max + 1;
    }
  });
  db.get("SELECT MAX(id) AS max FROM sessions", function (err, row) {
    if (err) {
      db.run(
        "CREATE TABLE IF NOT EXISTS sessions (id INT PRIMARY KEY, title VARCHAR, room VARCHAR, locationID INT REFERENCES locations(locationID))",
        function (err) {
          if (err) {
            throw err;
          }
          const stmt2 = db.prepare("INSERT INTO sessions VALUES (?, ?, ?, ?)");
          for (let i = 0; i < sessions.length; i++) {
            const e = sessions[i];
            stmt2.run(i, e.title, e.room, e.locationID);
          }
          stmt2.finalize();
        },
      );
    } else {
      ids.sessID = row.max + 1;
    }
  });
});

// Make the request endpoints to retrieve data from and modify the in-memory sqlite3 database
app
  .get("/locations", (req, res) => {
    db.serialize(function () {
      db.all("SELECT * FROM locations;", function (err, rows) {
        if (err) {
          res.status(500).send(`${err.name}: ${err.message}`);
        }
        res.status(200).send(rows);
      });
    });
    // Endpoint to retrieve the list of sessions associated with a location
  })
  .get("/locations/:locationID", (req, res) => {
    const params = req.params;
    db.serialize(function () {
      db.all(
        "SELECT * FROM sessions WHERE locationID = ?",
        params.locationID,
        function (err, rows) {
          if (err) {
            res.status(500).send(`${err.name}, ${err.message}`);
          }
          res.status(200).send(rows);
        },
      );
    });
    // Endpoint to add a new location
  })
  // Endpoint to add a new session to a location
  .put("/locations/:locationID", (req, res) => {
    const body = req.body;
    const params = req.params;
    if (body.title) {
      db.run(
        "INSERT INTO sessions VALUES (?, ?, ?, ?)",
        [ids.sessID, body.title, body.room ?? null, params.locationID],
        function (err) {
          if (err) {
            res.status(500).send(`${err.name}: ${err.message}`);
          } else {
            ids.sessID += 1;
            res.status(201).end();
          }
        },
      );
    } else {
      res
        .status(400)
        .send(
          "Invalid session! Sessions must be given with title and room number specifed!",
        );
    }
  })
  // Endpoint to add a new location to the database.
  .put("/locations", (req, res) => {
    const body = req.body;
    if (body.name && body.description && body.lat && body.long) {
      db.run(
        "INSERT INTO locations VALUES (?, ?, ?, ?, ?)",
        [ids.locID, body.name, body.description, body.lat, body.long],
        function (err) {
          if (err) {
            res.status(500).send(`${err.name}: ${err.message}`);
          } else {
            ids.locID += 1;
            res.status(201).end();
          }
        },
      );
    } else {
      res
        .status(400)
        .send(
          "Invalid location format! Locastion must be given with name, description, long, and lat",
        );
    }
  })
  .delete("/locations/:locationID", (req, res) => {
    db.run(
      "DELETE FROM locations WHERE locationID = ?",
      req.params.locationID,
      function (err) {
        if (err) {
          res.status(500).send(`${err.name}: ${err.message}`);
        } else {
          db.run(
            "DELETE FROM sessions WHERE locationID = ?",
            req.params.locationID,
            function (err) {
              if (err) {
                res.status(500).send(`${err.name}: ${err.message}`);
              } else {
                res.status(200).end();
              }
            },
          );
        }
      },
    );
  })
  .delete("/locations/:locationID/:sessionID", (req, res) => {
    db.run(
      "DELETE FROM sessions WHERE locationID = ? AND sessionID = ?",
      [req.params.locationID, req.params.sessionID],
      function (err) {
        if (err) {
          res.status(500).send(`${err.name}: ${err.message}`);
        } else {
          res.status(200).end();
        }
      },
    );
  });

// Listen on localhost port 3000 for database connections
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
