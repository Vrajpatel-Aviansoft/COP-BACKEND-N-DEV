const httpStatus = require('http-status');
const { brandService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const { readXlsxFromBuffer } = require('../utils/xlsxReader');
const { validateData } = require('../validations/imports/data-validator');
const {
  brandValidationRules,
} = require('../validations/imports/rules/brand-rules');
const { brandColumns } = require('../validations/imports/columns/brand-cols');

// <-------------------------------- import module ----------------------------------------->

const brandImportView = catchAsync(async (req, res) => {
  try {
    return res.render('pages/brand/import/create', {
      title: 'Brand Import',
      layout: './layouts/main',
      sidebarItems: req.sidebarItems,
      currentRoute: req.originalUrl,
    });
  } catch (error) {
    next(error);
  }
});

const brandImport = catchAsync(async (req, res, next) => {
  const file = req.file;
  const rows = readXlsxFromBuffer(file.buffer);
  const validationErrors = validateData(
    rows,
    brandValidationRules,
    brandColumns.BRAND_NAME
  );
  if (validationErrors.length > 0) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      errors: validationErrors,
    });
  }
  const brands = await brandService.bulkCreateBrands(req.user, rows);

  return res.json({
    success: true,
    data: brands,
  });
});

// <-------------------------------- import module ----------------------------------------->

const brandView = (req, res, next) => {
  return res.render('pages/brand/view', {
    title: 'Brand',
    layout: './layouts/main',
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
};

const brandCreateView = (req, res, next) => {
  return res.render('pages/brand/create', {
    title: 'Brand',
    layout: './layouts/main',
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
};

const editBrandView = catchAsync(async (req, res, next) => {
  const brand = await brandService.getBrandByUuid(req.params.uuid);
  return res.render('pages/brand/edit', {
    title: 'Brand',
    layout: './layouts/main',
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
    brand: brand.dataValues,
  });
});

const createBrand = catchAsync(async (req, res) => {
  await brandService.createBrand(req.user, req.body, req.files);
  return res
    .status(httpStatus.CREATED)
    .json({ message: 'Brand created successfully' });
});

const getBrands = catchAsync(async (req, res, next) => {
  try {
    const brands = await brandService.queryBrands(req.query);
    res.status(httpStatus.OK).send(brands);
  } catch (error) {
    console.error('Error in getBrands:', error);
    next(error);
  }
});

const toggleBrandStatus = catchAsync(async (req, res, next) => {
  const brand = await brandService.toggleBrandStatus(req.params.uuid);
  return res.status(httpStatus.OK).send(brand);
});

const updateBrand = catchAsync(async (req, res, next) => {
  const brand = await brandService.updateBrand(
    req.params.uuid,
    req.body,
    req.files
  );
  return res.status(httpStatus.OK).send(brand);
});

const deleteBrand = catchAsync(async (req, res, next) => {
  await brandService.deleteBrand(req.params.uuid);
  return res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  brandView,
  brandCreateView,
  createBrand,
  getBrands,
  toggleBrandStatus,
  deleteBrand,
  editBrandView,
  updateBrand,
  brandImport,
  brandImportView,
};
