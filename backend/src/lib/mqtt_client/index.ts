import client from "@/utils/mqtt_client.js";
export default class MqttClient {
    constructor() {}

    public static publishMessage<T>(topic: string, payload: T) {
        client.publish(topic, JSON.stringify(payload));
    }

    public static subscribe<T>(topic: string, callback: (msg: T) => void) {
        client.subscribe(topic)
        client.on('message', (topicMsg, payload) => {
            if (topicMsg == topic) {
                callback(JSON.parse(payload.toString()))
            }
        })
    }
}