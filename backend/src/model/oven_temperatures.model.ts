import { Model, Optional } from 'sequelize';

interface OvenTemperatureAttributes {
    id: number;
    ovenId: number;
    temperature: number;
    createdAt: Date;
}

type OvenTemperatureCreationAttribute = Optional<OvenTemperatureAttributes, 'id' | 'createdAt'>;

export default class OvenTemperature extends Model<OvenTemperatureAttributes, OvenTemperatureCreationAttribute> implements OvenTemperatureAttributes {
    declare id: number;
    declare ovenId: number;
    declare temperature: number;
    declare createdAt: Date;
}