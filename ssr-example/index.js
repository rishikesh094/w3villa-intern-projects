const express = require("express");
const path = require("path")
const app = express();

const PORT = 5000;

app.set("view engine","ejs")
app.set("views",path.resolve("./views"));


app.get("/",(req, res)=>{
    const user = { name: "Ritesh", age: 21 };
    res.render("index",{user})
})


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});