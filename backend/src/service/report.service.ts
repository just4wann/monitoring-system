import os from "os";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer-core";
import { RequestBody } from "@/types/index.js";

export default class ReportService {
    constructor() {}

    static async createReport(reportParam: RequestBody): Promise<Uint8Array> {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename)
        const templatePath = path.resolve(__dirname, "../template/mangan.html");

        let htmlContent = fs.readFileSync(templatePath, "utf-8");
        if (!templatePath) console.error('no template');
        if (!htmlContent) console.error('no content');
        
        htmlContent = htmlContent.replace("{{ graph }}", reportParam.buffer);
        htmlContent = htmlContent.replace("{{ ovenType }}", reportParam.ovenType);
        htmlContent = htmlContent.replace("{{ ovenNo }}", reportParam.ovenNo);
        htmlContent = htmlContent.replace("{{ temperatureTarget }}", reportParam.temperatureTarget);
        htmlContent = htmlContent.replace("{{ temperatureTarget_1 }}", reportParam.temperatureTarget);
        htmlContent = htmlContent.replace("{{ temperatureTarget_2 }}", reportParam.temperatureTarget);
        htmlContent = htmlContent.replace("{{ temperatureTarget_3 }}", reportParam.temperatureTarget);
        htmlContent = htmlContent.replace("{{ lot }}", reportParam.lot);
        htmlContent = htmlContent.replace("{{ temperatureMaxStart }}", reportParam.temperatureMaxStart);
        htmlContent = htmlContent.replace("{{ temperatureMaxEnd }}", reportParam.temperatureMaxEnd);
        htmlContent = htmlContent.replace("{{ temperatureMaxTime }}", reportParam.temperatureMaxTime);
        htmlContent = htmlContent.replace("{{ judgement }}", reportParam.judgement);
        htmlContent = htmlContent.replace("{{ checkDate }}", reportParam.checkDate);
        htmlContent = htmlContent.replace("{{ qcMember }}", reportParam.qcMember);
        htmlContent = htmlContent.replace("{{ productionMember }}", reportParam.productionMember);

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
            printBackground: true
        });

        await browser.close();

        fs.unlinkSync(tempFile);

        return pdfBuffer;
    }
}