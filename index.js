// code away!
const server = require('./server');

const port = 5000;

server.listen(port, () => {
    console.log(`\n*** The server is fired up on port ${port} **\n`);
})
