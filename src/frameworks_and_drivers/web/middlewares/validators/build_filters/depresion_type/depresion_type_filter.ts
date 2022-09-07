import { snakeToCamel } from '@fnd/helpers/from_snake_to_camel';
import { Request, Response, NextFunction } from 'express';

export default function filter(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const query: any = req.query;
    const mapFilter: any = {};
    for (const key in query) {
        if (key !== 'limit' && key !== 'offset' && query[key] !== undefined) {
            switch (key) {
                case 'tipo_depresion':
                    mapFilter[snakeToCamel(key)] = query[key];
                    break;
            }
        }
    }

    req.query.filter = mapFilter;
    next();
}
