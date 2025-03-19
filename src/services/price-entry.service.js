const {
  Brand,
  CarModel,
  Variant,
  Country,
  State,
  City,
  PriceEntry,
  Feature,
  FeatureValue,
  Rto,
  AllTax,
  TaxValue,
  Sequelize,
} = require('../db/models');
const {
  buildQueryOptions,
  formatQueryResult,
} = require('../utils/queryHelper');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { Op } = require('sequelize');
const { priceColumns } = require('../validations/imports/columns/price-cols');

const getModelsByBrand = async (uuid) => {
  try {
    return CarModel.findAll({
      include: [
        {
          model: Brand,
          as: 'brand',
          where: { uuid: uuid },
        },
      ],
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error fetching models for the brand'
    );
  }
};

const getVariantsByModel = async (uuid) => {
  try {
    return Variant.findAll({
      include: [
        {
          model: CarModel,
          as: 'model',
          where: { uuid: uuid },
        },
      ],
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error fetching models for the brand'
    );
  }
};

const getStatesByCountry = async (uuid) => {
  try {
    return State.findAll({
      include: [
        {
          model: Country,
          as: 'country',
          where: { uuid: uuid },
        },
      ],
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error fetching states for the country'
    );
  }
};

const getCitiesByState = async (uuid) => {
  try {
    return City.findAll({
      include: [
        {
          model: State,
          as: 'state',
          where: { uuid: uuid },
        },
      ],
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error fetching cities for the state'
    );
  }
};

const calculatePrice = async ({
  state_id,
  ex_showroom_price,
  model_id,
  variant_id,
  city_ids,
}) => {
  try {
    let cityIds = city_ids;
    let rto_value_i = 0;
    let rto_value_c = rto_value_i * 2;
    let carExShorRoomPrice = ex_showroom_price;
    let checkRTOready = true;

    const model = await CarModel.findOne({ where: { model_id } });
    const state = await State.findOne({ where: { state_id } });

    const RTOrateInd = await Rto.findAll({
      where: { state_id, rto_type: 'I' },
    });

    for (const rtocheck of RTOrateInd) {
      if (rtocheck.cc === '1') {
        checkRTOready = false;

        const getCC = await FeatureValue.findOne({
          where: { variant_id },
          include: [
            {
              model: Feature,
              where: { features_name: 'Displacement' },
            },
          ],
          attributes: ['feature_value'],
        });

        if (getCC) {
          checkRTOready = true;
          carExShorRoomPrice = getCC.feature_value;
        }
      }

      if (rtocheck.fuel_type) {
        checkRTOready = false;

        if (model.model_type === 1 && rtocheck.fuel_type === 'EV') {
          checkRTOready = true;
        } else {
          const getFuelType = await FeatureValue.findOne({
            where: { variant_id },
            include: [
              {
                model: Feature,
                where: { features_name: 'Type of Fuel' },
              },
            ],
            attributes: ['feature_value'],
          });

          if (getFuelType && getFuelType.feature_value === rtocheck.fuel_type) {
            checkRTOready = true;
          }
        }
      }

      if (checkRTOready) {
        const {
          pre_condition,
          pre_amount,
          post_condition,
          post_amount,
          percentage,
        } = rtocheck;

        if (!pre_condition && !pre_amount && !post_condition && !post_amount) {
          rto_value_i = ex_showroom_price * (percentage / 100);
        } else if (!post_condition && !post_amount) {
          if (
            (pre_condition === '<' && carExShorRoomPrice < pre_amount) ||
            (pre_condition === '>' && carExShorRoomPrice > pre_amount) ||
            (pre_condition === '<=' && carExShorRoomPrice <= pre_amount) ||
            (pre_condition === '>=' && carExShorRoomPrice >= pre_amount)
          ) {
            rto_value_i = ex_showroom_price * (percentage / 100);
          }
        } else {
          if (
            (pre_condition === '>' &&
              post_condition === '<=' &&
              carExShorRoomPrice > pre_amount &&
              carExShorRoomPrice <= post_amount) ||
            (pre_condition === '>=' &&
              post_condition === '<=' &&
              carExShorRoomPrice >= pre_amount &&
              carExShorRoomPrice <= post_amount)
          ) {
            rto_value_i = ex_showroom_price * (percentage / 100);
          }
        }
      }

      if (model.cbu_status === '1' && state.state_name === 'Gujarat') {
        rto_value_i *= 2;
      }
    }

    const RTOrateCor = await Rto.findAll({
      where: { state_id, rto_type: 'C' },
    });

    if (RTOrateCor.length === 0) {
      rto_value_c = rto_value_i * 2;
    }
    checkRTOready = false;
    carExShorRoomPrice = null;

    if (RTOrateCor.length > 0) {
      for (const rtocheck of RTOrateCor) {
        if (rtocheck.cc === 1) {
          checkRTOready = false;

          const getCC = await FeatureValue.findOne({
            where: { variant_id },
            include: [
              {
                model: Feature,
                as: 'feature',
                where: { features_name: 'Displacement' },
              },
            ],
            attributes: ['feature_value'],
          });

          if (getCC) {
            checkRTOready = true;
            carExShorRoomPrice = getCC.feature_value;
          }
        }

        if (rtocheck.fuel_type) {
          checkRTOready = false;

          const modelIdEvCheck = await CarModel.findOne({
            where: { model_id },
            attributes: ['model_type'],
          });

          if (
            modelIdEvCheck.model_type === '1' &&
            rtocheck.fuel_type === 'EV'
          ) {
            checkRTOready = true;
          } else {
            const getFuelType = await FeatureValue.findOne({
              where: { variant_id },
              include: [
                {
                  model: Feature,
                  as: 'feature',
                  where: { features_name: 'Type of Fuel' },
                },
              ],
              attributes: ['feature_value'],
            });

            if (
              getFuelType &&
              getFuelType.feature_value === rtocheck.fuel_type
            ) {
              checkRTOready = true;
            }
          }
        }

        if (checkRTOready) {
          const {
            pre_condition,
            pre_amount,
            post_condition,
            post_amount,
            percentage,
          } = rtocheck;

          if (
            !pre_condition &&
            !pre_amount &&
            !post_condition &&
            !post_amount
          ) {
            rto_value_c = ex_showroom_price * (percentage / 100);
          } else if (!post_condition && !post_amount) {
            if (
              (pre_condition === '<' && carExShorRoomPrice < pre_amount) ||
              (pre_condition === '>' && carExShorRoomPrice > pre_amount) ||
              (pre_condition === '<=' && carExShorRoomPrice <= pre_amount) ||
              (pre_condition === '>=' && carExShorRoomPrice >= pre_amount)
            ) {
              rto_value_c = ex_showroom_price * (percentage / 100);
            }
          } else {
            if (
              (pre_condition === '>' &&
                post_condition === '<=' &&
                carExShorRoomPrice > pre_amount &&
                carExShorRoomPrice <= post_amount) ||
              (pre_condition === '>=' &&
                post_condition === '<=' &&
                carExShorRoomPrice >= pre_amount &&
                carExShorRoomPrice <= post_amount)
            ) {
              rto_value_c = ex_showroom_price * (percentage / 100);
            }
          }
        }

        const cpuType = await CarModel.findOne({
          where: { model_id },
          attributes: ['cbu_status'],
        });

        if (cpuType.cbu_status === '1' && state.state_name === 'Gujarat') {
          rto_value_c *= 2;
        }
      }
    }

    const tcsRecords = await AllTax.findAll({
      where: {
        tax_name: 'TCS',
        status: 1,
      },
    });

    let TCScost = null;

    for (let result of tcsRecords) {
      if (result.condition_status === '0') {
        const tcsPer = result.percent;
        TCScost = (ex_showroom_price * tcsPer) / 100;
      } else {
        const tcsConditions = await TaxValue.findAll({
          include: [
            {
              model: AllTax,
              as: 'alltax',
              where: { tax_name: 'TCS' },
            },
          ],
        });

        for (let condition of tcsConditions) {
          const {
            condition: conditionType,
            amount: conditionValue,
            percent: tcsPer,
          } = condition;

          let conditionMatch = false;

          if (conditionType === '<' && ex_showroom_price < conditionValue) {
            conditionMatch = true;
          } else if (
            conditionType === '>' &&
            ex_showroom_price > conditionValue
          ) {
            conditionMatch = true;
          } else if (
            conditionType === '<=' &&
            ex_showroom_price <= conditionValue
          ) {
            conditionMatch = true;
          } else if (
            conditionType === '>=' &&
            ex_showroom_price >= conditionValue
          ) {
            conditionMatch = true;
          }

          if (conditionMatch) {
            TCScost = (ex_showroom_price * tcsPer) / 100;
          }
        }
      }
    }

    if (Array.isArray(cityIds)) {
      allTaxName = await AllTax.findAll({
        where: {
          [Sequelize.Op.or]: [
            { city_id: null },
            { city_id: { [Sequelize.Op.in]: cityIds } },
          ],
          tax_name: { [Sequelize.Op.ne]: 'TCS' },
          status: 1,
        },
      });
    } else {
      allTaxName = await AllTax.findAll({
        where: {
          [Sequelize.Op.or]: [{ city_id: null }, { city_id: cityIds }],
          tax_name: { [Sequelize.Op.ne]: 'TCS' },
          status: 1,
        },
      });
    }

    return {
      rto_value_i,
      rto_value_c,
      TCScost,
      tcsRecords,
      allTaxName,
    };
  } catch (error) {
    console.error('Error in calculatePrice service:', error);
    throw new Error('Error in calculating price');
  }
};

const calculateTax = async (taxId, exShowroomPrice) => {
  try {
    const allTax = await AllTax.findOne({
      where: { tax_id: taxId },
    });

    if (!allTax) {
      throw new Error(`No tax found with tax_id: ${taxId}`);
    }

    let taxAmount = 0;

    if (allTax.condition_status === false) {
      if (allTax.percent) {
        taxAmount = (exShowroomPrice * allTax.percent) / 100;
      } else if (allTax.value) {
        taxAmount = (exShowroomPrice + allTax.value) / 100;
      }
    }

    if (allTax.condition_status === true) {
      const taxConditions = await TaxValue.findAll({
        where: { tax_id: allTax.tax_id },
      });
      for (let condition of taxConditions) {
        const {
          condition: conditionType,
          amount: conditionValue,
          percent: tcsPer,
          tax_id: tcsTaxId,
        } = condition;

        let conditionMatch = false;

        if (conditionType === '<' && exShowroomPrice < conditionValue) {
          conditionMatch = true;
        } else if (conditionType === '>' && exShowroomPrice > conditionValue) {
          conditionMatch = true;
        } else if (
          conditionType === '<=' &&
          exShowroomPrice <= conditionValue
        ) {
          conditionMatch = true;
        } else if (
          conditionType === '>=' &&
          exShowroomPrice >= conditionValue
        ) {
          conditionMatch = true;
        }

        if (conditionMatch) {
          taxAmount = (exShowroomPrice * tcsPer) / 100;
        }
      }
    }

    return {
      tax_id: allTax.tax_id,
      tax_name: allTax.tax_name,
      tax_amount: taxAmount,
    };
  } catch (error) {
    console.error('Error in calculateTax:', error.message);
    throw error;
  }
};

const queryPriceEntries = async (query) => {
  try {
    const queryOptions = buildQueryOptions(query);
    queryOptions.include = [
      {
        model: Brand,
        as: 'brand',
        attributes: ['brand_name'],
      },
      {
        model: CarModel,
        as: 'carModel',
        attributes: ['model_name'],
      },
      {
        model: Variant,
        as: 'variant',
        attributes: ['variant_name'],
      },
      {
        model: Country,
        as: 'country',
        attributes: ['country_name'],
      },
      {
        model: State,
        as: 'state',
        attributes: ['state_name'],
      },
      {
        model: City,
        as: 'city',
        attributes: ['city_name'],
      },
    ];
    const priceEntries = await PriceEntry.findAndCountAll(queryOptions);
    return formatQueryResult(priceEntries, query);
  } catch (error) {
    console.error('Error in querypriceEntries:', error);
    throw error;
  }
};

const bulkCreatePrice = async (user, rows) => {
  try {
    for (let i = 0; i < rows.length; i++) {
      const priceEntry = rows[i];
      try {
        const [brand, model, variant, country, state] = await Promise.all([
          Brand.findOne({
            where: {
              brand_name: {
                [Op.like]: `%${priceEntry[priceColumns.BRAND_NAME]}%`,
              },
            },
          }),
          CarModel.findOne({
            where: {
              model_name: {
                [Op.like]: `%${priceEntry[priceColumns.MODEL_NAME]}%`,
              },
            },
          }),
          Variant.findOne({
            where: {
              variant_name: {
                [Op.like]: `%${priceEntry[priceColumns.VARIANT_NAME]}%`,
              },
            },
          }),
          Country.findOne({
            where: { country_name: { [Op.like]: `%India%` } },
          }),
          State.findOne({
            where: {
              state_name: { [Op.like]: `%${priceEntry[priceColumns.STATE]}%` },
            },
          }),
        ]);

        if (!brand || !model || !variant || !country || !state) {
          throw new ApiError(httpStatus.NOT_FOUND, 'Required data not found');
        }

        let state_id, city_id;

        if (state.is_ut === '1') {
          state_id = state.state_id;
          city_id = null;
        } else {
          state_id = state.state_id;
          const city = await City.findOne({
            where: {
              city_name: {
                [Op.like]: `%${priceEntry[priceColumns.CITY]}%`,
              },
            },
          });

          if (!city) {
            throw new ApiError(httpStatus.NOT_FOUND, 'City not found');
          }

          city_id = city.city_id;
        }

        let brand_id = brand.brand_id;
        let model_id = model.model_id;
        let variant_id = variant.variant_id;
        let ex_showroom_price = priceEntry[priceColumns.PRICE];
        let carExShorRoomPrice = ex_showroom_price;
        let rto_value_i = 0;
        let rto_value_c = 0;
        if (ex_showroom_price) {
          try {
            const RTOrateInd = await Rto.findAll({
              where: { state_id, rto_type: 'I' },
            });

            for (const rtocheck of RTOrateInd) {
              let checkRTOready = true;

              if (rtocheck.cc === '1') {
                checkRTOready = false;

                const getCC = await FeatureValue.findOne({
                  where: { variant_id },
                  include: [
                    {
                      model: Feature,
                      as: 'feature',
                      where: { features_name: 'Displacement' },
                    },
                  ],
                  attributes: ['feature_value'],
                });

                if (getCC) {
                  carExShorRoomPrice = getCC.feature_value;
                  checkRTOready = true;
                }
              }

              if (rtocheck.fuel_type) {
                checkRTOready = false;

                if (model.model_type === 1 && rtocheck.fuel_type === 'EV') {
                  checkRTOready = true;
                } else {
                  const getFuelType = await FeatureValue.findOne({
                    where: { variant_id },
                    include: [
                      {
                        model: Feature,
                        as: 'feature',
                        where: { features_name: 'Type of Fuel' },
                      },
                    ],
                    attributes: ['feature_value'],
                  });

                  if (
                    getFuelType &&
                    getFuelType.feature_value === rtocheck.fuel_type
                  ) {
                    checkRTOready = true;
                  }
                }
              }

              if (checkRTOready) {
                const {
                  pre_condition,
                  pre_amount,
                  post_condition,
                  post_amount,
                  percentage,
                } = rtocheck;

                if (
                  !pre_condition &&
                  !pre_amount &&
                  !post_condition &&
                  !post_amount
                ) {
                  rto_value_i = ex_showroom_price * (percentage / 100);
                } else if (!post_condition && !post_amount) {
                  if (
                    (pre_condition === '<' &&
                      carExShorRoomPrice < pre_amount) ||
                    (pre_condition === '>' &&
                      carExShorRoomPrice > pre_amount) ||
                    (pre_condition === '<=' &&
                      carExShorRoomPrice <= pre_amount) ||
                    (pre_condition === '>=' && carExShorRoomPrice >= pre_amount)
                  ) {
                    rto_value_i = ex_showroom_price * (percentage / 100);
                  }
                } else {
                  if (
                    (pre_condition === '>' &&
                      post_condition === '<=' &&
                      ex_showroom_price > pre_amount &&
                      ex_showroom_price <= post_amount) ||
                    (pre_condition === '>=' &&
                      post_condition === '<=' &&
                      ex_showroom_price >= pre_amount &&
                      ex_showroom_price <= post_amount) ||
                    (pre_condition === '>=' &&
                      post_condition === '<' &&
                      ex_showroom_price >= pre_amount &&
                      ex_showroom_price < post_amount) ||
                    (pre_condition === '>' &&
                      post_condition === '<' &&
                      ex_showroom_price > pre_amount &&
                      ex_showroom_price < post_amount)
                  ) {
                    rto_value_i = ex_showroom_price * (percentage / 100);
                  }
                }
              }

              if (model.cbu_status === '1' && state.state_name === 'Gujarat') {
                rto_value_i *= 2;
              }
            }
          } catch (err) {
            console.error('Error processing individual RTO rates:', err);
            throw new ApiError(
              httpStatus.INTERNAL_SERVER_ERROR,
              'RTO calculation error'
            );
          }

          const RTOrateCor = await Rto.findAll({
            where: { state_id, rto_type: 'C' },
          });

          if (RTOrateCor.length === 0) {
            rto_value_c = rto_value_i * 2;
          }
          let checkRTOready = true;

          if (RTOrateCor.length > 0) {
            try {
              for (const rtocheck of RTOrateCor) {
                if (rtocheck.cc === 1) {
                  checkRTOready = false;

                  const getCC = await FeatureValue.findOne({
                    where: { variant_id },
                    include: [
                      {
                        model: Feature,
                        as: 'feature',
                        where: { features_name: 'Displacement' },
                      },
                    ],
                    attributes: ['feature_value'],
                  });

                  if (getCC) {
                    checkRTOready = true;
                    carExShorRoomPrice = getCC.feature_value;
                  }
                }

                if (rtocheck.fuel_type) {
                  checkRTOready = false;

                  const modelIdEvCheck = await CarModel.findOne({
                    where: { model_id },
                    attributes: ['model_type'],
                  });

                  if (
                    modelIdEvCheck.model_type === '1' &&
                    rtocheck.fuel_type === 'EV'
                  ) {
                    checkRTOready = true;
                  } else {
                    const getFuelType = await FeatureValue.findOne({
                      where: { variant_id },
                      include: [
                        {
                          model: Feature,
                          as: 'feature',
                          where: { features_name: 'Type of Fuel' },
                        },
                      ],
                      attributes: ['feature_value'],
                    });

                    if (
                      getFuelType &&
                      getFuelType.feature_value === rtocheck.fuel_type
                    ) {
                      checkRTOready = true;
                    }
                  }
                }

                if (checkRTOready) {
                  const {
                    pre_condition,
                    pre_amount,
                    post_condition,
                    post_amount,
                    percentage,
                  } = rtocheck;

                  if (
                    !pre_condition &&
                    !pre_amount &&
                    !post_condition &&
                    !post_amount
                  ) {
                    rto_value_c = ex_showroom_price * (percentage / 100);
                  } else if (!post_condition && !post_amount) {
                    if (
                      (pre_condition === '<' &&
                        carExShorRoomPrice < pre_amount) ||
                      (pre_condition === '>' &&
                        carExShorRoomPrice > pre_amount) ||
                      (pre_condition === '<=' &&
                        carExShorRoomPrice <= pre_amount) ||
                      (pre_condition === '>=' &&
                        carExShorRoomPrice >= pre_amount)
                    ) {
                      rto_value_c = ex_showroom_price * (percentage / 100);
                    }
                  } else {
                    if (
                      (pre_condition === '>' &&
                        post_condition === '<=' &&
                        ex_showroom_price > pre_amount &&
                        ex_showroom_price <= post_amount) ||
                      (pre_condition === '>=' &&
                        post_condition === '<=' &&
                        ex_showroom_price >= pre_amount &&
                        ex_showroom_price <= post_amount) ||
                      (pre_condition === '>=' &&
                        post_condition === '<' &&
                        ex_showroom_price >= pre_amount &&
                        ex_showroom_price < post_amount) ||
                      (pre_condition === '>' &&
                        post_condition === '<' &&
                        ex_showroom_price > pre_amount &&
                        ex_showroom_price < post_amount)
                    ) {
                      rto_value_c = ex_showroom_price * (percentage / 100);
                    }
                  }
                }

                const cpuType = await CarModel.findOne({
                  where: { model_id },
                  attributes: ['cbu_status'],
                });

                if (
                  cpuType.cbu_status === '1' &&
                  state.state_name === 'Gujarat'
                ) {
                  rto_value_c *= 2;
                }
              }
            } catch (err) {
              console.error('Error processing company RTO rates:', err);
              throw new ApiError(
                httpStatus.INTERNAL_SERVER_ERROR,
                'Company RTO calculation error'
              );
            }
          }
        }

        const [getTCSTax, getInsuranceTax] = await Promise.all([
          AllTax.findOne({ where: { tax_name: 'TCS' } }),
          AllTax.findOne({ where: { tax_name: 'Insurance' } }),
        ]);

        if (!getTCSTax || !getInsuranceTax) {
          throw new ApiError(
            httpStatus.NOT_FOUND,
            'TCS or Insurance tax record not found'
          );
        }

        const insuranceAmt =
          (ex_showroom_price * getInsuranceTax.percent) / 100;
        let tcsAmt = 0;
        let price_entry = {};

        if (ex_showroom_price > 1000000) {
          tcsAmt = (ex_showroom_price * 1) / 100;
          price_entry.tax_id = JSON.stringify([
            getTCSTax.tax_id,
            getInsuranceTax.tax_id,
          ]);

          price_entry.tax_cost = JSON.stringify({
            [getTCSTax.tax_id]: tcsAmt.toFixed(2),
            [getInsuranceTax.tax_id]: insuranceAmt.toFixed(2),
          });
        } else {
          price_entry.tax_id = JSON.stringify([getInsuranceTax.tax_id]);
          price_entry.tax_cost = JSON.stringify({
            [getInsuranceTax.tax_id]: insuranceAmt.toFixed(2),
          });
        }

        let totalPriceInd =
          ex_showroom_price + rto_value_i + tcsAmt + insuranceAmt;
        let totalPriceCor =
          ex_showroom_price + rto_value_c + tcsAmt + insuranceAmt;

        await PriceEntry.upsert(
          {
            brand_id: brand_id,
            model_id: model_id,
            variant_id: variant_id,
            country_id: country.country_id,
            state_id: state_id,
            city_id: city_id,
            ex_showroom_price: ex_showroom_price,
            tax_id: price_entry.tax_id,
            tax_cost: price_entry.tax_cost,
            i_rto_price: rto_value_i,
            c_rto_price: rto_value_c,
            total_price: totalPriceInd,
            total_price_c: totalPriceCor,
            created_by: user.id,
          },
          {
            where: {
              brand_id: brand_id,
              model_id: model_id,
              variant_id: variant_id,
              country_id: country.country_id,
              state_id: state_id,
              city_id: city_id,
            },
          }
        );
      } catch (error) {
        console.error(`Error processing price entry for row ${i + 1}:`, error);
        throw error;
      }
    }
  } catch (error) {
    console.error('An error occurred during bulk price creation:', error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Bulk price creation failed'
    );
  }
};

module.exports = {
  getModelsByBrand,
  getVariantsByModel,
  getStatesByCountry,
  getCitiesByState,
  calculatePrice,
  calculateTax,
  queryPriceEntries,
  bulkCreatePrice,
};
