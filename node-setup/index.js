const http = require('http')
const port = 3000;

const server = http.createServer((req, res)=>{
    if(req.url == "/"){
        res.write("<h1>Hello World</h1>");
        res.end();
    }
});



server.listen(port, ()=>{
    console.log(`Server started on PORT: ${port}`)
})