import { Server, Socket } from "socket.io";
import http from 'http';

export class WebsocketGateway {
    private io: Server | null = null;

    constructor(private server: http.Server) {
        this.io = new Server(server, {
            cors: {
                origin: 'http://192.168.170.33:5173',
                methods: ['GET', 'POST']
            }
        })

        this.io.on('connection', (socket: Socket) => {
            console.log(`Client connected: ${socket.id}`)

            socket.on('disconnect', () => {
                console.log(`Client disconnect: ${socket.id}`)
            })
        })
    }

    emitPayload<T>(event: string, payload: T) {
        if (!this.io) {
            throw new Error('Websocket no initialize')
        }
        this.io.emit(event, payload)
    }
}