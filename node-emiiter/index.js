const http = require("http");
const EventEmitter = require("events");
const PORT = 4000;

const event = new EventEmitter()
let count = 0;

event.on("countAPI",()=>{
    count++;
    console.log("Event Called",count)
})

const server = http.createServer((req,res)=>{
    if(req.url=="/"){
        res.end("Hello")
        event.emit("countAPI")
    } else if(req.url=="/about"){
        res.end("About Page")
        event.emit("countAPI")
    } else if(req.url=="/contact"){
        res.end("Contact Page")
        event.emit("countAPI")
    } else {
        res.end("404 Not Found")
    }
});

server.listen(PORT, ()=>{
    console.log(`Server started on PORT ${PORT}`)
})