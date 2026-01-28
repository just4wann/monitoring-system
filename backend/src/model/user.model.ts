import { Model, Optional } from "sequelize";

interface UserAttributes {
    id: number;
    roles: 'admin' | 'prods' | 'qc';
    password: string;
    createdAt: Date;
}

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'createdAt'>;

export default class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    declare id: number;
    declare roles: "admin" | "prods" | "qc";
    declare password: string;
    declare createdAt: Date;
}