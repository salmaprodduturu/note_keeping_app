// Get Note by ID
app.get('/api/notes/:id', (req, res) => {
    const notes = readNotesFromFile();
    const note = notes.find(n => n._id === req.params.id);
    res.json(note);
});

// Archive Note
app.patch('/api/notes/:id/archive', (req, res) => {
    const notes = readNotesFromFile();
    const note = notes.find(n => n._id === req.params.id);
    if (note) {
        note.archived = true;
        writeNotesToFile(notes);
        res.json(note);
    } else {
        res.status(404).json({ message: 'Note not found' });
    }
});

// Trash Note
app.patch('/api/notes/:id/trash', (req, res) => {
    const notes = readNotesFromFile();
    const note = notes.find(n => n._id === req.params.id);
    if (note) {
        note.trashed = true;
        note.trashedDate = new Date();
        writeNotesToFile(notes);
        res.json(note);
    } else {
        res.status(404).json({ message: 'Note not found' });
    }
});

// Delete Note Permanently
app.delete('/api/notes/:id', (req, res) => {
    let notes = readNotesFromFile();
    notes = notes.filter(n => n._id !== req.params.id);
    writeNotesToFile(notes);
    res.status(204).end();
});
