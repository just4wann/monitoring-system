import { MewtocolClient } from "@/lib/index.js";
import OvenTemperature from "@/model/oven_temperatures.model.js";

export default class OvenTemperatureService {
    constructor(private readonly mewtocol: MewtocolClient) {}

    static async add(ovenId: number, value: number): Promise<void> {
        
        await OvenTemperature.create({
            ovenId: ovenId,
            temperature: value
        })
    }
}