const express = require('express');
const fs = require('fs');
const path = require('path');
const notes = require('./db/db.json');

const PORT = process.env.PORT || 3001;
const app = express();

// Functions
function filterByQuery(query, notesArray) {
    let filteredResults = notesArray;
    if (query.title) {
        filteredResults = filteredResults.filter(note => note.title === query.title);
    }
    if (query.text) {
        filteredResults = filteredResults.filter(note => note.text === query.text);
    }
    return filteredResults;
};

function findById(id, notesArray) {
    result = notesArray.filter(note => note.id === id);
    return result;
};

// Middleware
app.use(express.urlencoded( { extended: true }));
app.use(express.json());
app.use(express.static('public'));

// GET all notes
app.get('/api/notes', (req, res) => {
    let results = notes;
    if (req.query) {
        results = filterByQuery(req.query, results);
        res.json(results);
    }

});

// GET note by id
app.get('/api/note/:id', (req, res) => {
    const result = findById(req.params.id, notes);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
})

// html route
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}`);
});