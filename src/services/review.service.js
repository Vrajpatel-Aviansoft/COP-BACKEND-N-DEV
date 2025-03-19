const { Review, Brand, CarModel } = require('../db/models');
const {
  buildQueryOptions,
  formatQueryResult,
} = require('../utils/queryHelper');
const { brandService, carModelService, seedService } = require('../services');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { reviewColumns } = require('../validations/imports/columns/review-cols');

const queryReview = async (query) => {
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
        as: 'model',
        attributes: ['model_name'],
      },
    ];
    const review = await Review.findAndCountAll(queryOptions);
    return formatQueryResult(review, query);
  } catch (error) {
    console.error('Error in queryReview:', error);
    throw error;
  }
};

const bulkCreateReview = async (user, rows) => {
  try {
    for (let i = 0; i < rows.length; i++) {
      const review = rows[i];

      const brand_id = await brandService.getBrandIdByName(
        review[reviewColumns.BRAND_NAME]
      );
      if (!brand_id) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Brand not found');
      }

      const model_id = await carModelService.getCarModelIdByName(
        review[reviewColumns.MODEL_NAME]
      );
      if (!model_id) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Model not found');
      }

      const user_id = await seedService.getUserIdByName(
        review[reviewColumns.Full_NAME]
      );
      if (!user_id) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
      }

      const existingReview = await Review.findOne({
        where: {
          brand_id: brand_id,
          model_id: model_id,
          created_by: user_id,
        },
      });

      if (existingReview) {
        existingReview.rating = review[reviewColumns.RATING];
        existingReview.review = review[reviewColumns.REVIEW];
        await existingReview.save();
      } else {
        await Review.create({
          brand_id: brand_id,
          model_id: model_id,
          created_by: user_id,
          rating: review[reviewColumns.RATING],
          review: review[reviewColumns.REVIEW],
        });
      }
    }
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

module.exports = {
  bulkCreateReview,
  queryReview,
};
