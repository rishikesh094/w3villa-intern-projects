const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 

// Multer Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // unique name
  },
});

const upload = multer({ storage });


app.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    console.log("File uploaded:", req.file.originalname);
    res.json({ message: "File uploaded successfully", file: `/uploads/${req.file.filename}` });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

app.get("/files", (req, res) => {
  try {
    fs.readdir(path.join(__dirname, "uploads"), (err, files) => {
      if (err) {
        console.error("Error reading uploads directory:", err);
        return res.status(500).json({ error: "Unable to fetch files" });
      }

      const filePaths = files.map((f) => `/uploads/${f}`);
      res.json(filePaths);
    });
  } catch (error) {
    console.error("Files fetch error:", error);
    res.status(500).json({ error: "Failed to fetch files" });
  }
});

app.delete("/delete/:filename", (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "uploads", filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return res.status(500).json({ error: "Failed to delete file" });
      }
      console.log("File deleted:", filename);
      res.json({ message: "File deleted successfully" });
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete file" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server started at http://localhost:${PORT}`);
});
