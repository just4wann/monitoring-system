import { Model, Optional } from "sequelize";

interface OvenAttributes {
    id: number;
    ovenType: 'mangan' | 'bobin' | 'bubuk';
    ovenNo: number; 
}

type OvenCreationAttribute = Optional<OvenAttributes, 'id'>;

export default class Oven extends Model<OvenAttributes, OvenCreationAttribute> implements OvenAttributes {
    declare id: number;
    declare ovenType: "mangan" | "bobin" | "bubuk";
    declare ovenNo: number;
}