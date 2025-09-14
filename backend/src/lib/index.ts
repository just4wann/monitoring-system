import net from 'net';
import EventEmitter from 'events';

import type { Socket } from 'net';
import { IConnectionError } from '@/types/index.js';

const defaultport = 9094;
const localhost = '127.0.0.1';
const defaulttimeout = 5000;

export default class MewtocolClient extends EventEmitter {
  private host: string;
  private port: number;
  private timeout: number;
  private socket: Socket;
  private dataReceived: number[];
  private error?: Error | IConnectionError | string;

  constructor(host?: string, port?: number, timeout?: number) {
    super();
    this.socket = new net.Socket();
    this.host = host || localhost;
    this.port = port || defaultport;
    this.timeout = timeout || defaulttimeout;
    this.socket.setTimeout(this.timeout);

    this.socket.on('close', (hadError) => {
      console.log('connection closed')
      this.emit('disconnect', hadError);
      return;
    });

    this.socket.on('timeout', () => {
      console.log('connection timeout')
      this.emit('timeout', { error: 'Socket idle timeout' });
      this.destroy();
    });

    this.socket.on('connect', () => {
      this.emit('connect', { host: this.host, port: this.port });
    });

    this.dataReceived = [];
  }

  private connect() {
    this.socket.connect({ port: this.port, host: this.host });
  }

  private destroy() {
    this.socket.destroy();
  }

  private parseIntArray(data: string): number[] {
    const responseDataOnly = data.slice(6, data.length);
    let hexArrData: number[] = [];
    let resultData: number[] = [];
    for (let i = 0; i < responseDataOnly.length / 4; i++) {
      let hexStr: string = '';
      for (let j = i * 4; j < (i + 1) * 4; j++) {
        hexStr += responseDataOnly[j];
      }
      hexArrData.push(parseInt(hexStr, 16));
    }
    for (let i = 0; i < hexArrData.length; i++) {
      resultData.push((hexArrData[i] >> 8) | ((hexArrData[i] & 0x0001) << 8));
    }
    return resultData;
  }

  private async sendCommand(cmd: string): Promise<void> {
    const client = this;
    if (client.socket.destroyed || client.socket.closed) {
      console.log('reconnetc')
      client.connect();
    }

    let timeout: NodeJS.Timeout;

    if (!cmd.endsWith('\r')) cmd += '\r';

    return new Promise((resolve, reject) => {
      client.socket.write(cmd, () => {
        timeout = setTimeout(function () {
          reject('Timeout read data from PLC');
        }, client.timeout);
      });
  
      client.socket.once('data', (buff) => {
        try {
          const stringbuff: string = buff.toString();
          const dataBuff = stringbuff.slice(0, buff.length - 3);
          client.dataReceived = client.parseIntArray(dataBuff);
          resolve();
          clearTimeout(timeout);
          client.socket.end();
        } catch (error) {
          reject(error);
        }
      });
  
      client.socket.once('error', (err) => {
        reject(err);
      });
    })
  }

  public async ReadDataMemory(stationNo: number, area: string, startaddr: number, endaddr: number): Promise<void> {
    let cmdchar: string = '%';
    const areas: string[] = ['D', 'L', 'F'];
    const station: string = stationNo.toString().padStart(2, '0');

    if (endaddr < startaddr) {
      console.error({ error: 'endaddr must be greater or equal to startaddr' });
      return;
    }

    if (endaddr - startaddr > 20) cmdchar = '<';

    if (!areas.includes(area)) {
      console.error({ error: 'Invalid area. Valid areas for registers are D,L,F' });
      return;
    }

    const cmd: string = cmdchar + station + '#RD' + area + startaddr.toString().padStart(5, '0') + endaddr.toString().padStart(5, '0') + '**\r';

    return new Promise(async (resolve, reject) => {
      try {
        await this.sendCommand(cmd);
        resolve();  
      } catch (error) {
        this.error = error as Error | string | IConnectionError;
        reject(error)
      }
    })
  }

  public getData(): number[] {
    return this.dataReceived;
  }

  public getError(): Error | string | IConnectionError | undefined {
    return this.error;
  }
}