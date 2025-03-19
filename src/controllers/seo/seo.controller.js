const httpStatus = require("http-status");
const {
  brandService,
  carModelService,
  variantService,
  seoService,
} = require("../../services");
const catchAsync = require("../../utils/catchAsync");
const {
  Brand,
  CarModel,
  Variant,
  SeoPage,
  SeoMetaTag,
} = require("../../db/models");

const seoCreateView = async (req, res, next) => {
  const brands = await brandService.getBrands();
  const pages = await SeoPage.findAll();
  const metaTags = await SeoMetaTag.findAll();

  return res.render("pages/seo/seo/create", {
    title: "Seo",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
    brands,
    pages,
    metaTags,
  });
};

// Controller to fetch SEO data based on the tab value
const getSeoData = catchAsync(async (req, res) => {
  const seo = await seoService.querySeoData(req.query);

  return res.status(httpStatus.OK).send(seo);
});

const getModelsByBrand = catchAsync(async (req, res) => {
  const { uuid } = req.params;
  const models = await seoService.getModelsByBrand(uuid);

  if (models.length > 0) {
    return res.status(httpStatus.OK).json({ success: true, models });
  } else {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: "No models found for the selected brand",
    });
  }
});

const getVariantsByModel = catchAsync(async (req, res) => {
  const { uuid } = req.params;
  const variants = await seoService.getVariantsByModel(uuid);

  if (variants.length > 0) {
    return res.status(httpStatus.OK).json({ success: true, variants });
  } else {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: "No variants found for the selected model",
    });
  }
});

const getSeoDataByUuid = catchAsync(async (req, res) => {
  const { uuid } = req.params;
  const seoData = await seoService.getSeoDataByUuid(uuid);

  if (seoData.length > 0) {
    return res.status(httpStatus.OK).json({ success: true, seoData });
  } else {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: "No variants found for the selected model",
    });
  }
});

const createSeo = async (req, res, next) => {
  const seo = await seoService.createSeo(req.user, req.body);
  return res.status(httpStatus.CREATED).send(seo);
};

const deleteSeo = catchAsync(async (req, res, next) => {
  await seoService.deleteSeo(req.params.uuid);
  return res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  seoCreateView,
  getSeoData,
  getModelsByBrand,
  getVariantsByModel,
  getSeoDataByUuid,
  createSeo,
  deleteSeo,
};
