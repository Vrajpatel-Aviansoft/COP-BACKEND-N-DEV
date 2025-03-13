const httpStatus = require('http-status');
const { specificationService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const { SpecificationCategory } = require('../db/models');

const specificationView = (req, res, next) => {
  return res.render('pages/specification/view', {
    title: 'Specification',
    layout: './layouts/main',
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
};

const specificationCreateView = async (req, res, next) => {
  const specCategories = await SpecificationCategory.findAll();
  return res.render('pages/specification/create', {
    title: 'Specification',
    layout: './layouts/main',
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
    specCategories,
  });
};

const editSpecificationView = catchAsync(async (req, res, next) => {
  const specCategories = await SpecificationCategory.findAll();
  const specifications = await specificationService.getSpecByUuid(
    req.params.uuid
  );

  return res.render('pages/specification/edit', {
    title: 'specification',
    layout: './layouts/main',
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
    specifications: specifications.dataValues,
    specCategories,
  });
});

const createSpecification = async (req, res, next) => {
  const spec = await specificationService.createSpecification(
    req.user,
    req.body,
    req.files
  );
  return res.status(httpStatus.CREATED).send(spec);
};

const getSpecs = catchAsync(async (req, res, next) => {
  try {
    const specs = await specificationService.querySpecs(req.query);
    res.status(httpStatus.OK).send(specs);
  } catch (error) {
    console.error('Error in getBrands:', error);
    next(error);
  }
});

const toggleSpecificationStatus = catchAsync(async (req, res, next) => {
  const specification = await specificationService.toggleSpecificationStatus(
    req.params.uuid
  );
  return res.status(httpStatus.OK).send(specification);
});

const updateSpecification = catchAsync(async (req, res, next) => {
  const specification = await specificationService.updateSpecification(
    req.params.uuid,
    req.body,
    req.files
  );
  return res.status(httpStatus.OK).send(specification);
});

const deleteSpecification = catchAsync(async (req, res, next) => {
  await specificationService.deleteSpecification(req.params.uuid);
  return res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  specificationView,
  specificationCreateView,
  createSpecification,
  getSpecs,
  toggleSpecificationStatus,
  deleteSpecification,
  editSpecificationView,
  updateSpecification,
};
