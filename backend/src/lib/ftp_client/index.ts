import ftp from 'basic-ftp'
import csv from 'csv-parser'
import type { Client } from 'basic-ftp';
import { Readable, Writable } from 'stream';

export default class FTPClient {
  private ip: string = '';
  private port: number = 21;
  constructor(ip: string, port: number) {
    this.ip = ip;
    this.port = port;
  }

  private async createClient(): Promise<Client> {
    const client: Client = new ftp.Client();
    client.ftp.verbose = false;
    await client.access({
        host: this.ip,
        port: this.port,
        user: 'OVEN',
        password: 'Pecgi_22'
    })
    return client
  }

  private generateCsvFilename(start: string | Date, end: string | Date, ovenType: string): string[] {
    const names: string[] = []
    let current = new Date(start)

    while (current <= end) {
        const year = String(current.getFullYear()).slice(-2)
        const month = String(current.getMonth() + 1).padStart(2, "0")
        const day = String(current.getDate()).padStart(2, "0")
        const hour = String(current.getHours()).padStart(2, "0")
        switch (ovenType) {
            case 'mangan':
                names.push(`Oven Mangan(${year}${month}${day}_${hour}0010).csv`)
            break;
            case 'bobin':
                names.push(`F1_Oven_Bobbin(${year}${month}${day}_${hour}0010).csv`)
            break;
            case 'bubuk':
                names.push(`F1_Oven_Bubuk(${year}${month}${day}_${hour}0010).csv`)
            break;
        }
        current.setHours(current.getHours() + 1)
    }
    return names
  }

  private async readCsvStream(client: Client, filePath: string, onRow: (row: Record<string, string>) => void): Promise<void> {
    const chunks: Buffer[] = [];

    const writeable = new Writable({
        write(chunk, _encoding, callback) {
            chunks.push(chunk);
            callback();
        },
    })
    await client.downloadTo(writeable, filePath);

    const buffer = Buffer.concat(chunks);
    const stream = Readable.from(buffer.toString());
    return new Promise((resolve, reject) => {
        stream
            .pipe(csv())
            .on('data', onRow)
            .on('end', resolve)
            .on('error', reject)
    })
  }

  private async getLastRowCsv(): Promise<Record<string, string> | null> {
    const client = await this.createClient();
    try {
        const chunks: Buffer[] = []
        const writeable = new Writable({
        write(chunk, _encoding, callback) {
                chunks.push(chunk);
                callback();
            },
        })
        await client.downloadTo(writeable, `/LOG0/Oven Mangan(-----current-----).csv`)
        const content = Buffer.concat(chunks).toString()

        const lines = content.trim().split("\n")
        const header = lines[0].split(",")
        const lastLine = lines.at(-1)?.split(",") ?? []

        const result: Record<string, string> = {}
        console.log(header)
        console.log(lines)
        header.forEach((h, i) => {
            result[h] = lastLine[i]
        })

        return result
    } finally {
        client.close()
    }
  }

  public startReadRealtime(interval: number): void {
    setInterval(async () => {
        const row = await this.getLastRowCsv()
        if (row) console.log("Realtime last row:", row)
    }, interval)
  }
  
  public async getDataFromRange(start: string | Date, end: string | Date, ovenType: string): Promise<Record<string, string>[]> {
    const client = await this.createClient()
    const fileNames = this.generateCsvFilename(start, end, ovenType)
    const results: Record<string, string>[] = [];

    const listAvoidRow: string[] = ['', 'MOMENT', 'US', '�C']
    for (const name of fileNames) {
        try {
            console.log("Process file:", name)
            await this.readCsvStream(client, `LOG0/${name}`, row => {
                if (!listAvoidRow.includes(row['1'])) {
                    results.push(row)   
                }
            })
        } catch (err: any) {
            console.warn(`File ${name} error/ga ada:`, err.message)
            console.warn('Trying read file current....');
            let currentFileName = '';
            switch (ovenType) {
                case 'mangan' :
                    currentFileName = 'LOG0/Oven Mangan(-----current-----).csv'
                break;
                case 'bobin' :
                    currentFileName = 'LOG0/F1_Oven_Bobbin(-----current-----).csv'
                break;
                case 'bubuk' :
                    currentFileName = 'LOG0/F1_Oven_Bubuk(-----current-----).csv'
                break;
            }
            await this.readCsvStream(client, currentFileName, row => {
                if (!listAvoidRow.includes(row['1'])) {
                    results.push(row);
                }
            })
            console.info('Success read file current.')
            break;
        }
    }

    client.close()
    return results
  }
}