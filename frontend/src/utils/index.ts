import { Canvg } from "canvg";
import type { BadgeType, FanStateType, ITemperatureData, OvenStateType } from "../types";

type IParameterOptional = {
  start?: number;
  finish?: number;
  ms?: string;
}

export class UtilityClass {
  constructor() {}

  public static generateCurrentTime(): { timestamp: string[]; current: number[], now: string } {
    const now = new Date();
    return {
      timestamp: [
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZone: 'Asia/Jakarta',
        }),
        now.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          timeZone: 'Asia/Jakarta',
        }),
      ],
      current: [now.getFullYear(), now.getMonth() + 1, now.getDate()],
      now: `${now.getFullYear().toString().slice(-2)}${now.getMonth() + 1}${now.getDate()}_${now.getHours()}${now.getMinutes()}${now.getSeconds()}`
    };
  }
  
  public static generateTimestamp(at: string | Date): string[] {
    if (at == '') {
      return ['Unavailable', 'Unavailable', 'Unavailable']
    }
    const date = new Date(at);
    const formatDate = date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
    });
  
    const time = date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  
    const full = date.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
  
    return [`${time}`, `${formatDate}`, `${full}`];
  }
  
  public static downloadPDF(blob: Blob, ovenType: string, ovenNo: number[]) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${UtilityClass.generateCurrentTime().now}_Report Oven ${ovenType.toUpperCase()}_${ovenNo}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url)
  }
  
  public static getStartFinishPeak(data: ITemperatureData[] | [], target: number): string[] {
    let start: string = '';
    let finish: string = '';
    let isStartPicked: boolean = false;
    let isFinishPicked: boolean = false;
    for ( const item of data ) {
      if (!isStartPicked && !isFinishPicked) {
        if ( parseInt(item.temperature) >= target - 10 ) {
          start = item.timestamp;
          isStartPicked = true;
        }
      }
      if (!isFinishPicked && isStartPicked) {
        if ( parseInt(item.temperature) < target - 10 ) {
          finish = item.timestamp;
          isFinishPicked = true;
        }
      }
  
      if (isStartPicked && isFinishPicked) break;
    }
  
    return [start, finish];
  }
  
  public static getOverallPeakTime(start: string, finish: string): string {
    if (finish == '') return 'Unavailable'
    const startDate = new Date(start);
    const finishDate = new Date(finish);
  
    let diffMs = finishDate.getTime() - startDate.getTime();
  
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    diffMs -= hours * (1000 * 60 * 60);
    const minutes = Math.floor(diffMs / (1000 * 60));
  
    return `${hours} hour ${minutes} minute`;
  }

  public static getOvenAutoJudgment(start: string, finish: string): string {
    if (finish == '') return 'NG'
    const startDate = new Date(start);
    const finishDate = new Date(finish);
  
    let diffMs = finishDate.getTime() - startDate.getTime();
  
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    diffMs -= hours * (1000 * 60 * 60);
    const minutes = Math.floor(diffMs / (1000 * 60));
    
    if (hours < 7) return 'NG'
    else if (hours == 7 && minutes <= 5) return 'NG'
    return `OK`;
  }
  
  public static getOvenState(values: [string, string, string, string, string], temperatureTarget: number, peakTime: string): [OvenStateType, BadgeType, string, FanStateType] {
    const peak = this.generateDuration({ ms: peakTime })
    const peakHour = peak.split(" ")[0]

    if (parseInt(peakHour) > 24) return ["Abnormal", "danger", "border: 1px solid #fd3d3d", "Inactive"]

    const diffs = [
      parseInt(values[3]) - parseInt(values[4]),
      parseInt(values[2]) - parseInt(values[3]),
      parseInt(values[1]) - parseInt(values[2]),
      parseInt(values[0]) - parseInt(values[1])
    ];
  
    const isIncrease = diffs.every(d => d > 0);
    const isDecrease = diffs.every(d => d < 0);
    const stable = diffs.every(d => Math.abs(d) <= 3);

    if (parseInt(values[0]) < 55) return ["Off", "secondary", "border: 1px solid #b9bbba", "Inactive"]
  
    if (isIncrease) return ["Running", "success", "border: 1px solid #78e29d", "Active"];
    if (isDecrease) return ["Cooling", "info", "border: 1px solid #78bbe2", "Inactive"];
  
    if (stable) {
      const avg = values.reduce((a, b) => a + parseInt(b), 0) / 5;
      return avg > temperatureTarget ? ["Running", "success", "border: 1px solid #78e29d", "Active"] : ["Cooling", "info", "border: 1px solid #78bbe2", "Inactive"];
    }

    const avg = values.reduce((a, b) => a + parseInt(b), 0) / 5;
    return avg > temperatureTarget ? ["Running", "success", "border: 1px solid #78e29d", "Active"] : ["Cooling", "info", "border: 1px solid #78bbe2", "Inactive"];
  }
  
  public static generateDuration({ start, finish, ms }: IParameterOptional = {}): string {
    if (ms) {
      if (ms == null || ms == '-1') return '---';
  
      let diffMs = parseInt(ms);
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

  public static async getGraphBuffer(el: HTMLElement[]): Promise<string[]> {
    const graphBuffers: string[] = (
      await Promise.all(
        el.map(async (element) => {
          const svgElement = element.querySelector('svg');
          if (!svgElement) return;

          const serializer = new XMLSerializer();
          let svgString = serializer.serializeToString(svgElement);
          
          svgString = svgString.replace(
              "<svg",
              `<svg><rect width="100%" height="100%" fill="#ffffff00"/>`
          );
        
          const canvas = document.createElement("canvas");
          canvas.width = svgElement.clientWidth || 800;
          canvas.height = svgElement.clientHeight || 600;
        
          const ctx = canvas.getContext("2d");
          if(!ctx) return;
        
          ctx.fillStyle = "#ffffff00";
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        
          const v = Canvg.fromString(ctx, svgString);
        
          await v.render();
        
          return canvas.toDataURL("image/png");
        })
      )
    ).filter(Boolean) as string[];
    return graphBuffers
  }

  public static generateDayFormat(d: Date): string {
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
  }

  public static getTimeRange(startH?: number, endH?: number): { startH: string, endH: string } {
    let s: string = '00';
    let e: string = '23';

    if (startH) {
      s = startH < 10 ? `0${startH}` : `${startH}`;
    }
    if (endH) {
      e = (endH - 1) < 10 ? `0${endH - 1}` : `${endH - 1}`;
    }

    return {
      startH: s,
      endH: e
    }
  }
}
