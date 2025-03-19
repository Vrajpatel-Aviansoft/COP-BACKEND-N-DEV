const {
  Specification,
  SpecificationCategory,
  Feature,
  FeatureValue,
} = require('../db/models');
const {
  buildQueryOptions,
  formatQueryResult,
} = require('../utils/queryHelper');
const { uploadFiles } = require('../utils/fileUpload');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const isSpecTaken = async (name) => {
  try {
    return (await Specification.count({ where: { spec_name: name } })) > 0;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

const createSpecification = async (user, specBody, specFiles) => {
  try {
    if (await isSpecTaken(specBody.spec_name)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Specification already exists'
      );
    }
    const specification = await Specification.create({
      ...specBody,
    });

    await uploadFiles([
      {
        buffer: specFiles.spec_image[0].buffer,
        filename: `/specification/${specification.spec_id}/${specification.spec_id}.svg`,
        contentType: 'image/svg',
      },
    ]);
    return specification
      .set({
        spec_image: `${specification.spec_id}.svg`,
      })
      .save();
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

const querySpecs = async (query) => {
  try {
    const queryOptions = buildQueryOptions(query);
    queryOptions.include = [
      {
        model: SpecificationCategory,
        as: 'spec_cat',
        attributes: ['sc_name'],
      },
    ];
    const specs = await Specification.findAndCountAll(queryOptions);
    return formatQueryResult(specs, query);
  } catch (error) {
    console.error('Error in querySpecs:', error);
    throw error;
  }
};

const deleteSpecification = async (uuid) => {
  return Specification.destroy({ where: { uuid } });
};

const getSpecByUuid = async (uuid) => {
  return Specification.findOne({ where: { uuid } });
};

const toggleSpecificationStatus = async (uuid) => {
  const specification = await Specification.findOne({ where: { uuid } });
  if (!specification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Specification not found');
  }
  specification.status = !specification.status;
  return specification.save();
};

const updateSpecification = async (
  uuid,
  specificationBody,
  specificationFiles
) => {
  const specification = await Specification.findOne({ where: { uuid } });
  if (!specification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Specification not found');
  }
  if (specificationFiles.spec_image) {
    await uploadFiles([
      {
        buffer: specificationFiles.spec_image[0].buffer,
        filename: `/specification/${specification.spec_id}/${specification.spec_id}.svg`,
        contentType: 'image/svg',
      },
    ]);
  }

  return specification
    .set({
      ...specificationBody,
      spec_image: `${specification.spec_id}.svg`,
    })
    .save();
};

const getSpecificationsByUuid = async (uuid, vuuid) => {
  try {
    const specifications = await Specification.findAll({
      where: { uuid },
      include: [
        {
          model: Feature,
          as: 'feature',
          include: [
            {
              model: FeatureValue,
              as: 'featureValue',
              required: false,
              where: {
                variant_id: vuuid,
              },
              attributes: ['feature_value', 'feature_id', 'key_highlight'],
            },
          ],
        },
      ],
    });

    return specifications;
  } catch (error) {
    console.error('Error in getSpecificationsByUuid:', error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error fetching features for the specs'
    );
  }
};

const getSpecifications = async () => {
  return Specification.findAll();
};

module.exports = {
  createSpecification,
  querySpecs,
  deleteSpecification,
  getSpecByUuid,
  toggleSpecificationStatus,
  updateSpecification,
  getSpecifications,
  getSpecificationsByUuid,
};
