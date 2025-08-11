const express = require("express");
const { log } = require("./logger");
const app = express();
const PORT = 4000;

app.get("/",(req, res)=>{
    log("Hello from server");
    res.end();
})

app.listen(PORT,()=>{
    console.log(`Server started at ${PORT}`);
})