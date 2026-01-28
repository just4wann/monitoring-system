import FTPClient from "@/lib/ftp_client/index.js";
import MqttClient from "@/lib/mqtt_client/index.js";
import { IPublishTopicPayload, ISubscribeTopicPayload, type ListFTPType } from "@/types/index.js";

type IParameterOptional = {
  start?: number;
  finish?: number;
  ms?: number;
}

const AVOID_NUMBERS: string[] = ['21', '22', '23']

export function generateDate(at: Date | string): string {
    if (at == '') {
      return 'Unavailable'
    }
    const date = new Date(at);
    const formatDate = date.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })

    return formatDate;
}

export async function getDataFTPOven(ovenFTPClient: FTPClient, start: string | Date, end: string | Date, ovensNomor: string[], ovenType: string): Promise<ListFTPType[]> {
    let ovenDatas: ListFTPType[] = [];
    const result = await ovenFTPClient.getDataFromRange(start, end, ovenType)

    const listNumber: string[] = []
    for (let i = 0; i < ovensNomor.length; i++) {
        AVOID_NUMBERS.includes(ovensNomor[i]) ? listNumber[i] = ovensNomor[i].slice(-1) : listNumber[i] = ovensNomor[i]
    }

    for (let i = 0; i < listNumber.length; i++) {
        let temp: {temperature: string, timestamp: string}[] = []
        for (let j = 1; j < result.length; j++) {
            if (result[j]['����'].slice(-2) === "10") {
                const val = result[j][listNumber[i]].trim()
                const ts = `${result[j]['���t']}, ${result[j]['����'].slice(0, result[j]['����'].length - 3)}`
                temp.push({
                    temperature: ovenType === 'mangan' ? val.slice(0, val.length - 1) : val,
                    timestamp: ts
                });
            }
        }
        ovenDatas.push({
            name: ovenType,
            no: ovensNomor[i],
            values: temp
        });
    }

    return ovenDatas
}

export function getFilenames(start: string | Date, end: string | Date, ovenType: string) {
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

export async function getDataOven(files: string[], ovenType: string, ovensNomor: string[]): Promise<ListFTPType[]> {
    return new Promise((resolve, _reject) => {
        const payload = { files, ovenType }
        MqttClient.publishMessage<IPublishTopicPayload>('topic/request', payload);
        const ovenData: ListFTPType[] = []
        MqttClient.subscribe<ISubscribeTopicPayload[]>('topic/response', (data) => {
            for (let i = 0; i < ovensNomor.length; i++) {
                const temp: { temperature: string, timestamp: string }[] = []
                for (let j = 0; j < data.length; j++) {
                    if ( data[j].timestamp.slice(-2) == '10' ) {
                        const value = data[j][`Oven ${ovensNomor[i]}` as keyof ISubscribeTopicPayload].toString()
                        const ts = data[j].timestamp
                        temp.push({
                            temperature: ovenType == 'mangan' ? value.slice(0, value.length - 1) : value,
                            timestamp: ts
                        })
                    }
                }
                ovenData.push({
                    name: ovenType,
                    no: ovensNomor[i],
                    values: temp
                })
            }
            resolve(ovenData)
        })
    })
}

export function generateDuration({ start, finish, ms }: IParameterOptional = {}): string {
    if (ms) {
      if (ms == null || ms == -1) return '---';
  
      let diffMs = ms;
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      diffMs -= hours * (1000 * 60 * 60);
      const minutes = Math.floor(diffMs / (1000 * 60));
      return `${hours} h ${minutes} m`;
    }
  
    let diffMs = finish! - start!;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    diffMs -= hours * (1000 * 60 * 60);
    const minutes = Math.floor(diffMs / (1000 * 60));
    return `${hours} hour ${minutes} minute`;
  
  }