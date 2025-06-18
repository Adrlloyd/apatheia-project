import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './dbInstance';

interface JournalEntryAttributes {
  id: number;
  journal_text: string;
  user_id: string;
  quote_id: number;
  date: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type JournalEntryCreationAttributes = Optional<JournalEntryAttributes, 'id' | 'createdAt' | 'updatedAt'>;

class JournalEntry extends Model<JournalEntryAttributes, JournalEntryCreationAttributes>
  implements JournalEntryAttributes {
  public id!: number;
  public journal_text!: string;
  public user_id!: string;
  public quote_id!: number;
  public date!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

JournalEntry.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    journal_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    quote_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'journal_entries',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'date'],
      },
    ],
  }
);

export default JournalEntry;