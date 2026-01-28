import type { IOvenConfig } from "../types";
import { ref } from "vue";

export const selectItems = ref<{ name: string, code: string }[]>([
  {
    name: 'Mangan',
    code: 'mn'
  },
  {
    name: 'Bubuk',
    code: 'bbk'
  },
    {
    name: 'Bobin',
    code: 'bbn'
  },
]);

export const selectTemperatureTarget = ref([
  {
    label: 'Mangan',
    code: 'mn',
    items: [
      { label: '430', value: 430 },
    ]
  },
  {
    label: 'Bobin',
    code: 'bbn',
    items: [
      { label: '250', value: 250 },
      { label: '160', value: 160 },
    ]
  },
  {
    label: 'Bubuk',
    code: 'bbk',
    items: [
      { label: '120', value: 120 },
      { label: '70', value: 70 },
    ]
  }
])

export const OVEN_CONFIG: IOvenConfig = {
  mangan: { count: 20, domain: [0, 500], maxTemperature: 430 },
  bobin: { count: 8, domain: [0, 300], maxTemperature: 250 },
  bubuk: { count: 14, domain: [0, 150], maxTemperature: 70 },
} as const;
