import mqtt from 'mqtt';

const client = mqtt.connect({ host: 'localhost' , port: 1883 })
client.on('connect', () => {
    console.log('MQTT Connection Success')
})
export default client;