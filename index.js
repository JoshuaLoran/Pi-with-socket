const WebSocket = require('ws')
const url = 'http://agile-reef-99245.herokuapp.com/cable'
const connection = new WebSocket(url)


    const msg = {
        command: 'subscribe',
        identifier: JSON.stringify({
            channel: 'DevicesChannel'
        })
    }
    connection.onopen = () => {
        connection.send(JSON.stringify(msg))
        console.log('Connected Successfully')
    }

    connection.onerror = error => {
        console.log(`WebSocket error: ${error}`)
    }

    connection.onmessage = e => {
        console.log(e.data)
    }








