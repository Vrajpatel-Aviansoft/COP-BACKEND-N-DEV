const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const {
  CarGraphics,
  CarGraphicType,
  Brand,
  CarModel,
} = require('../db/models');
const { uploadFiles } = require('../utils/fileUpload');
const {
  buildQueryOptions,
  formatQueryResult,
} = require('../utils/queryHelper');
const delay = require('../utils/delay');
const { moveObject, deleteObjects } = require('../config/minio');
const { brandService, carModelService, carGraphicsTypeService } = require('.');
const {
  carGraphicsImageCols,
  carGraphicsVideoCols,
} = require('../validations/imports/columns/car-graphics-cols');
const { default: axios } = require('axios');

const getModelsByBrand = async (brandId) => {
  try {
    return await CarModel.findAll({ where: { brand_id: brandId } });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error fetching models for the brand'
    );
  }
};

const createCarGraphics = async (body, files, user) => {
  try {
    const {
      brand_id,
      model_id,
      gt_id,
      car_graphics_images,
      car_graphics_images_mob,
      status,
    } = body;

    const desktopImages = files.filter(
      (file) => file.fieldname === 'car_graphics_images'
    );
    const mobileImages = files.filter(
      (file) => file.fieldname === 'car_graphics_images_mob'
    );
    const videoFiles = files.filter(
      (file) => file.fieldname === 'car_graphics_video'
    );

    const graphicsType = await CarGraphicType.findOne({
      where: { gt_id },
      attributes: ['gt_name'],
    });

    const path = `/car_graphics/${model_id}/${graphicsType.gt_name
      .toLowerCase()
      .replace(/\s+/g, '_')}`;
    const contentType = 'image/webp';

    const cargraphicsObj = {
      brand_id,
      model_id,
      gt_id,
      graphic_file: '',
      graphic_file_alt: '',
      graphic_file_mob: '',
      graphic_file_mob_alt: '',
      status: status === 'on',
      created_by: user.id,
    };
    if (desktopImages.length > 0 && car_graphics_images.length > 0) {
      const filesUploadConfig = [];
      for (let i = 0; i < desktopImages.length; i++) {
        const fileName = `${model_id}_${Date.now()}_${i + 1}.webp`;
        cargraphicsObj.graphic_file = cargraphicsObj.graphic_file
          ? `${cargraphicsObj.graphic_file},${fileName}`
          : fileName;
        cargraphicsObj.graphic_file_alt = cargraphicsObj.graphic_file_alt
          ? `${cargraphicsObj.graphic_file_alt},${car_graphics_images[i].image_name}`
          : car_graphics_images[i].image_name;
        await delay(1);
        filesUploadConfig.push({
          buffer: desktopImages[i].buffer,
          filename: `${path}/${fileName}`,
          contentType,
        });
      }
      await uploadFiles(filesUploadConfig);
    }

    if (mobileImages.length > 0) {
      const filesUploadConfig = [];
      for (let i = 0; i < mobileImages.length; i++) {
        const fileName = `${model_id}_${Date.now()}_${i + 1}.webp`;
        cargraphicsObj.graphic_file_mob = cargraphicsObj.graphic_file_mob
          ? `${cargraphicsObj.graphic_file_mob},${fileName}`
          : fileName;
        cargraphicsObj.graphic_file_mob_alt =
          cargraphicsObj.graphic_file_mob_alt
            ? `${cargraphicsObj.graphic_file_mob_alt},${car_graphics_images_mob[i].image_name}`
            : car_graphics_images_mob[i].image_name;
        await delay(1);
        filesUploadConfig.push({
          buffer: mobileImages[i].buffer,
          filename: `${path}/${fileName}`,
          contentType,
        });
      }
      await uploadFiles(filesUploadConfig);
    }

    if (videoFiles.length > 0) {
      const fileName = `${model_id}_${Date.now()}.${
        videoFiles[0].mimetype.split('/')[1]
      }`;
      cargraphicsObj.graphic_file = cargraphicsObj.graphic_file
        ? `${cargraphicsObj.graphic_file},${fileName}`
        : fileName;
      await uploadFiles([
        {
          buffer: videoFiles[0].buffer,
          filename: `${path}/${fileName}`,
          contentType: videoFiles[0].mimetype,
        },
      ]);
    }
    const carGraphics = await CarGraphics.create(cargraphicsObj);
    return carGraphics;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

const queryCarGraphics = async (query) => {
  try {
    const queryOptions = buildQueryOptions(query);
    queryOptions.include = [
      {
        model: CarModel,
        attributes: ['model_name'],
        as: 'model',
        raw: true,
      },
      {
        model: Brand,
        attributes: ['brand_name'],
        as: 'brand',
        raw: true,
      },
      {
        model: CarGraphicType,
        attributes: ['gt_name'],
        as: 'graphic_type',
        raw: true,
      },
    ];
    const carGraphics = await CarGraphics.findAndCountAll(queryOptions);
    return formatQueryResult(carGraphics, query);
  } catch (error) {
    console.error('Error in queryCarGraphics:', error);
    throw error;
  }
};

const getCarGraphicsByUuid = async (uuid) => {
  return CarGraphics.findOne({
    where: { uuid },
    include: [
      {
        model: CarModel,
        attributes: ['model_name'],
        as: 'model',
      },
      {
        model: Brand,
        attributes: ['brand_name'],
        as: 'brand',
      },
      {
        model: CarGraphicType,
        attributes: ['gt_name'],
        as: 'graphic_type',
        raw: true,
      },
    ],
  });
};

const updateCarGraphics = async (uuid, body, files, user) => {
  try {
    const {
      brand_id,
      model_id,
      gt_id,
      car_graphics_images,
      car_graphics_images_mob,
      car_graphics_images_name,
      car_graphics_images_mob_name,
      status,
    } = body;

    const carGraphics = await CarGraphics.findOne({ where: { uuid } });

    if (!carGraphics) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Car graphics not found');
    }

    if (Number(model_id) !== Number(carGraphics.model_id)) {
      const oldFilePath = `car_graphics/${carGraphics.model_id}`;
      const newFilePath = `car_graphics/${model_id}`;
      await moveObject(oldFilePath, newFilePath);
    }

    const desktopImages = files.filter(
      (file) => file.fieldname === 'car_graphics_images'
    );
    const mobileImages = files.filter(
      (file) => file.fieldname === 'car_graphics_images_mob'
    );
    const videoFiles = files.filter(
      (file) => file.fieldname === 'car_graphics_video'
    );

    const graphicsType = await CarGraphicType.findOne({
      where: { gt_id },
      attributes: ['gt_name'],
    });

    const path = `/car_graphics/${model_id}/${graphicsType.gt_name
      .toLowerCase()
      .replace(/\s+/g, '_')}`;
    const contentType = 'image/webp';

    const cargraphicsObj = {
      brand_id,
      model_id,
      gt_id,
      status: status === 'on',
      updated_by: user.id,
    };

    if (car_graphics_images_name) {
      cargraphicsObj.graphic_file = car_graphics_images_name
        .map((image) => image.image_name)
        .join(',');
    }

    if (car_graphics_images) {
      cargraphicsObj.graphic_file_alt = car_graphics_images
        .map((image) => image.image_name)
        .join(',');
    }

    if (car_graphics_images_mob_name) {
      cargraphicsObj.graphic_file_mob = car_graphics_images_mob_name
        .map((image) => image.image_name)
        .join(',');
    }

    if (car_graphics_images_mob) {
      cargraphicsObj.graphic_file_mob_alt = car_graphics_images_mob
        .map((image) => image.image_name)
        .join(',');
    }

    if (desktopImages.length > 0 && car_graphics_images.length > 0) {
      const filesUploadConfig = [];
      for (let i = 0; i < desktopImages.length; i++) {
        const fileName = `${model_id}_${Date.now()}_${i + 1}.webp`;
        cargraphicsObj.graphic_file = cargraphicsObj.graphic_file
          ? `${cargraphicsObj.graphic_file},${fileName}`
          : fileName;
        cargraphicsObj.graphic_file_alt = cargraphicsObj.graphic_file_alt
          ? `${cargraphicsObj.graphic_file_alt},${car_graphics_images[i].image_name}`
          : car_graphics_images[i].image_name;
        await delay(1);
        filesUploadConfig.push({
          buffer: desktopImages[i].buffer,
          filename: `${path}/${fileName}`,
          contentType,
        });
      }
      await uploadFiles(filesUploadConfig);
    }

    if (mobileImages.length > 0) {
      const filesUploadConfig = [];
      for (let i = 0; i < mobileImages.length; i++) {
        const fileName = `${model_id}_${Date.now()}_${i + 1}.webp`;
        cargraphicsObj.graphic_file_mob = cargraphicsObj.graphic_file_mob
          ? `${cargraphicsObj.graphic_file_mob},${fileName}`
          : fileName;
        cargraphicsObj.graphic_file_mob_alt =
          cargraphicsObj.graphic_file_mob_alt
            ? `${cargraphicsObj.graphic_file_mob_alt},${car_graphics_images_mob[i].image_name}`
            : car_graphics_images_mob[i].image_name;
        await delay(1);
        filesUploadConfig.push({
          buffer: mobileImages[i].buffer,
          filename: `${path}/${fileName}`,
          contentType,
        });
      }
      await uploadFiles(filesUploadConfig);
    }

    if (videoFiles.length > 0) {
      const fileName = `${model_id}_${Date.now()}.${
        videoFiles[0].mimetype.split('/')[1]
      }`;
      cargraphicsObj.graphic_file = cargraphicsObj.graphic_file
        ? `${cargraphicsObj.graphic_file},${fileName}`
        : fileName;
      await uploadFiles([
        {
          buffer: videoFiles[0].buffer,
          filename: `${path}/${fileName}`,
          compress: false,
          contentType: videoFiles[0].mimetype,
        },
      ]);
    }
    return carGraphics.update(cargraphicsObj);
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

const toggleStatus = async (uuid) => {
  const carGraphics = await CarGraphics.findOne({ where: { uuid } });
  carGraphics.status = !carGraphics.status;
  return carGraphics.save();
};

const deleteCarGraphics = async (uuid) => {
  const carGraphics = await CarGraphics.findOne({ where: { uuid } });
  const graphicType = await CarGraphicType.findOne({
    where: { gt_id: carGraphics.gt_id },
    attributes: ['gt_name'],
  });
  await deleteObjects(
    `car_graphics/${carGraphics.model_id}`,
    `${graphicType.gt_name.toLowerCase().replace(/\s+/g, '_')}`
  );
  return CarGraphics.destroy({ where: { uuid } });
};

// <-------------------------------- import module ----------------------------------------->

const bulkCreateCarGraphicsImage = async (user, rows) => {
  try {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const brand_id = await brandService.getBrandIdByName(
        row[carGraphicsImageCols.BRAND_NAME]
      );
      const model_id = await carModelService.getCarModelIdByName(
        row[carGraphicsImageCols.MODEL_NAME]
      );
      const gt_id = await carGraphicsTypeService.getCartGraphicsTypeIdByName(
        row[carGraphicsImageCols.IMAGES_TYPE]
      );
      const car_graphics_images =
        row[carGraphicsImageCols.CAR_IMAGES_ALT]?.split(',');
      const car_graphics_images_mob =
        row[carGraphicsImageCols.CAR_IMAGES_MOBILE_ALT]?.split(',');
      const images = row[carGraphicsImageCols.CAR_IMAGES]?.split(',');
      const imagesMob = row[carGraphicsImageCols.CAR_IMAGES_MOBILE]?.split(',');

      if (
        car_graphics_images.length !== car_graphics_images_mob.length ||
        car_graphics_images_mob.length !== images.length ||
        images.length !== imagesMob.length
      ) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Image data length mismatched'
        );
      }
      const body = {
        brand_id,
        model_id,
        gt_id,
        car_graphics_images,
        car_graphics_images_mob,
        status: 'on',
      };
      const files = [];
      for (let j = 0; j < images.length; j++) {
        const imageFileResponse = await axios.get(images[i], {
          responseType: 'arraybuffer',
        });
        const imageFileMobResponse = await axios.get(imagesMob[i], {
          responseType: 'arraybuffer',
        });
        files.push(
          {
            fieldname: 'car_graphics_images',
            buffer: Buffer.from(imageFileResponse.data),
          },
          {
            fieldname: 'car_graphics_images_mob',
            buffer: Buffer.from(imageFileMobResponse.data),
          }
        );
      }
      await createCarGraphics(body, files, user);
    }
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

const bulkCreateCarGraphicsVideo = async (user, rows) => {
  try {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const brand_id = await brandService.getBrandIdByName(
        row[carGraphicsImageCols.BRAND_NAME]
      );
      if (!brand_id) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Brand not found');
      }
      const model_id = await carModelService.getCarModelIdByName(
        row[carGraphicsImageCols.MODEL_NAME]
      );
      if (!model_id) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Model not found');
      }
      const gt_id = await carGraphicsTypeService.getCartGraphicsTypeIdByName(
        'Video'
      );
      const videos = row[carGraphicsVideoCols.CAR_VIDEOS]?.split(',');

      const body = {
        brand_id,
        model_id,
        gt_id,
        status: 'on',
      };
      const files = [];
      for (let j = 0; j < videos.length; j++) {
        const videoFileResponse = await axios.get(videos[i], {
          responseType: 'arraybuffer',
        });
        files.push({
          fieldname: 'car_graphics_video',
          buffer: Buffer.from(videoFileResponse.data),
          mimetype: 'video/mp4',
        });
      }
      await createCarGraphics(body, files, user);
    }
  } catch (error) {
    throw error;
  }
};

// <-------------------------------- import module ----------------------------------------->

module.exports = {
  getModelsByBrand,
  createCarGraphics,
  queryCarGraphics,
  getCarGraphicsByUuid,
  updateCarGraphics,
  deleteCarGraphics,
  toggleStatus,
  bulkCreateCarGraphicsImage,
  bulkCreateCarGraphicsVideo,
};
