const { Op } = require("sequelize");
const { CarGraphicType } = require("../db/models");

const getCarGraphicTypes = async () => {
  const carGraphicTypes = await CarGraphicType.findAll({ raw: true });
  return carGraphicTypes;
};

const getCartGraphicsTypeIdByName = async (name) => {
  const graphicType = await CarGraphicType.findOne({
    raw: true,
    where: { gt_name: { [Op.like]: name } },
  });
  return graphicType?.gt_id;
};

module.exports = {
  getCarGraphicTypes,
  getCartGraphicsTypeIdByName,
};
