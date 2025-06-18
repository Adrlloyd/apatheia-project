import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './dbInstance';

interface QuoteAttributes {
  id?: number;
  quote_text: string;
  author: string;
  assigned_date: string;
}

type QuoteCreationAttributes = Optional<QuoteAttributes, 'id'>;

class Quote extends Model<QuoteAttributes, QuoteCreationAttributes> implements QuoteAttributes {
  public id!: number;
  public quote_text!: string;
  public author!: string;
  public assigned_date!: string;
}

Quote.init(
  {
    quote_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    assigned_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'quotes',
    timestamps: false,
  }
);

export default Quote;