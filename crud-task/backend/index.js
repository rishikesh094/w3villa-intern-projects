const express = require("express");
const router = require("./routes/itemRoute");
const { ConnectDB } = require("./connection/connectDB");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
ConnectDB();

app.get("/", (req, res) => {
  res.end("Hello");
});

app.use("/", router);

app.listen(3000, () => {
  console.log("Server started");
});
