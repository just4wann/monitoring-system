import type { OvenResponseType, TemperatureResponseType } from '../types';

export function generateTime(): { timestamp: string[]; current: number[] } {
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
  };
}

export function generateTimestamp(at: string | Date): string[] {
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

  const full = date.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

  return [`${time}`, `${formatDate}`, `${full}`];
}

export function downloadPDF(blob: Blob, ovenType: string, ovenNo: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `report-${ovenType.toLowerCase()}${ovenNo}-${Date.now()}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getStartFinishPeak(data: TemperatureResponseType[] | [], target: number): string[] {
  let start: string = '';
  let finish: string = '';
  let isStartPicked: boolean = false;
  let isFinishPicked: boolean = false;
  for (const item of data) {
    if (!isStartPicked && !isFinishPicked) {
      if (parseInt(item.temperature) >= target - 5) {
        start = item.createdAt;
        isStartPicked = true;
      }
    }
    if (!isFinishPicked && isStartPicked) {
      if (parseInt(item.temperature) < target - 5) {
        finish = item.createdAt;
        isFinishPicked = true;
      }
    }

    if (isStartPicked && isFinishPicked) break;
  }

  return [start, finish];
}

export function getOverallPeakTime(start: string, finish: string): string {
  const startDate = new Date(start);
  const finishDate = new Date(finish);

  let diffMs = finishDate.getTime() - startDate.getTime();

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  diffMs -= hours * (1000 * 60 * 60);
  const minutes = Math.floor(diffMs / (1000 * 60));

  return `${hours} hour ${minutes} minute`;
}

// function setOvenStatus(values: TemperatureResponseType[]): string {
//   const compareDataLength = 5;
//   let countCooling: number = 0;
//   let countRunning: number = 0;
//   let isCooling: boolean = false;
//   let isRunning: boolean = false;
//   for (let i = 0; i < compareDataLength - 1; i++) {
//     if (parseInt(values[(compareDataLength - 1) - (i)].temperature) >= parseInt(values[(compareDataLength - 1) - (i + 1)].temperature)) countCooling++;
//     if (parseInt(values[(compareDataLength - 1) - (i)].temperature) <= parseInt(values[(compareDataLength - 1) - (i + 1)].temperature)) countRunning++;
//   }

//   if (parseInt(values[0].temperature) < maxTemperatureTarget.value - 10) isCooling = true;
//   else if (parseInt(values[0].temperature) > maxTemperatureTarget.value - 10) isRunning = true;

//   if (countCooling >= 4 && isCooling) return 'Cooling';
//   else if (countRunning >= 4 && isRunning) return 'Running';

//   return 'Idle';
// }

// function setStatusColor(values: TemperatureResponseType[]): BadgeType {
//   const compareDataLength = 5;
//   let countCooling: number = 0;
//   let countRunning: number = 0;
//   let isCooling: boolean = false;
//   let isRunning: boolean = false;
//   for (let i = 0; i < compareDataLength - 1; i++) {
//     if (parseInt(values[(compareDataLength - 1) - (i)].temperature) >= parseInt(values[(compareDataLength - 1) - (i + 1)].temperature)) countCooling++;
//     if (parseInt(values[(compareDataLength - 1) - (i)].temperature) <= parseInt(values[(compareDataLength - 1) - (i + 1)].temperature)) countRunning++;
//   }

//   if (parseInt(values[0].temperature) < maxTemperatureTarget.value - 10) isCooling = true;
//   else if (parseInt(values[0].temperature) > maxTemperatureTarget.value - 10) isRunning = true;

//   if (countCooling >= 4 && isCooling) return 'primary';
//   else if (countRunning >= 4 && isRunning) return 'success';

//   return 'neutral';
// }

export const temporaryData: OvenResponseType[] = [
  {
    id: 1,
    ovenType: 'mangan',
    ovenNo: 1,
    temperatures: [
      {
        temperature: '50',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '10',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '34',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '20',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '25',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '40',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '52',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '17',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '50',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '10',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '34',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '20',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '25',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '40',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '52',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '17',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '25',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '40',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '52',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '17',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
    ],
  },
  {
    id: 1,
    ovenType: 'mangan',
    ovenNo: 1,
    temperatures: [
      {
        temperature: '50',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '10',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '34',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '20',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '25',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '40',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '52',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '17',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '50',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '10',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '34',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '20',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '25',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '40',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '52',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '17',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '25',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '40',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '52',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '17',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
    ],
  },
  {
    id: 1,
    ovenType: 'mangan',
    ovenNo: 1,
    temperatures: [
      {
        temperature: '50',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '10',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '34',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '20',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '25',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '40',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '52',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '17',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '50',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '10',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '34',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '20',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '25',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '40',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '52',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '17',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '25',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '40',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '52',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '17',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
    ],
  },
  {
    id: 1,
    ovenType: 'mangan',
    ovenNo: 1,
    temperatures: [
      {
        temperature: '50',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '10',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '34',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '20',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '25',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '40',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '52',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '17',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '50',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '10',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '34',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '20',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '25',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '40',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '52',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '17',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '25',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '40',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '52',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '17',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
    ],
  },
  {
    id: 1,
    ovenType: 'mangan',
    ovenNo: 1,
    temperatures: [
      {
        temperature: '50',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '10',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '34',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '20',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '25',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '40',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '52',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '17',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '50',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '10',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '34',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '20',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '25',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '40',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '52',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '17',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '25',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '40',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '52',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '17',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
    ],
  },
  {
    id: 1,
    ovenType: 'mangan',
    ovenNo: 1,
    temperatures: [
      {
        temperature: '50',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '10',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '34',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '20',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '25',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '40',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '52',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '17',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '50',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '10',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '34',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '20',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '25',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '40',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '52',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '17',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '25',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '40',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '52',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '17',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
    ],
  },
  {
    id: 1,
    ovenType: 'mangan',
    ovenNo: 1,
    temperatures: [
      {
        temperature: '50',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '10',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '34',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '20',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '25',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '40',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '52',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '17',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '50',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '10',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '34',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '20',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '25',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '40',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '52',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '17',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '25',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '40',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '52',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '17',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
    ],
  },
  {
    id: 1,
    ovenType: 'mangan',
    ovenNo: 1,
    temperatures: [
      {
        temperature: '50',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '10',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '34',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '20',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '25',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '40',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '52',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '17',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '50',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '10',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '34',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '20',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '25',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '40',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '52',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '17',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '25',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '40',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '52',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '17',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
    ],
  },
  {
    id: 1,
    ovenType: 'mangan',
    ovenNo: 1,
    temperatures: [
      {
        temperature: '50',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '10',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '34',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '20',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '25',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '40',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '52',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '17',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '50',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '10',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '34',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '20',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '25',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '40',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '52',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '17',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '25',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '40',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '52',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '17',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
    ],
  },
  {
    id: 1,
    ovenType: 'mangan',
    ovenNo: 1,
    temperatures: [
      {
        temperature: '50',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '10',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '34',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '20',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '25',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '40',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '52',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '17',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '50',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '10',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '34',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '20',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '25',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '40',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '52',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '17',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '25',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '40',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '52',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '17',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
    ],
  },
  {
    id: 1,
    ovenType: 'mangan',
    ovenNo: 1,
    temperatures: [
      {
        temperature: '50',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '10',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '34',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '20',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '25',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '40',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '52',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '17',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '50',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '10',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '34',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '20',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '25',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '40',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '52',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '17',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '25',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '40',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '52',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
      {
        temperature: '17',
        createdAt: '',
        oven: {
          ovenType: 'mangan',
          ovenNo: 1,
        },
      },
    ],
  },
];

export const temporary: TemperatureResponseType[] = [
  {
    temperature: '17',
    createdAt: '',
    oven: {
      ovenType: 'mangan',
      ovenNo: 1,
    },
  },
  {
    temperature: '17',
    createdAt: '',
    oven: {
      ovenType: 'mangan',
      ovenNo: 1,
    },
  },
  {
    temperature: '17',
    createdAt: '',
    oven: {
      ovenType: 'mangan',
      ovenNo: 1,
    },
  },
  {
    temperature: '17',
    createdAt: '',
    oven: {
      ovenType: 'mangan',
      ovenNo: 1,
    },
  },
  {
    temperature: '17',
    createdAt: '',
    oven: {
      ovenType: 'mangan',
      ovenNo: 1,
    },
  },
];
