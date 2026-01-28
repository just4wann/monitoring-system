import { Model, Optional } from 'sequelize';

interface OvenTimeAttribute {
    id: number;
    ovenId: number;
    startRunning: string | null;
    startPeak: string | null;
    isAlreadyPeak: boolean;
    isStartingPeak: boolean;
    peakDuration: number | null;
    runningDuration: number | null;
    severityStatus: string;
    labelStatus: string;
    createdAt: Date;
}

type OvenTimeCreationAttribute = Optional<OvenTimeAttribute, 'id' | 'createdAt'>;

export default class OvenTime extends Model<OvenTimeAttribute, OvenTimeCreationAttribute> implements OvenTimeAttribute {
    declare id: number;
    declare ovenId: number;
    declare startRunning: string | null;
    declare startPeak: string | null;
    declare isAlreadyPeak: boolean;
    declare isStartingPeak: boolean;
    declare peakDuration: number | null;
    declare runningDuration: number | null;
    declare severityStatus: string;
    declare labelStatus: string;
    declare createdAt: Date;
}