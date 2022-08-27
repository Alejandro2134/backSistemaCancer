import { StorageError } from "@common/enterprise_business_rules/dto/errors/storage_error";
import { IQuestionFDOM, QuestionDOM } from "domain/modules/question/enterprise_business/entities/question/question_dom";
import { BaseImplementation } from "../../client/driver/base_sql_impl";
import { IFilterWrapper, IWrapper } from "../../client/interfaces/iwrapper";
import { IQuestionFDAL, QuestionDAL } from "../../models/question/question_dal";
import { Question } from '@fnd/storage/sql/models/question/Question';
import { Op } from 'sequelize';
import { Symptom } from "../../models/symptom/Symptom";
import { fromSnakeToCamel } from "@fnd/helpers/from_snake_to_camel";

export class QuestionsSQLImplementation extends BaseImplementation<QuestionDOM, IQuestionFDOM> implements IWrapper<QuestionDOM, QuestionDAL>, IFilterWrapper<IQuestionFDOM, IQuestionFDAL> {
    async create(item: QuestionDOM): Promise<QuestionDOM> {
        try {
            const itemDAL = this.fromDomToDal(item);
            const result = await Question.create(itemDAL);
            
            if(item.sintomas) {
                result.addSymptoms(item.sintomas);
            }
            
            const resDAL = result.get({ plain: true });
            const resDOM = this.fromDalToDom(resDAL);
            return resDOM;
        } catch (error) {
            throw new StorageError(error);
        }
    }

    async update(id: number, item: QuestionDOM): Promise<QuestionDOM | null> {
        try {
            const response = await Question.update(this.fromDomToDal(item), {
                where: {
                    id: id
                },
                returning: true,
            });

            const result = response[1];
            const resDAL = result[0].get({ plain: true });
            const resDOM = resDAL !== null ? this.fromDalToDom(resDAL) : null;
            return resDOM;
        } catch (error) {
            throw new StorageError(error);
        }
    }

    async delete(id: number): Promise<number> {
        try {
            const res = await Question.destroy({
                where: {
                    id: id,
                },
            });

            return res;
        } catch (error) {
            throw new StorageError(error);
        }
    }

    async getAll(filter: IQuestionFDOM): Promise<QuestionDOM[]> {
        try {
            const result = await Question.findAll({
                where: this.filterDomToDal(filter),
                include: [{
                    model: Symptom,
                    through: {
                        attributes: []
                    }
                }],
            });

            const resDAL = result.map(result => result.get({ plain: true }));
            const resDOM = resDAL.map(this.fromDalToDom);
            return resDOM;
        } catch (error) {
            throw new StorageError(error);
        }
    }

    async getOne(id: number): Promise<QuestionDOM | null> {
        try {
            const result = await Question.findByPk(id);

            if(result) {
                const resDAL = result.get({ plain: true });
                const resDOM = this.fromDalToDom(resDAL);
                return resDOM;
            } else {
                return null;
            }
        } catch (error) {
            throw new StorageError(error);
        }
    }

    async countRegisters(filter: IQuestionFDOM): Promise<number> {
        try {
            return await Question.count({
                where: this.filterDomToDal(filter)
            });
        } catch (error) {
            throw new StorageError(error);
        }
    }

    fromDomToDal(item: QuestionDOM): QuestionDAL {
        const entity = new QuestionDAL({
            id: item.id,
            pregunta: item.pregunta,
        });

        return entity;
    }

    fromDalToDom(item: QuestionDAL): QuestionDOM {
        const entity = new QuestionDOM({
            id: item.id,
            pregunta: item.pregunta,
        });

        if(item.symptoms) {
            entity.symptoms = item.symptoms.map(fromSnakeToCamel);
        }

        return entity;
    }

    filterDomToDal(item: IQuestionFDOM): IQuestionFDAL {
        const mapFilter: IQuestionFDAL = {

        }

        for(const key in item) {
            switch(key) {
                case 'id':
                    mapFilter[key] = item[key];
                    break;
                case 'pregunta':
                    mapFilter[key] = {
                        [Op.iLike]: `${item[key]}%`
                    }
                    break;
            }
        }

        return mapFilter;
    }
}