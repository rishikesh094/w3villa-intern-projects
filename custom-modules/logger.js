const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'app.log');

function log(message) {
  const time = new Date().toISOString();
  const fullMessage = `[${time}] ${message}`;
  
  console.log(fullMessage);
  fs.appendFileSync(logFilePath, fullMessage + '\n');
}

module.exports = { log };
