import { Op } from "sequelize";

const opTypes = Op;

export function checkConditionalOperation(condition?: string): string[] {
        let op: string = '>=';
        let tempLimit: string = '0';
        
        if (!condition) {
            return [op, tempLimit];
        }

        const [operator, temperatureLimit] = condition.split(" ");
        op = operator;
        tempLimit = temperatureLimit;

        return [op, tempLimit];
}