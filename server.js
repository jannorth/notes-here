const express = require("express");
const path = require("path");
const fs = require("fs");
const db = require("./db/db.json");


const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("/public"));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

app.get("/api/notes", (req, res) => res.json(db));

// saves notes in column on left
app.post("/api/notes", (req, res) => {
  console.log(req.body.text);
  console.log(req.params.text);
  const newNote = {
    id: req.params.id,
    title: req.body.title,
    text: req.body.text,
  };
  console.log(newNote);
  db.push(newNote);
  fs.writeFile("./db/db.json", JSON.stringify(db), (err) => {
    if (err) throw err;
    res.json(newNote);
  });
});

// when click on saved note, it appears on right column


// delete note
app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  const updatedNotes = db.filter((note) => note.id !== noteId);

  fs.writeFile(
    path.join(__dirname, "/db/db.json"),
    JSON.stringify(updatedNotes),
    (err) => {
      if (err) throw err;
      console.log(`Note with ID ${noteId} has been deleted.`);
      res.json(updatedNotes);
    }
  );
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
