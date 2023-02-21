//CORE MODULE IMPORT
const { stat } = require('fs');
const http = require('http');

const todos =[{id:1, text: 'Todo One'},{id:2, text: 'Todo Two'},{id:3, text: 'Todo Three'}];

//CREATE SERVER
const server = http.createServer((request, response) => {
    //Destructure request 
    const { method, url } = request;
    let body=[];

    request.on('data', chunk => {
        body.push(chunk);
    }).on('end', () => {

        body = Buffer.concat(body).toString();

        //initialze 404 by default
        let status = 404;
        const res = {
            success: false,
            data: null,
            error: null
        }

        if(method === 'GET' && url === '/todos'){
            status = 200;
            res.success = true;
            res.data = todos;
        } else if(method === 'POST' && url === '/todos'){
            const { id, text } = JSON.parse(body);
            if(!id || !text){
                status = 400;
                res.success= false;
                res.data = null;
                res.error = 'Please add id and text';
            }else{
                todos.push({ id, text });
                status = 201;
                res.success = true;
                res.data = todos;
            }
        }

        response.writeHead(status, {
            'Content-type': 'application/json',
            'X-Powered-By': 'Node.js'
        });

        response.end(JSON.stringify(res));
    })
});

//SERVER LISTEN TO PORT
const PORT = 5000;
server.listen(PORT, () => console.log(`Server listening on PORT ${PORT}`));


/** HTTP STATUS CODES
 * 
 * 1XX SERIES - INFORMATIONAL
 * 
 * 2XX SERIES - Success
 * 200 Success
 * 201 Created
 * 204 No Content
 * 
 * 4XX SERIES - Client Error
 * 400 Bad Request
 * 401 Unauthorized
 * 404 Not Found
 * 
 * 
 * 3XX Series 
 * 304 Not Modified
 * 
 * 5XX Series - Server Error
 * 500 Internal Server Error
 * 
 * 
 * 
*/