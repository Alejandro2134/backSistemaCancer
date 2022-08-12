import { DataTypes, Model } from "sequelize/types";
import { IQuestionDAL } from "./question_dal";
import { sequelizeConnection } from '../../client/client';
import { Symptom } from "../symptom/Symptom";

export class Question extends Model<IQuestionDAL> implements IQuestionDAL {
    id!: number;
    pregunta!: string;
}

Question.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        pregunta: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeConnection,
        underscored: true,
        modelName: 'question',
        freezeTableName: true,
    }
)
Question.hasMany(Symptom, {
    foreignKey: 'pregunta_id'
});
Symptom.belongsTo(Question, {
    foreignKey: 'pregunta_id'
});