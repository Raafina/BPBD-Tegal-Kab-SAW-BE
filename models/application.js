"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class application extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  application.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      university: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      IPK: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      intern_category: {
        type: DataTypes.ENUM("Magang Mandiri", "Magang KRS"),
        allowNull: false,
      },
      college_major: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      CV_score: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      motivation_letter_score: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      semester: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      start_month: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_month: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      google_drive_link: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "application",
    }
  );
  return application;
};
