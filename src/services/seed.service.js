const { State, City, WebsiteCustomer } = require('../db/models');
const { Op } = require('sequelize');

const getStateIdByName = async (name) => {
  try {
    const state = await State.findOne({
      raw: true,
      where: { state_name: { [Op.like]: name } },
      attributes: ['state_id'],
    });
    return state?.state_id;
  } catch (error) {
    throw error;
  }
};

const getCityIdByName = async (name) => {
  try {
    const city = await City.findOne({
      raw: true,
      where: { city_name: { [Op.like]: name } },
      attributes: ['city_id'],
    });
    return city?.city_id;
  } catch (error) {
    throw error;
  }
};

const getUserIdByName = async (fullname) => {
  try {
    const user = await WebsiteCustomer.findOne({
      where: {
        first_name: fullname,
      },
    });

    return user ? user.customer_id : null;
  } catch (error) {
    console.error('Error in getUserIdByName:', error);
    return null;
  }
};

module.exports = {
  getStateIdByName,
  getCityIdByName,
  getUserIdByName,
};
