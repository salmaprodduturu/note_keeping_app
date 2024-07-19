const fs = require('fs');
const path = require('path');

const notesFilePath = path.join(__dirname, '../data/notes.json');

const getNotesData = () => {
  const notesData = fs.readFileSync(notesFilePath, 'utf-8');
  return JSON.parse(notesData);
};

const saveNotesData = (notes) => {
  fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 2));
};

exports.getNotes = (req, res) => {
  const notes = getNotesData();
  res.json(notes);
};

exports.createNote = (req, res) => {
  const { title, content, tags, backgroundColor } = req.body;
  const notes = getNotesData();

  const newNote = { id: Date.now(), title, content, tags, backgroundColor, archived: false, trashed: false };
  notes.push(newNote);
  saveNotesData(notes);

  res.status(201).json(newNote);
};

exports.updateNote = (req, res) => {
  const { id } = req.params;
  const { title, content, tags, backgroundColor, archived, trashed } = req.body;
  const notes = getNotesData();

  const noteIndex = notes.findIndex(n => n.id == id);
  if (noteIndex === -1) {
    return res.status(404).json({ message: 'Note not found' });
  }

  notes[noteIndex] = { ...notes[noteIndex], title, content, tags, backgroundColor, archived, trashed };
  saveNotesData(notes);

  res.json(notes[noteIndex]);
};

exports.deleteNote = (req, res) => {
  const { id } = req.params;
  const notes = getNotesData();

  const noteIndex = notes.findIndex(n => n.id == id);
  if (noteIndex === -1) {
    return res.status(404).json({ message: 'Note not found' });
  }

  notes.splice(noteIndex, 1);
  saveNotesData(notes);

  res.json({ message: 'Note deleted' });
};
