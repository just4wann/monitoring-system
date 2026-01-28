import { io, Socket } from "socket.io-client";
import { ref } from "vue"
import type { ToastServiceMethods } from "primevue";
import { hostnameWebsocket } from "../constant/config";
import { store } from "../store";

const socket: Socket = io(`http://${hostnameWebsocket}`);

export const useWebsocketNotification = (toast: ToastServiceMethods, role: string | null) => {
    if (role === 'qc' || !role) return;

    const judgementNotifications = ref<string[]>([]);
    const plcManganErrorNotifications = ref<any[]>([]);
    const plcBobinErrorNotifications = ref<any[]>([]);
    const plcBubukErrorNotifications = ref<any[]>([]);

    const addJudgementNotifications = (value: string) => judgementNotifications.value.push(value);
    const addPLCManganErrorNotifications = (value: any) => plcManganErrorNotifications.value.push(value);
    const addPLCBobinErrorNotifications = (value: any) => plcBobinErrorNotifications.value.push(value);
    const addPLCBubukErrorNotifications = (value: any) => plcBubukErrorNotifications.value.push(value);

        socket.on('judgement', (data: string) => {
            toast.add({
                summary: 'Notification',
                detail: data,
                severity: 'success',
                life: 10000
            })
            store.notifications.push(data);
            addJudgementNotifications(data);
        });
        socket.on('plc_mangan/error', (data: any) => {
            if (typeof data == 'object') {
                toast.add({
                    summary: 'Notification',
                    detail: `PLC Mangan Error : ${data.code}`,
                    severity: 'error',
                    life: 10000
                })
            }
            else if (typeof data == 'string') {
                toast.add({
                    summary: 'Notification',
                    detail: `PLC Mangan Error : ${data}`,
                    severity: 'error',
                    life: 10000
                })
            }
            addPLCManganErrorNotifications(data)
        });
        socket.on('plc_bobin/error', (data: any) => {
            if (typeof data == 'object') {
                toast.add({
                    summary: 'Notification',
                    detail: `PLC Bobin Error : ${data.code}`,
                    severity: 'error',
                    life: 10000
                })
            }
            else if (typeof data == 'string') {
                toast.add({
                    summary: 'Notification',
                    detail: `PLC Bobin Error : ${data}`,
                    severity: 'error',
                    life: 10000
                })
            }
            addPLCBobinErrorNotifications(data)
        });
        socket.on('plc_bubuk/error', (data: any) => {
            if (typeof data == 'object') {
                toast.add({
                    summary: 'Notification',
                    detail: `PLC Bubuk Error : ${data.code}`,
                    severity: 'error',
                    life: 10000
                })
            }
            else if (typeof data == 'string') {
                toast.add({
                    summary: 'Notification',
                    detail: `PLC Bubuk Error : ${data}`,
                    severity: 'error',
                    life: 10000
                })
            }
            addPLCBubukErrorNotifications(data)
        })
}