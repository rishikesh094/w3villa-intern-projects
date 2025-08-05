const fs = require("fs");

const inputFile = "./files/input.txt";
const outputFile = "./files/log.txt";

fs.readFile(inputFile,'utf-8',(err,data)=>{
    if(err){
        return console.error("Error on reading file: ",err)
    }

    const line = data.split("\n");

    const output = line.join('\n');

    fs.writeFile(outputFile,output,(err)=>{
        if(err){
            return console.error("Error on log the file: ",err);
        }

        console.log("File is successfully logged!")
    });
} )