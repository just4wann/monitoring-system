import MewtocolClient from "@/lib/index.js";
import type { Response } from "express";

export default class SSEService {
    constructor(private mewTocol: MewtocolClient) {}

    public emitStatus(client: Response) {
        const data = {
            status: this.mewTocol.getError(),
            timestamp: new Date()
        }

        client.write(`data: ${JSON.stringify(data)}\n\n`);
        console.log('Status sent: ', data)
    }
}