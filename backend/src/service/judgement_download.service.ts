import ResponseError from "@/error/index.js";
import JudgementDownload from "@/model/judgement_download.model.js";
import OvenJudgement from "@/model/oven_jugdements.model.js";
import { RequestBodyCreateJudgementDownload, ResponseBody } from "@/types/index.js";

export default class JudgementDownloadService {
    constructor() {}

    public static async add(reqBody: RequestBodyCreateJudgementDownload): Promise<ResponseBody<boolean>> {
        const ovenJudge = await OvenJudgement.findByPk(reqBody.judgementId)
        if (!ovenJudge) throw new ResponseError(404, 'oven Judgement not found')
        
        await JudgementDownload.create({
            judgementId: reqBody.judgementId,
            downloadBy: reqBody.downloadBy
        })

        return {
            statusCode: 200,
            message: 'OK',
            data: true
        }
    }
}