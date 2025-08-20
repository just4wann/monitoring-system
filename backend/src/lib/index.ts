import net from 'net';
import EventEmitter from 'events';

import type { Socket } from 'net';

const defaultport = 9094;
const localhost = '127.0.0.1';
const defaulttimeout = 5000;

export class MewtocolClient extends EventEmitter {
  private host: string;
  private port: number;
  private timeout: number;
  private socket: Socket;
  private dataReceived: number[];

  constructor(host: string, port: number, timeout: number) {
    super();
    this.socket = new net.Socket();
    this.host = host || localhost;
    this.port = port || defaultport;
    this.timeout = timeout || defaulttimeout;
    this.socket.setTimeout(this.timeout);

    this.socket.on('close', (hadError) => {
      this.emit('disconnect', hadError);
      return;
    });

    this.socket.on('timeout', () => {
      this.emit('timeout', { error: 'Socket idle timeout' });
      this.destroy();
    });

    this.socket.on('connect', () => {
      this.emit('connect', { host: this.host, port: this.port });
    });

    this.connect();
    this.dataReceived = [];
  }

  private connect() {
    this.socket.connect({ port: this.port, host: this.host });
  }

  private destroy() {
    this.socket.destroy();
  }

  private parseIntArray(data: string): number[] {
    let arr: number[] = [];
    for (let i = 0; i < data.length; i = i + 4) {
      const hexstr: string = data[i + 2] + data[i + 3] + data[i] + data[i + 1];
      let val: number = parseInt(hexstr, 16);
      if ((val & 0x8000) > 0) {
        val = val - 0x10000;
      }
      arr.push(val);
    }
    return arr;
  }

  private sendCommand(cmd: string) {
    const client = this;
    if (client.socket.destroyed) client.connect();
    let timeout: NodeJS.Timeout;
    let dataBuff: string = '';
    const cmdchar: string = cmd.slice(0, 1);
    const station: string = cmd.slice(1, 3);

    if (!cmd.endsWith('\r')) cmd += '\r';

    client.socket.write(cmd, () => {
      timeout = setTimeout(function () {
        client.emit('timeout', { error: 'Timeout waiting for the data from PLC' });
        return;
      }, client.timeout);
    });

    client.socket.on('data', function (buff) {
      let stringbuff: string = buff.toString();
      dataBuff = stringbuff.slice(0, buff.length - 3);
      clearTimeout(timeout);
    });

    this.dataReceived = this.parseIntArray(dataBuff);

    client.socket.on('error', (err) => {
      client.emit('error', { error: 'TCP socket error', msg: err });
      return;
    });
  }

  public ReadDataMemory(stationNo: number, area: string, startaddr: number, endaddr: number) {
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
    this.sendCommand(cmd);
  }

  public getData(): number[] {
    return this.dataReceived;
  }
}
