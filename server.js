const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 5000;
const DATA_PATH = path.join(__dirname, "people.json");

app.use(cors());
app.use(express.json());

// Helper functions to read/write JSON file
function readPeople() {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

function writePeople(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// ✅ Create (POST)
app.post("/people/new", (req, res) => {
  const people = readPeople();
  const newPerson = { id: Date.now().toString(), ...req.body };
  people.push(newPerson);
  writePeople(people);
  res.status(201).json(newPerson);
});

// ✅ Read all (GET)
app.get("/people", (req, res) => {
  res.json(readPeople());
});

// ✅ Read by ID (GET)
app.get("/people/:id", (req, res) => {
  const person = readPeople().find(p => p.id === req.params.id);
  person ? res.json(person) : res.status(404).json({ message: "Not found" });
});

// ✅ Update (PUT)
app.put("/people/:id", (req, res) => {
  const people = readPeople();
  const idx = people.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Not found" });
  people[idx] = { ...people[idx], ...req.body };
  writePeople(people);
  res.json(people[idx]);
});

// ✅ Delete (DELETE)
app.delete("/people/:id", (req, res) => {
  const people = readPeople();
  const idx = people.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Not found" });
  const removed = people.splice(idx, 1)[0];
  writePeople(people);
  res.json(removed);
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});