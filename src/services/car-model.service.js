const {
  CarModel,
  CarStage,
  Brand,
  CarType,
  MSD,
  Rating,
  RatingType,
} = require('../db/models');
const {
  buildQueryOptions,
  formatQueryResult,
} = require('../utils/queryHelper');
const { carTypeService, brandService } = require('.');
const { compressImages } = require('../utils/sharp');
const { uploadFiles } = require('../utils/fileUpload');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { Op } = require('sequelize');
const {
  carModelCols,
} = require('../validations/imports/columns/car-model-cols');
const axios = require('axios');

const getCarModelIdByName = async (name) => {
  const carModel = await CarModel.findOne({
    raw: true,
    where: { model_name: { [Op.like]: `%${name?.trim()}%` } },
  });
  return carModel?.model_id;
};

const getModelIdByBrandIdAndName = async (modelName, brandId) => {
  const carModel = await CarModel.findOne({
    raw: true,
    where: { brand_id: brandId, model_name: { [Op.like]: modelName?.trim() } },
  });
  return carModel?.model_id;
};

const isCarModelTaken = async (name) => {
  return (await CarModel.count({ where: { model_name: name } })) > 0;
};

const createCarModel = async (user, carModelBody, carModelFiles) => {
  if (await isCarModelTaken(carModelBody.model_name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Car model already exists');
  }

  const launchDate = carModelBody.launch_date;
  const modelYear = new Date(launchDate).getFullYear();

  const carModel = await CarModel.create({
    ...carModelBody,
    model_year: modelYear,
    created_by: user.id,
    updated_by: user.id,
  });

  const [modelImageBuffer, modelImageMobBuffer] = await compressImages([
    carModelFiles.model_image[0].buffer,
    carModelFiles.model_image_mob[0].buffer,
  ]);

  await uploadFiles([
    {
      buffer: modelImageBuffer,
      filename: `/brand/${carModel.brand_id}/${carModel.model_id}/${carModel.model_id}.webp`,
      contentType: 'image/webp',
    },
    {
      buffer: modelImageMobBuffer,
      filename: `/brand/${carModel.brand_id}/${carModel.model_id}/${carModel.model_id}_mob.webp`,
      contentType: 'image/webp',
    },
  ]);

  await carModel
    .set({
      model_image: `${carModel.model_id}.webp`,
      model_image_mob: `${carModel.model_id}_mob.webp`,
    })
    .save();

  const msdData = {};
  if (carModelBody.model_type) msdData.model_type = carModelBody.model_type;
  if (carModelBody.model_engine)
    msdData.model_engine = carModelBody.model_engine;
  if (carModelBody.model_bhp) msdData.model_bhp = carModelBody.model_bhp;
  if (carModelBody.model_transmission)
    msdData.model_transmission = carModelBody.model_transmission;
  if (carModelBody.model_mileage)
    msdData.model_mileage = carModelBody.model_mileage;

  if (Object.keys(msdData).length > 0) {
    await MSD.create({
      model_id: carModel.model_id,
      ...msdData,
      model_fuel: carModelBody.model_fuel,
    });
  }

  if (carModelBody.rating_value && carModelBody.model_rating_type) {
    const ratingType = await RatingType.findOne({
      where: { rating_type_name: carModelBody.model_rating_type },
    });

    if (!ratingType) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid rating type');
    }

    await Rating.create({
      brand_id: carModel.brand_id,
      model_id: carModel.model_id,
      rating_type_id: ratingType.rating_type_id,
      rating_value: carModelBody.rating_value,
    });
  }

  return carModel;
};

const queryCarModels = async (query) => {
  const queryOptions = buildQueryOptions(query);
  queryOptions.include = [
    { model: CarStage, as: 'car_stage', attributes: ['cs_name'] },
    { model: Brand, as: 'brand', attributes: ['brand_name'] },
    { model: CarType, as: 'car_type', attributes: ['ct_name'] },
  ];
  const carModels = await CarModel.findAndCountAll(queryOptions);
  return formatQueryResult(carModels, query);
};

const getCarModelsByBrandId = async (brandId) => {
  return CarModel.findAll({
    where: { brand_id: brandId },
    raw: true,
    attributes: ['model_id', 'model_name'],
  });
};

const deleteCarModel = async (uuid) => {
  const carModel = await CarModel.findOne({ where: { uuid } });
  if (!carModel) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Car model not found');
  }

  await MSD.destroy({ where: { model_id: carModel.model_id } });

  await Rating.destroy({ where: { model_id: carModel.model_id } });

  await CarModel.destroy({ where: { uuid } });

  return { message: 'Car model and associated data deleted successfully' };
};

const getCarModelByUuid = async (uuid) => {
  return CarModel.findOne({ where: { uuid } });
};

const editCarModel = async (uuid, carModelBody) => {
  return CarModel.update(carModelBody, {
    where: { uuid },
  });
};

const toggleCarModelStatus = async (uuid, type) => {
  const carModel = await CarModel.findOne({ where: { uuid } });
  if (!carModel) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Car model not found');
  }
  carModel[type] = !carModel[type];
  return carModel.save();
};

const updateCarModel = async (uuid, carModelBody, carModelFiles, user) => {
  const carModel = await CarModel.findOne({ where: { uuid } });
  if (!carModel) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Car model not found');
  }

  const updates = {};

  if (
    carModelBody.model_name &&
    carModel.model_name !== carModelBody.model_name
  ) {
    const existingModel = await CarModel.findOne({
      where: {
        model_name: carModelBody.model_name,
        uuid: { [Op.ne]: uuid },
      },
    });

    if (existingModel) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Model name already exists');
    }
    updates.model_name = carModelBody.model_name;
  }

  if (carModelFiles) {
    let filesUpdated = false;
    if (carModelFiles.model_image) {
      const [modelImageBuffer] = await compressImages([
        carModelFiles.model_image[0].buffer,
      ]);
      await uploadFiles([
        {
          buffer: modelImageBuffer,
          filename: `/brand/${carModel.brand_id}/${carModel.model_id}/${carModel.model_id}.webp`,
          contentType: 'image/webp',
        },
      ]);
      updates.model_image = `${carModel.model_id}.webp`;
      filesUpdated = true;
    }

    if (carModelFiles.model_image_mob) {
      const [modelImageMobBuffer] = await compressImages([
        carModelFiles.model_image_mob[0].buffer,
      ]);
      await uploadFiles([
        {
          buffer: modelImageMobBuffer,
          filename: `/brand/${carModel.brand_id}/${carModel.model_id}/${carModel.model_id}.webp`,
          contentType: 'image/webp',
        },
      ]);
      updates.model_image_mob = `${carModel.model_id}_mob.webp`;
      filesUpdated = true;
    }

    if (filesUpdated) {
      await carModel.set({ ...updates, updated_by: user.id }).save();
    }
  }

  const msdFields = await MSD.findOne({
    where: { model_id: carModel.model_id },
  });

  const msdUpdate = {};
  if (
    carModelBody.model_type &&
    carModelBody.model_type !== msdFields?.model_type
  )
    msdUpdate.model_type = carModelBody.model_type;
  if (
    carModelBody.model_engine &&
    carModelBody.model_engine !== msdFields?.model_engine
  )
    msdUpdate.model_engine = carModelBody.model_engine;
  if (carModelBody.model_bhp && carModelBody.model_bhp !== msdFields?.model_bhp)
    msdUpdate.model_bhp = carModelBody.model_bhp;
  if (
    carModelBody.model_transmission &&
    carModelBody.model_transmission !== msdFields?.model_transmission
  )
    msdUpdate.model_transmission = carModelBody.model_transmission;
  if (
    carModelBody.model_mileage &&
    carModelBody.model_mileage !== msdFields?.model_mileage
  )
    msdUpdate.model_mileage = carModelBody.model_mileage;
  if (
    carModelBody.model_fuel &&
    carModelBody.model_fuel !== msdFields?.model_fuel
  )
    msdUpdate.model_fuel = carModelBody.model_fuel;

  if (Object.keys(msdUpdate).length > 0) {
    if (msdFields) {
      await msdFields.update(msdUpdate);
    } else {
      await MSD.create({ model_id: carModel.model_id, ...msdUpdate });
    }
  }

  const ratingRecord = await Rating.findOne({
    where: { model_id: carModel.model_id },
  });

  if (carModel.cs_id === '1' && ratingRecord) {
    await ratingRecord.destroy();
  } else if (carModelBody.model_rating_type && carModelBody.rating_value) {
    const ratingType = await RatingType.findOne({
      where: { rating_type_name: carModelBody.model_rating_type },
    });

    if (!ratingType) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid rating type');
    }

    if (ratingRecord) {
      await ratingRecord.update({
        rating_value: carModelBody.rating_value,
        rating_type_id: ratingType.rating_type_id,
      });
    } else {
      await Rating.create({
        brand_id: carModel.brand_id,
        model_id: carModel.model_id,
        rating_type_id: ratingType.rating_type_id,
        rating_value: carModelBody.rating_value,
      });
    }
  }

  if (Object.keys(updates).length > 0 || Object.keys(msdUpdate).length > 0) {
    await carModel.set({ ...updates, updated_by: user.id }).save();
  }

  return carModel;
};

const getModels = async () => {
  return CarModel.findAll();
};

const checkModelInTable = async (modelName, brandName) => {
  try {
    const brand = await Brand.findOne({
      where: { brand_name: brandName },
    });

    if (!brand) {
      return false;
    }

    const model = await CarModel.findOne({
      where: {
        model_name: modelName,
        brand_id: brand.brand_id,
      },
    });
    return model !== null;
  } catch (error) {
    console.error('Error checking model in table:', error);
    return false;
  }
};

const bulkCreateModelNonEvLaunched = async (user, rows) => {
  for (let i = 0; i < rows.length; i++) {
    const carModel = rows[i];
    const carStage = await CarStage.findOne({
      where: { cs_name: 'Launched' },
    });
    if (!carStage) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Car Stage not found');
    }
    const ct_id = await carTypeService.getCarTypeIdByName(
      carModel[carModelCols.CAR_TYPE]
    );
    if (!ct_id) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Car type not found');
    }
    const brand_id = await brandService.getBrandIdByName(
      carModel[carModelCols.BRAND_NAME]
    );
    if (!brand_id) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Brand not found');
    }
    const carModelImageResponse = await axios.get(
      carModel[carModelCols.MODEL_IMAGE],
      {
        responseType: 'arraybuffer',
      }
    );
    const carModelFiles = {
      model_image: [
        {
          buffer: Buffer.from(carModelImageResponse.data),
        },
      ],
      model_image_mob: [
        {
          buffer: Buffer.from(carModelImageResponse.data),
        },
      ],
    };

    const carModelBody = {
      model_name: carModel[carModelCols.MODEL_NAME],
      cs_id: carStage.cs_id,
      launch_date: carModel[carModelCols.LAUNCH_DATE],
      ct_id,
      brand_id,
      model_description: carModel[carModelCols.MODEL_DESCRIPTION],
      min_price: carModel[carModelCols.MIN_PRICE],
      max_price: carModel[carModelCols.MAX_PRICE],
      model_type: '0',
      model_engine: carModel[carModelCols.ENGINE],
      model_bhp: carModel[carModelCols.MODEL_BHP],
      model_transmission: carModel[carModelCols.MODEL_TRANSMISSION],
      model_mileage: carModel[carModelCols.MODEL_MILEAGE],
      model_fuel: carModel[carModelCols.MODEL_FUEL],
      model_rating_type: carModel[carModelCols.NCAP_BCAP],
      rating_value: carModel[carModelCols.RATINGS],
      cbu_status: false,
    };
    const carModelName = await CarModel.findOne({
      raw: true,
      where: {
        model_name: {
          [Op.like]: carModel[carModelCols.MODEL_NAME],
        },
      },
    });
    if (carModelName) {
      await updateCarModel(
        carModelName.uuid,
        carModelBody,
        carModelFiles,
        user
      );
    } else {
      await createCarModel(user, carModelBody, carModelFiles);
    }
  }
};

const bulkCreateModelNonEvUpcoming = async (user, rows) => {
  for (let i = 0; i < rows.length; i++) {
    const carModel = rows[i];
    const carStage = await CarStage.findOne({
      where: { cs_name: 'Upcoming' },
    });
    if (!carStage) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Car Stage not found');
    }
    const ct_id = await carTypeService.getCarTypeIdByName(
      carModel[carModelCols.CAR_TYPE]
    );
    if (!ct_id) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Car type not found');
    }
    const brand_id = await brandService.getBrandIdByName(
      carModel[carModelCols.BRAND_NAME]
    );
    if (!brand_id) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Brand not found');
    }

    const carModelImageResponse = await axios.get(
      carModel[carModelCols.MODEL_IMAGE],
      {
        responseType: 'arraybuffer',
      }
    );
    const carModelFiles = {
      model_image: [
        {
          buffer: Buffer.from(carModelImageResponse.data),
        },
      ],
      model_image_mob: [
        {
          buffer: Buffer.from(carModelImageResponse.data),
        },
      ],
    };

    const carModelBody = {
      launch_date: carModel[carModelCols.LAUNCH_DATE],
      model_name: carModel[carModelCols.MODEL_NAME],
      cs_id: carStage.cs_id,
      launch_date: carModel[carModelCols.LAUNCH_DATE],
      ct_id,
      brand_id,
      model_description: carModel[carModelCols.MODEL_DESCRIPTION],
      min_price: carModel[carModelCols.MIN_PRICE],
      max_price: carModel[carModelCols.MAX_PRICE],
      model_type: '0',
      model_engine: carModel[carModelCols.ENGINE],
      model_bhp: carModel[carModelCols.MODEL_BHP],
      model_transmission: carModel[carModelCols.MODEL_TRANSMISSION],
      model_mileage: carModel[carModelCols.MODEL_MILEAGE],
      model_fuel: carModel[carModelCols.MODEL_FUEL],
      cbu_status: false,
    };
    const carModelName = await CarModel.findOne({
      raw: true,
      where: {
        model_name: {
          [Op.like]: carModel[carModelCols.MODEL_NAME],
        },
      },
    });
    if (carModelName) {
      await updateCarModel(
        carModelName.uuid,
        carModelBody,
        carModelFiles,
        user
      );
    } else {
      await createCarModel(user, carModelBody, carModelFiles);
    }
  }
};

const bulkCreateModelEvLaunched = async (user, rows) => {
  for (let i = 0; i < rows.length; i++) {
    const carModel = rows[i];
    const carStage = await CarStage.findOne({
      where: { cs_name: 'Launched' },
    });
    if (!carStage) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Car Stage not found');
    }
    const ct_id = await carTypeService.getCarTypeIdByName(
      carModel[carModelCols.CAR_TYPE]
    );
    if (!ct_id) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Car type not found');
    }
    const brand_id = await brandService.getBrandIdByName(
      carModel[carModelCols.BRAND_NAME]
    );
    if (!brand_id) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Brand not found');
    }

    const carModelImageResponse = await axios.get(
      carModel[carModelCols.MODEL_IMAGE],
      {
        responseType: 'arraybuffer',
      }
    );

    const carModelImageMobResponse = await axios.get(
      carModel[carModelCols.MODEL_MOB_IMAGE],
      {
        responseType: 'arraybuffer',
      }
    );

    const carModelFiles = {
      model_image: [
        {
          buffer: Buffer.from(carModelImageResponse.data),
        },
      ],
      model_image_mob: [
        {
          buffer: Buffer.from(carModelImageMobResponse.data),
        },
      ],
    };

    const carModelBody = {
      model_name: carModel[carModelCols.MODEL_NAME],
      cs_id: carStage.cs_id,
      launch_date: carModel[carModelCols.LAUNCH_DATE],
      ct_id,
      brand_id,
      model_description: carModel[carModelCols.MODEL_DESCRIPTION],
      min_price: carModel[carModelCols.MIN_PRICE],
      max_price: carModel[carModelCols.MAX_PRICE],
      model_type: '1',
      model_engine: carModel[carModelCols.BATTERY_CAPACITY],
      model_bhp: carModel[carModelCols.MODEL_POWER],
      model_transmission: carModel[carModelCols.MODEL_TRANSMISSION],
      model_mileage: carModel[carModelCols.DRIVING_RANGE],
      model_fuel: carModel[carModelCols.CHARGING_TIME],
      model_rating_type: carModel[carModelCols.NCAP_BCAP],
      rating_value: carModel[carModelCols.RATINGS],
      cbu_status: false,
    };
    const carModelName = await CarModel.findOne({
      raw: true,
      where: {
        model_name: {
          [Op.like]: carModel[carModelCols.MODEL_NAME],
        },
      },
    });
    if (carModelName) {
      await updateCarModel(
        carModelName.uuid,
        carModelBody,
        carModelFiles,
        user
      );
    } else {
      await createCarModel(user, carModelBody, carModelFiles);
    }
  }
};

const bulkCreateModelEvUpcoming = async (user, rows) => {
  for (let i = 0; i < rows.length; i++) {
    const carModel = rows[i];
    const carStage = await CarStage.findOne({
      where: { cs_name: 'Upcoming' },
    });
    if (!carStage) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Car Stage not found');
    }
    const ct_id = await carTypeService.getCarTypeIdByName(
      carModel[carModelCols.CAR_TYPE]
    );
    if (!ct_id) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Car type not found');
    }
    const brand_id = await brandService.getBrandIdByName(
      carModel[carModelCols.BRAND_NAME]
    );
    if (!brand_id) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Brand not found');
    }

    const carModelImageResponse = await axios.get(
      carModel[carModelCols.MODEL_IMAGE],
      {
        responseType: 'arraybuffer',
      }
    );
    const carModelFiles = {
      model_image: [
        {
          buffer: Buffer.from(carModelImageResponse.data),
        },
      ],
      model_image_mob: [
        {
          buffer: Buffer.from(carModelImageResponse.data),
        },
      ],
    };

    const carModelBody = {
      launch_date: carModel[carModelCols.LAUNCH_DATE],
      model_name: carModel[carModelCols.MODEL_NAME],
      cs_id: carStage.cs_id,
      ct_id,
      brand_id,
      model_description: carModel[carModelCols.MODEL_DESCRIPTION],
      min_price: carModel[carModelCols.MIN_PRICE],
      max_price: carModel[carModelCols.MAX_PRICE],
      model_type: '1',
      model_engine: carModel[carModelCols.BATTERY_CAPACITY],
      model_bhp: carModel[carModelCols.MODEL_POWER],
      model_transmission: carModel[carModelCols.MODEL_TRANSMISSION],
      model_mileage: carModel[carModelCols.DRIVING_RANGE],
      model_fuel: carModel[carModelCols.CHARGING_TIME],
      cbu_status: false,
    };
    const carModelName = await CarModel.findOne({
      raw: true,
      where: {
        model_name: {
          [Op.like]: carModel[carModelCols.MODEL_NAME],
        },
      },
    });
    if (carModelName) {
      await updateCarModel(
        carModelName.uuid,
        carModelBody,
        carModelFiles,
        user
      );
    } else {
      await createCarModel(user, carModelBody, carModelFiles);
    }
  }
};

module.exports = {
  createCarModel,
  isCarModelTaken,
  queryCarModels,
  deleteCarModel,
  getCarModelByUuid,
  editCarModel,
  toggleCarModelStatus,
  updateCarModel,
  getCarModelsByBrandId,
  getModels,
  checkModelInTable,
  getCarModelIdByName,
  bulkCreateModelNonEvLaunched,
  bulkCreateModelNonEvUpcoming,
  bulkCreateModelEvLaunched,
  bulkCreateModelEvUpcoming,
  getModelIdByBrandIdAndName,
};
