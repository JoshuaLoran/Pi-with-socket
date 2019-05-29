var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var LED1 = new Gpio(4, 'out'); //use GPIO pin 4, and specify that it is output
// var LED17 = new Gpio(17, 'out');
var pushButton = new Gpio(17, 'in', 'both');
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
        data = JSON.parse(e.data)
        if (typeof data.message === 'object'){
            controlDevices(data.message)
            console.log(data.message)
        } 
    
    }

    pushButton.watch(function (err, value){
        if(err){
            console.log('There was an error', err)
            return
        }
        if(value === 1){
            sendDeviceNews('off')
        }
        
    })

    function unexportOnClose(){
        LED1.writeSync(0);
        LED1.unexport();
        pushButton.unexport();
    }

    process.on('SIGINT', unexportOnClose);

    function controlDevices(device){
        console.log('Device: ',device)
        if(device.id === 1){
            if(device.commands[0]==='on'){
                LED1.writeSync(1)
            } else {
                LED1.writeSync(0)
            }
            } 
        //     if(device.id === 2){
        //     if(device.commands[0]==='on'){
        //         LED17.writeSync(1)
        //     } else {
        //         LED17.writeSync(0)
        //     }
        // }
    
    }

    function sendDeviceNews(state){
        const sendData = {
            command: 'message',
            identifier: JSON.stringify({
                channel: 'DevicesChannel'
            }),
            data: JSON.stringify({
                id: 10,
                commands: [state]
            })
        }
        console.log(sendData)
        connection.send(JSON.stringify(sendData))
    }
      








