var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
const WebSocket = require('ws')
const url = 'http://agile-reef-99245.herokuapp.com/cable'
const connection = new WebSocket(url)

const onOffDeviceId = null  // Replace "null" with the device ID from Home Control, connect to pin 4 on your RaspberryPi
const alarmDeviceId = null // Replace "null" with the device ID from Home Control, connect to pin 17 on your RaspberryPi
const multiDeviceId = null  // Replace "null" with the device ID from Home Control, connect to pin 27 on your RaspberryPi

var PIN1 = new Gpio(4, 'out'); //use GPIO pin 4, and specify that it is output
var PIN2 = new Gpio(27, 'out'); //use GPIO pin 27, and specify that it is output
var pushButton = new Gpio(17, 'in', 'both'); //define GPIO pin 17 as an input

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

    alarmTrigger.watch(function (err, value){
        if(err){
            console.log('There was an error', err)
            return
        }
        if(value === alarmDeviceId){
            sendDeviceNews('off')
        }

    })

    function unexportOnClose(){
        PIN1.writeSync(0);
        PIN1.unexport();
        PIN2.writeSync(0);
        PIN2.unexport();
        alarmTrigger.unexport();
    }

    process.on('SIGINT', unexportOnClose);

    function controlDevices(device){
        if(device.id === onOffDeviceId){
            if(device.commands[0]==='on'){
                PIN1.writeSync(1)
            } else {
                PIN1.writeSync(0)
            }
            }
            if(device.id === multiDeviceId){
            if(device.commands[0]==='on'){
                PIN2.writeSync(1)
            } else {
                PIN2.writeSync(0)
            }
        }

    }

    function sendDeviceNews(state){
        const sendData = {
            command: 'message',
            identifier: JSON.stringify({
                channel: 'DevicesChannel'
            }),
            data: JSON.stringify({
                id: alarmDeviceId,
                commands: [state]
            })
        }
        console.log(sendData)
        connection.send(JSON.stringify(sendData))
    }
