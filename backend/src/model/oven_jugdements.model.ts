import { Model, Optional } from 'sequelize';

interface OvenJudgementAttribute {
    id: number;
    lot: string[];
    ovenType: string;
    channels: string[];
    periode: string;
    judgement: string[];
    judged: string;
    buffers: string[];
    tempTarget: number[];
    tempMaxStart: string[];
    tempMaxEnd: string[];
    tempMaxTime: string[];
    createdAt: Date;
}

type OvenJudgementCreationAttribute = Optional<OvenJudgementAttribute, 'id' | 'createdAt'>;

export default class OvenJudgement extends Model<OvenJudgementAttribute, OvenJudgementCreationAttribute> implements OvenJudgementAttribute {
    declare id: number;
    declare ovenType: string;
    declare lot: string[];
    declare channels: string[];
    declare periode: string;
    declare judgement: string[];
    declare judged: string;
    declare buffers: string[];
    declare tempTarget: number[];
    declare tempMaxStart: string[];
    declare tempMaxEnd: string[];
    declare tempMaxTime: string[];
    declare createdAt: Date;
}