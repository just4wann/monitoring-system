import { Model, Optional } from 'sequelize';

interface JudgementDownloadAttributes {
    id: number;
    judgementId: number;
    downloadBy: string;
    createdAt: Date;
}

type JudgementDownloadCreationAttribute = Optional<JudgementDownloadAttributes, 'id' | 'createdAt'>;

export default class JudgementDownload extends Model<JudgementDownloadAttributes, JudgementDownloadCreationAttribute> implements JudgementDownloadAttributes {
    declare id: number;
    declare judgementId: number;
    declare downloadBy: string;
    declare createdAt: Date;
}