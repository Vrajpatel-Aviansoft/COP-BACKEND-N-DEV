const { AllTax, TaxValue } = require('../../db/models');
const {
  buildQueryOptions,
  formatQueryResult,
} = require('../../utils/queryHelper');
const ApiError = require('../../utils/ApiError');
const httpStatus = require('http-status');

const isTaxNameTaken = async (tax_name) => {
  try {
    return (await AllTax.count({ where: { tax_name: tax_name } })) > 0;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

const createTax = async (user, taxBody) => {
  try {
    if (await isTaxNameTaken(taxBody.tax_name)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Tax name already exists');
    }

    const tax = await AllTax.create({
      ...taxBody,
    });

    if (taxBody.condition_status === '1') {
      const taxValues = [
        {
          condition: taxBody.condition1,
          percent: taxBody.percent1,
        },
        {
          condition: taxBody.condition2,
          percent: taxBody.percent2,
        },
      ];

      for (const taxValue of taxValues) {
        await TaxValue.create({
          tax_id: tax.tax_id,
          condition: taxValue.condition,
          amount: taxBody.amount,
          percent: taxValue.percent,
        });
      }

      await tax.update({
        percent: null,
        value: null,
      });
    }

    return tax;
  } catch (error) {
    console.error(error, 'Error in createTax service');
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error creating tax');
  }
};

const queryTaxes = async (query) => {
  try {
    const queryOptions = buildQueryOptions(query);
    const taxes = await AllTax.findAndCountAll(queryOptions);
    return formatQueryResult(taxes, query);
  } catch (error) {
    console.error('Error in queryTaxes:', error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error querying taxes'
    );
  }
};

const getTaxByUuid = async (uuid) => {
  return AllTax.findOne({ where: { uuid } });
};

const updateTax = async (uuid, taxBody, user) => {
  try {
    const tax = await AllTax.findOne({ where: { uuid } });

    if (!tax) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Tax not found');
    }

    await tax.update({
      ...taxBody,
      percent:
        taxBody.percent && taxBody.percent.trim() !== ''
          ? taxBody.percent
          : null,
      value:
        taxBody.value && taxBody.value.trim() !== '' ? taxBody.value : null,
    });

    if (taxBody.condition_status === '1') {
      const existingTaxValues = await TaxValue.findAll({
        where: { tax_id: tax.tax_id },
      });

      const taxValues = [
        {
          condition: taxBody.condition1,
          percent: taxBody.percent1,
        },
        {
          condition: taxBody.condition2,
          percent: taxBody.percent2,
        },
      ];

      for (let i = 0; i < taxValues.length; i++) {
        const taxValue = taxValues[i];
        if (existingTaxValues[i]) {
          await existingTaxValues[i].update({
            condition: taxValue.condition,
            amount: taxBody.amount,
            percent: taxValue.percent,
          });
        } else {
          await TaxValue.create({
            tax_id: tax.tax_id,
            condition: taxValue.condition,
            amount: taxBody.amount,
            percent: taxValue.percent,
          });
        }
      }
    } else {
      await TaxValue.destroy({ where: { tax_id: tax.tax_id } });
    }

    return tax;
  } catch (error) {
    console.error(error, 'Error in updateTax service');
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error updating tax');
  }
};

const deleteTax = async (uuid) => {
  const tax = await AllTax.findOne({ where: { uuid } });

  if (!tax) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tax not found');
  }

  await TaxValue.destroy({ where: { tax_id: tax.tax_id } });

  return AllTax.destroy({ where: { uuid } });
};

const toggleTaxStatus = async (uuid) => {
  const tax = await AllTax.findOne({ where: { uuid } });
  if (!tax) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tax not found');
  }
  tax.status = !tax.status;
  return tax.save();
};

module.exports = {
  createTax,
  queryTaxes,
  getTaxByUuid,
  updateTax,
  deleteTax,
  toggleTaxStatus,
};
