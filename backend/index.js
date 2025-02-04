const express = require('express')
const ip = require('ip');

console.log("runnin on ip " + ip.address())

const webserver = express()
    .use((req, res) =>
        res.sendFile('/websocket-client.html', { root: __dirname })
    )
    .listen(3000, () => console.log(`Listening on ${3000}`))

const { WebSocketServer } = require('ws')
const sockserver = new WebSocketServer({ port: 443 })
// const sockserver = new WebSocketServer({ host: "10.0.2.64", port: 443 })

sockserver.on('connection', ws => {
    console.log('New client connected!')

    ws.send('{"message": "connection established"}')

    ws.on('close', () => console.log('Client has disconnected!'))

    ws.on('message', data => {
        let j = JSON.parse(data)
        let d = `{"message": "Recievec ${j.message}, but 😎${j.message}😎 is cooler", "date": ${j.date}, "response": ${Date.now()}}`;
        sockserver.clients.forEach(client => {
            client.send(d)
            console.log(`distributing message: ${d}`)
        })
    })

    ws.onerror = function () {
        console.log('websocket error')
    }
})