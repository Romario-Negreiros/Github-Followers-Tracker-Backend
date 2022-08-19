import http from 'http'

const server = http.createServer()

server.listen(3300)

server.on('listening', () => console.log('running'))
