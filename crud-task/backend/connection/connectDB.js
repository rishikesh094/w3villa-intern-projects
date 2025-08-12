const mongoose = require("mongoose");

async function ConnectDB(){
    try {
        await mongoose.connect('mongodb+srv://rishikesh123:rishikesh2@cluster0.ct88ugp.mongodb.net/crud-task');
        console.log('✅ Connected to DB');
      } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
      }
    
}

module.exports = {ConnectDB};