const express = require("express");
const fs = require("fs");
const path = require("path");
const PORT = process.env.PORT || 3001;

const app = express();

//Middleware
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Homepage Route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "index.html");
});

//Notes Page Route
app.get("/notes", (req, res) => {
  res.sendFile(__dirname + "/public/notes.html");
});

//JSON Get Route
app.get("/api/notes", (req, res) => {
  fs.readFile(__dirname + "/db/db.json", "utf8", (error, data) => {
    if (error) {
      console.log(error);
    } else {
      let notes = JSON.parse(data);
      res.json(notes);
    }
  });
});

//JSON Post Route
app.post("/api/notes", (req, res) => {
  fs.readFile(__dirname + "/db/db.json", "utf8", (error, data) => {
    if (error) {
      console.log(error);
    } else {
      let notes = JSON.parse(data);
      let newNote = req.body;
      newNote.id = notes.length + 1;
      notes.push(newNote);
      fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notes), (error) => {
        if (error) {
          console.log(error);
        } else {
          res.json(newNote);
        }
      });
    }
  });
});

//DELETE ROUTE USING UNIQUE ID
app.delete("/api/notes/:id", (req, res) => {
  let id = req.params.id;
  fs.readFile(__dirname + "/db/db.json", "utf8", (error, data) => {
    if (error) {
      console.log(error);
    } else {
      let notes = JSON.parse(data);
      notes = notes.filter(note => note.id != id);
      fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notes), (error) => {
        if (error) {
          console.log(error);
        } else {
          res.json({ ok : true})
        }
      })
    }
  })
})


app.listen(PORT, () => {
  console.log("Application listening on " + `http://localhost:${PORT}`);
});