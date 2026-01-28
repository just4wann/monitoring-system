import JudgementDownload from "@/model/judgement_download.model.js";
import OvenJudgement from "@/model/oven_jugdements.model.js";
import { RequestBodyJudgement, ResponseBody } from "@/types/index.js";
import { websocketGateway } from "@/index.js";

export default class OvenJudgementService {
    constructor() {}

    public static async add(reqBody: RequestBodyJudgement): Promise<ResponseBody<boolean>> {
        await OvenJudgement.create({
            lot: reqBody.lot,
            ovenType: reqBody.ovenType,
            channels: reqBody.channels,
            periode: reqBody.periode,
            judgement: reqBody.judgement,
            judged: reqBody.judged,
            buffers: reqBody.buffers,
            tempTarget: reqBody.tempTarget,
            tempMaxStart: reqBody.tempMaxStart,
            tempMaxEnd: reqBody.tempMaxEnd,
            tempMaxTime: reqBody.tempMaxTime,
        })
        websocketGateway.emitPayload<string>('judgement', `${reqBody.judged} - QC has been added Judgement Result! Please Check Judgement lists.`)
        return {
            statusCode: 200,
            message: 'OK',
            data: true
        }
    }

    public static async getAll(): Promise<ResponseBody<OvenJudgement[]>> {
        const result = await OvenJudgement.findAll({
            attributes: ['id', 'lot', 'ovenType', 'channels', 'periode', 'judgement', 'judged', 'createdAt'],
            include: {
                model: JudgementDownload,
                as: 'downloads',
                attributes: ['id', 'downloadBy', 'createdAt']
            },
            order: ['id']
        });
        return {
            statusCode: 200,
            message: 'OK',
            data: result
        }
    }

    public static async findOne(id: number): Promise<OvenJudgement | null> {
        const result = await OvenJudgement.findByPk(id);

        if (!result) {
            console.error('oven judgement not found');
            return null;
        }

        return result;
    }

    public static async delete(id: number): Promise<ResponseBody<boolean>> {
        const result = await OvenJudgement.findByPk(id);

        if (!result) {
            console.error('oven judgement not found');
            return {
                statusCode: 404,
                message: 'Not Found',
                data: false
            };
        }
        await OvenJudgement.destroy({
            where: {
                id: result.id
            }
        })

        return {
            statusCode: 200,
            message: 'OK',
            data: true
        };
    }
}