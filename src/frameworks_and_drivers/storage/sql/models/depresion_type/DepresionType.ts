import { DataTypes, Model } from 'sequelize';
import { sequelizeConnection } from '../../client/client';
import { DepresionTypeDAL } from './depresion_type_dal';

export class DepresionType
    extends Model<DepresionTypeDAL>
    implements DepresionTypeDAL
{
    id!: number;
    tipo_depresion!: string;
}

DepresionType.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        tipo_depresion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeConnection,
        underscored: true,
        modelName: 'depresion_type',
        freezeTableName: true,
    }
);
