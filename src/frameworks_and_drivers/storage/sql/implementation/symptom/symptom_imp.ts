import { StorageError } from "@common/enterprise_business_rules/dto/errors/storage_error";
import { ISymptomFDOM, SymptomDOM } from "@symptoms/enterprise_business/entities/symptom/symptom_dom";
import { Op } from "sequelize";
import { BaseImplementation } from "../../client/driver/base_sql_impl";
import { IFilterWrapper, IWrapper } from "../../client/interfaces/iwrapper";
import { Symptom } from "../../models/symptom/Symptom";
import { ISymptomFDAL, SymptomDAL } from "../../models/symptom/symptom_dal";

export class SymptomsSQLImplementation extends BaseImplementation<SymptomDOM, ISymptomFDOM> implements IWrapper<SymptomDOM, SymptomDAL>, IFilterWrapper<ISymptomFDOM, ISymptomFDAL> {
    async create(item: SymptomDOM): Promise<SymptomDOM> {
        try {
            const itemDAL = this.fromDomToDal(item);
            const result = await Symptom.create(itemDAL);
            
            const resDAL = result.get({ plain: true });
            const resDOM = this.fromDalToDom(resDAL);
            return resDOM;
        } catch (error) {
            throw new StorageError(error);
        }
    }

    async update(id: number, item: SymptomDOM): Promise<SymptomDOM | null> {
        try {
            const response = await Symptom.update(this.fromDomToDal(item), {
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
            const res = await Symptom.destroy({
                where: {
                    id: id,
                },
            });

            return res;
        } catch (error) {
            throw new StorageError(error);
        }
    }

    async getAll(filter: ISymptomFDOM): Promise<SymptomDOM[]> {
        try {
            const result = await Symptom.findAll({
                where: this.filterDomToDal(filter),
            });

            const resDAL = result.map(result => result.get({ plain: true }));
            const resDOM = resDAL.map(this.fromDalToDom);
            return resDOM;
        } catch (error) {
            throw new StorageError(error);
        }
    }

    async getOne(id: number): Promise<SymptomDOM | null> {
        try {
            const result = await Symptom.findByPk(id);

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

    async countRegisters(filter: ISymptomFDOM): Promise<number> {
        try {
            return await Symptom.count({
                where: this.filterDomToDal(filter)
            });
        } catch (error) {
            throw new StorageError(error);
        }
    }

    fromDomToDal(item: SymptomDOM): SymptomDAL {
        const entity = new SymptomDAL({
            id: item.id,
            sintoma: item.sintoma
        });

        return entity;
    }

    fromDalToDom(item: SymptomDAL): SymptomDOM {
        const entity = new SymptomDOM({
            id: item.id,
            sintoma: item.sintoma
        });

        return entity;
    }

    filterDomToDal(item: ISymptomFDOM): ISymptomFDAL {
        const mapFilter: ISymptomFDAL = {

        }

        for(const key in item) {
            switch(key) {
                case 'id':
                    mapFilter[key] =  item[key];
                    break;
                case 'sintoma':
                    mapFilter[key] = {
                        [Op.iLike]: `${item[key]}%`
                    }
                    break;
            }
        }

        return mapFilter;
    }
}