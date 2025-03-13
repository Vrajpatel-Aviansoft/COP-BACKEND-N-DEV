const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { WarningLight } = require('../db/models');
const { uploadFiles } = require('../utils/fileUpload');
const {
  buildQueryOptions,
  formatQueryResult,
} = require('../utils/queryHelper');
const { deleteObjects } = require('../config/minio');

const createWarningLight = async (body, files, user) => {
  try {
    const wlIconFile = files.find(
      (file) => file.fieldname === 'warning_light_icon'
    );
    const wlVideoFile = files.find(
      (file) => file.fieldname === 'warning_light_video'
    );

    const subHeadings = JSON.stringify(
      body.subheadings.map((item) => item.heading)
    );
    const info = JSON.stringify(body.subheadings.map((item) => item.info));

    const warningLight = await WarningLight.create({
      wl_name: body.wl_name,
      wl_heading: body.wl_heading,
      status: body.status === 'on',
      wl_subheading: subHeadings,
      wl_info: info,
      created_by: user.id,
      wl_display_position: body.wl_display_position,
    });

    const path = '/warning_light';
    if (wlIconFile) {
      await uploadFiles([
        {
          filename: `${path}/${warningLight.wl_id}/${warningLight.wl_id}.svg`,
          buffer: wlIconFile.buffer,
          compress: false,
          contentType: wlIconFile.mimetype,
        },
      ]);
    }
    if (wlVideoFile) {
      await uploadFiles([
        {
          filename: `${path}/${warningLight.wl_id}/${warningLight.wl_id}.mp4`,
          buffer: wlVideoFile.buffer,
          compress: false,
          contentType: wlVideoFile.mimetype,
        },
      ]);
    }
    warningLight.wl_icon = `${warningLight.wl_id}.svg`;
    warningLight.wl_video = `${warningLight.wl_id}.mp4`;
    await warningLight.save();
    return warningLight;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

const queryWarningLights = async (query) => {
  try {
    const queryOptions = buildQueryOptions(query);
    const carWarningLights = await WarningLight.findAndCountAll(queryOptions);
    return formatQueryResult(carWarningLights, query);
  } catch (error) {
    console.error('Error in queryCarWarningLights:', error);
    throw error;
  }
};

const getWarningLightByUuid = async (uuid, options = {}) => {
  return WarningLight.findOne({
    where: { uuid },
    ...options,
  });
};

const updateWarningLight = async (uuid, body, files, user) => {
  try {
    const warningLight = await getWarningLightByUuid(uuid);
    const wlIconFile = files.find(
      (file) => file.fieldname === 'warning_light_icon'
    );
    const wlVideoFile = files.find(
      (file) => file.fieldname === 'warning_light_video'
    );

    const subHeadings = [];
    const info = [];

    if (body.subheadings) {
      for (let i = 0; i < body.subheadings.length; i++) {
        if (body.subheadings[i]) {
          if (body.subheadings[i].heading) {
            subHeadings.push(body.subheadings[i].heading);
          }
          if (body.subheadings[i].info) {
            info.push(body.subheadings[i].info);
          } else {
            info.push([]);
          }
        }
      }
    }

    const path = '/warning_light';

    if (wlIconFile) {
      await uploadFiles([
        {
          filename: `${path}/${warningLight.wl_id}/${warningLight.wl_id}.svg`,
          buffer: wlIconFile.buffer,
          compress: false,
          contentType: wlIconFile.mimetype,
        },
      ]);
    }
    if (wlVideoFile) {
      await uploadFiles([
        {
          filename: `${path}/${warningLight.wl_id}/${warningLight.wl_id}.mp4`,
          buffer: wlVideoFile.buffer,
          compress: false,
          contentType: wlVideoFile.mimetype,
        },
      ]);
    }
    warningLight.set({
      wl_name: body.wl_name,
      wl_heading: body.wl_heading,
      status: body.status === 'on',
      wl_subheading: JSON.stringify(subHeadings),
      wl_info: JSON.stringify(info),
      updated_by: user.id,
      wl_display_position: body.wl_display_position,
    });
    await warningLight.save();
    return warningLight;
  } catch (error) {
    console.error('Error in updateWarningLight:', error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

const toggleStatus = async (uuid) => {
  const warningLight = await WarningLight.findOne({ where: { uuid } });
  warningLight.wl_status = !warningLight.wl_status;
  return warningLight.save();
};

const deleteWarningLight = async (uuid) => {
  const warningLight = await WarningLight.findOne({ where: { uuid } });
  await deleteObjects(`warning-light`, `${warningLight.wl_id}`);
  return WarningLight.destroy({ where: { uuid } });
};

module.exports = {
  createWarningLight,
  getWarningLightByUuid,
  updateWarningLight,
  deleteWarningLight,
  toggleStatus,
  queryWarningLights,
};
