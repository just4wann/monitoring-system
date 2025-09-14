// import MewtocolClient from "@/lib/index.js";
// import SSEService from "@/service/sse.service.js";
// import type { Request, Response } from "express";

// export default class SSEController {
//     private sse: SSEService;
//     constructor(private mewTocol: MewtocolClient) {
//         this.sse = new SSEService(this.mewTocol);
//     }

//     public emit(req: Request, res: Response) {
//         res.setHeader("Content-Type", "text/event-stream");
//         res.setHeader("Cache-Control", "no-cache");
//         res.setHeader("Connection", "keep-alive");

//         this.sse.emitStatus(res);

//     }
// }