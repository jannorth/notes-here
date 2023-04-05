const express = require("express");
const path = require("path");
const fs = require("fs");
const db = require("./db/db.json");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const PORT = 3001;

app.use(express.static("public"));

// app.get('*', (req, res) => res.send("This page doesn't exist!"));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

app.get("/api/notes", (req, res) => res.json(db));

app.post("/api/notes", (req, res) => {
  console.log(req.body.text)
  const newNote = {
   title: req.body.title,
   text: req.body.text,
   id: req.body.id,
  };
  console.log(newNote);
  db.push(newNote);
  fs.writeFile("./db/db.json", JSON.stringify(db), (err) => {
    if (err) throw err;
    res.json(newNote);
  });
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
