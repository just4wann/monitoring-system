import os from "os";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer-core";
import OvenJudgementService from "./oven_judgement.service.js";
import { generateDate } from "@/utils/index.js";
import { RequestBodyId } from "@/types/index.js";

export default class ReportService {
    constructor() {}

    static async createReport(req: RequestBodyId): Promise<Uint8Array | null> {
        const reportParam = await OvenJudgementService.findOne(req.id);
        if (!reportParam) {
            console.error('error create report');
            return null;
        }
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename)
        const templatePath = path.resolve(__dirname, "../template/mangan.html");

        let htmlContent = fs.readFileSync(templatePath, "utf-8");
        if (!templatePath) console.error('no template');
        if (!htmlContent) console.error('no content');

            htmlContent = htmlContent.replace(`{{type_1}}`, reportParam.ovenType.toUpperCase() ?? '');
            htmlContent = htmlContent.replace(`{{lot_1}}`, reportParam.lot[0] ?? '');
            htmlContent = htmlContent.replace(`{{date_1}}`, generateDate(reportParam.createdAt) ?? '');
            htmlContent = htmlContent.replace(`{{qcMember_1}}`, reportParam.judged ?? '');
            htmlContent = htmlContent.replace(`{{productionMember_1}}`, req.prods ?? '');
            htmlContent = htmlContent.replace("{{tempTarget_1}}", reportParam.tempTarget[0] ? `${reportParam.tempTarget[0]}` : '');
            htmlContent = htmlContent.replace("{{tempTarget_2}}", reportParam.tempTarget[0] ? `${reportParam.tempTarget[0]}` : '');
            htmlContent = htmlContent.replace("{{tempTarget_3}}", reportParam.tempTarget[0] ? `${reportParam.tempTarget[0]}` : '');
            htmlContent = htmlContent.replace(`{{ovenNo_1}}`, reportParam.channels[0] ?? '');
            htmlContent = htmlContent.replace(`{{graph_1}}`, reportParam.buffers[0] ?? '');
            htmlContent = htmlContent.replace(`{{start_1}}`, reportParam.tempMaxStart[0] ?? '');
            htmlContent = htmlContent.replace(`{{finish_1}}`, reportParam.tempMaxEnd[0] ?? '');
            htmlContent = htmlContent.replace(`{{time_1}}`, reportParam.tempMaxTime[0] ?? '');
            htmlContent = htmlContent.replace(`{{judgement_1}}`, reportParam.judgement[0] ?? '');

            htmlContent = htmlContent.replace(`{{type_2}}`, reportParam.ovenType.toUpperCase() ?? '');
            htmlContent = htmlContent.replace(`{{lot_2}}`, reportParam.lot[1] ?? '');
            htmlContent = htmlContent.replace(`{{date_2}}`, generateDate(reportParam.createdAt) ?? '');
            htmlContent = htmlContent.replace(`{{qcMember_2}}`, reportParam.judged ?? '');
            htmlContent = htmlContent.replace(`{{productionMember_2}}`, req.prods ?? '');
            htmlContent = htmlContent.replace("{{tempTarget_4}}", reportParam.tempTarget[1] ? `${reportParam.tempTarget[1]}` : '');
            htmlContent = htmlContent.replace("{{tempTarget_5}}", reportParam.tempTarget[1] ? `${reportParam.tempTarget[1]}` : '');
            htmlContent = htmlContent.replace("{{tempTarget_6}}", reportParam.tempTarget[1] ? `${reportParam.tempTarget[1]}` : '');
            htmlContent = htmlContent.replace(`{{ovenNo_2}}`, reportParam.channels[1] ?? '');
            htmlContent = htmlContent.replace(`{{graph_2}}`, reportParam.buffers[1] ?? '');
            htmlContent = htmlContent.replace(`{{start_2}}`, reportParam.tempMaxStart[1] ?? '');
            htmlContent = htmlContent.replace(`{{finish_2}}`, reportParam.tempMaxEnd[1] ?? '');
            htmlContent = htmlContent.replace(`{{time_2}}`, reportParam.tempMaxTime[1] ?? '');
            htmlContent = htmlContent.replace(`{{judgement_2}}`, reportParam.judgement[1] ?? '');

            htmlContent = htmlContent.replace(`{{type_3}}`, reportParam.ovenType.toUpperCase() ?? '');
            htmlContent = htmlContent.replace(`{{lot_3}}`, reportParam.lot[2] ?? '');
            htmlContent = htmlContent.replace(`{{date_3}}`, generateDate(reportParam.createdAt) ?? '');
            htmlContent = htmlContent.replace(`{{qcMember_3}}`, reportParam.judged ?? '');
            htmlContent = htmlContent.replace(`{{productionMember_3}}`, req.prods ?? '');
            htmlContent = htmlContent.replace("{{tempTarget_7}}", reportParam.tempTarget[2] ? `${reportParam.tempTarget[2]}` : '');
            htmlContent = htmlContent.replace("{{tempTarget_8}}", reportParam.tempTarget[2] ? `${reportParam.tempTarget[2]}` : '');
            htmlContent = htmlContent.replace("{{tempTarget_9}}", reportParam.tempTarget[2] ? `${reportParam.tempTarget[2]}` : '');
            htmlContent = htmlContent.replace(`{{ovenNo_3}}`, reportParam.channels[2] ?? '');
            htmlContent = htmlContent.replace(`{{graph_3}}`, reportParam.buffers[2] ?? '');
            htmlContent = htmlContent.replace(`{{start_3}}`, reportParam.tempMaxStart[2] ?? '');
            htmlContent = htmlContent.replace(`{{finish_3}}`, reportParam.tempMaxEnd[2] ?? '');
            htmlContent = htmlContent.replace(`{{time_3}}`, reportParam.tempMaxTime[2] ?? '');
            htmlContent = htmlContent.replace(`{{judgement_3}}`, reportParam.judgement[2] ?? '');

            htmlContent = htmlContent.replace(`{{type_4}}`, reportParam.ovenType.toUpperCase() ?? '');
            htmlContent = htmlContent.replace(`{{lot_4}}`, reportParam.lot[3] ?? '');
            htmlContent = htmlContent.replace(`{{date_4}}`, generateDate(reportParam.createdAt) ?? '');
            htmlContent = htmlContent.replace(`{{qcMember_4}}`, reportParam.judged ?? '');
            htmlContent = htmlContent.replace(`{{productionMember_4}}`, req.prods ?? '');
            htmlContent = htmlContent.replace("{{tempTarget_10}}", reportParam.tempTarget[3] ? `${reportParam.tempTarget[3]}` : '');
            htmlContent = htmlContent.replace("{{tempTarget_11}}", reportParam.tempTarget[3] ? `${reportParam.tempTarget[3]}` : '');
            htmlContent = htmlContent.replace("{{tempTarget_12}}", reportParam.tempTarget[3] ? `${reportParam.tempTarget[3]}` : '');
            htmlContent = htmlContent.replace(`{{ovenNo_4}}`, reportParam.channels[3] ?? '');
            htmlContent = htmlContent.replace(`{{graph_4}}`, reportParam.buffers[3] ?? '');
            htmlContent = htmlContent.replace(`{{start_4}}`, reportParam.tempMaxStart[3] ?? '');
            htmlContent = htmlContent.replace(`{{finish_4}}`, reportParam.tempMaxEnd[3] ?? '');
            htmlContent = htmlContent.replace(`{{time_4}}`, reportParam.tempMaxTime[3] ?? '');
            htmlContent = htmlContent.replace(`{{judgement_4}}`, reportParam.judgement[3] ?? '');

            htmlContent = htmlContent.replace(`{{type_5}}`, reportParam.ovenType.toUpperCase() ?? '');
            htmlContent = htmlContent.replace(`{{lot_5}}`, reportParam.lot[4] ?? '');
            htmlContent = htmlContent.replace(`{{date_5}}`, generateDate(reportParam.createdAt) ?? '');
            htmlContent = htmlContent.replace(`{{qcMember_5}}`, reportParam.judged ?? '');
            htmlContent = htmlContent.replace(`{{productionMember_5}}`, req.prods ?? '');
            htmlContent = htmlContent.replace("{{tempTarget_13}}", reportParam.tempTarget[4] ? `${reportParam.tempTarget[4]}` : '');
            htmlContent = htmlContent.replace("{{tempTarget_14}}", reportParam.tempTarget[4] ? `${reportParam.tempTarget[4]}` : '');
            htmlContent = htmlContent.replace("{{tempTarget_15}}", reportParam.tempTarget[4] ? `${reportParam.tempTarget[4]}` : '');
            htmlContent = htmlContent.replace(`{{ovenNo_5}}`, reportParam.channels[4] ?? '');
            htmlContent = htmlContent.replace(`{{graph_5}}`, reportParam.buffers[4] ?? '');
            htmlContent = htmlContent.replace(`{{start_5}}`, reportParam.tempMaxStart[4] ?? '');
            htmlContent = htmlContent.replace(`{{finish_5}}`, reportParam.tempMaxEnd[4] ?? '');
            htmlContent = htmlContent.replace(`{{time_5}}`, reportParam.tempMaxTime[4] ?? '');
            htmlContent = htmlContent.replace(`{{judgement_5}}`, reportParam.judgement[4] ?? '');

        const tempFile = path.join(os.tmpdir(), `report-${Date.now()}.html`);
        fs.writeFileSync(tempFile, htmlContent);
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        })
        const page = await browser.newPage();

        await page.goto(`file://${tempFile}`, {
            waitUntil: "networkidle0"
        });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            landscape: true,
            margin: {
                top: '0mm',
                bottom: '0mm',
                left: '0mm',
                right: '0mm'
            }
        });

        await browser.close();

        fs.unlinkSync(tempFile);

        return pdfBuffer;
    }
}