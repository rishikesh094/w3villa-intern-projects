const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 4000;

app.use(express.json());

const filePath = path.join(__dirname, "task.log");

app.post("/todos", (req, res) => {
  console.log(req.body);
  const data = JSON.stringify(req.body) + "\n";

  fs.appendFile(filePath, data, (err) => {
    if (err) {
      console.error("Error writing to file", err);
      return res.status(500).send("Error writing to file");
    }
    res.end("Data saved in task.log");
  });
});

app.get("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile(filePath, "utf8", (err, fileData) => {
    if (err) {
      console.error("Error reading file", err);
      return res.status(500).send("Error reading file");
    }

    if (!fileData.trim()) {
      return res.status(404).send("No todos found");
    }

    const todos = fileData
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line));

    const todo = todos.find((t) => t.id === id);

    if (!todo) {
      return res.status(404).send("Todo not found");
    }

    res.json(todo);
  });
});

app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile(filePath, "utf8", (err, fileData) => {
    if (err) {
      console.error("Error reading file", err);
      return res.status(500).send("Error reading file");
    }

    if (!fileData.trim()) {
      return res.status(404).send("No todos found");
    }

    let todos = fileData
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line));
    const initialLength = todos.length;

    todos = todos.filter((t) => t.id !== id);

    if (todos.length === initialLength) {
      return res.status(404).send("Todo not found");
    }

    const updatedData = todos.map((t) => JSON.stringify(t)).join("\n") + "\n";
    fs.writeFile(filePath, updatedData, (err) => {
      if (err) {
        console.error("Error writing file", err);
        return res.status(500).send("Error saving updated todos");
      }
      res.send(`Todo with id ${id} deleted successfully`);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
