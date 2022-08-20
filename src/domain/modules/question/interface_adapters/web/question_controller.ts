import { HTTPCodesEnum } from "@common/enterprise_business_rules/dto/enums/errors_enums";
import { ApiResponse } from "@common/enterprise_business_rules/dto/responses/api_response";
import service from "@questions/app_business_rules";
import { NextFunction, Response, Request } from "express";
import mapper from "./mappers/question_mapper";

export class QuestionController {
    async createOne(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;

            const result = await service.createOne(mapper.fromApiToDom(body));
            res.status(HTTPCodesEnum.CREATED).json(
                new ApiResponse(
                    HTTPCodesEnum.CREATED,
                    mapper.fromDomToApi(result)
                )
            );
        } catch (error) {
            next(error);
        }
    }
}