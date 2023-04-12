const util = require('util');
const fs = require('fs');
const uuid = require('uuid');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class Storage {
  read() {
    return readFileAsync('db/db.json', 'utf8');
  }

  write(note) {
    return writeFileAsync('db/db.json', JSON.stringify(note));
  }

  async getNotes() {
    try {
      const notes = await this.read();
      const parsedNotes = [].concat(JSON.parse(notes));
      return parsedNotes;
    } catch (err) {
      return [];
    }
  }

  async addNote(note) {
    const { title, text } = note;

    if (!title || !text) {
      throw new Error("Fill in all areas");
    }

    const newNote = { title, text, id: uuid() };

    try {
      const notes = await this.getNotes();
      const updatedNotes = [...notes, newNote];
      await this.write(updatedNotes);
      return newNote;
    } catch (err) {
      throw new Error('Failed to add note');
    }
  }

  async removeNote(id) {
    try {
      const notes = await this.getNotes();
      const filteredNotes = notes.filter((note) => note.id !== id);
      await this.write(filteredNotes);
    } catch (err) {
      throw new Error('Failed to remove note');
    }
  }
}

module.exports = new Storage();