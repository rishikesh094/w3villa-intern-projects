const express = require("express");
const joi = require("joi");
const app = express();
const PORT = 3000;

app.use(express.json())

const userSchema = joi.object({
  username: joi.string().alphanum().min(3).max(30).required(),
  email: joi.string().email().required(),
  password: joi.string().min(3).max(10)
});

app.post("/", (req, res) => {
     const {error, value} = userSchema.validate(req.body);

    if(error){
        return res.status(400).json({msg:"Invalid credentials"})
    }
    res.status(201).json({msg:"Success"})
});

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
