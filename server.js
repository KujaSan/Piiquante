const http = require('http');
const app = require('./app');

//renvoi d'un port valide
const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)){
        return val;
    }
    if (port >= 0){
        return port;
    }
    return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

//gestion des erreurs
const errorHandler = error =>{
    if (error.syscall !== 'listen'){
        throw error;
    }
    const address = server.address();
    const bind =typeof address === 'string' ? 'pipe' + address: 'port:' + port;
    switch (error.code){
        case 'eacces':
            console.error(bind + 'requires elevated privileges.');
            process.exit(1);
            break;
        case 'eaddrinuse':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const server = http.createServer(app);

//Print dans la console des evenements du port
server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

server.listen(port);