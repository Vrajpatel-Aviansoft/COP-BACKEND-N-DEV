const httpStatus = require("http-status");
const { rtoService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");
const { State } = require("../../db/models");

const rtoView = (req,res)=>{
  return res.render("pages/rto/view", {
    title: "Rto View",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
}

const rtoCreateView = async (req, res, next) => {

  const states = await State.findAll();

  return res.render("pages/rto/create", {
    title: "Rto View",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
    states,
  });
};

const editRtoView = catchAsync(async (req, res, next) => {

  const states = await State.findAll();
  const rto = await rtoService.getRtoByUuid(
    req.params.uuid
  );

  return res.render("pages/rto/edit", {
    title: "Rto",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
    rto: rto.dataValues,
    states,
  });
});

const createRto = async (req, res, next) => {
  const rtos = await rtoService.createRto(
    req.user,
    req.body
  );
  return res.status(httpStatus.CREATED).send(rtos);
};

const getRto = catchAsync(async (req, res, next) => {
  try {
    const rtos = await rtoService.queryRto(req.query);
    res.status(httpStatus.OK).send(rtos);
  } catch (error) {
    console.error("Error in getRtos:", error);
    next(error);
  }
});

// const toggleDealerShipStatus = catchAsync(async (req, res, next) => {
//   const dealerShip = await rtoService.toggleDealerShipStatus(
//     req.params.uuid
//   );
//   return res.status(httpStatus.OK).send(dealerShip);
// });

const updateRto = catchAsync(async (req, res, next) => {
  const rtos = await rtoService.updateRto(
    req.params.uuid,
    req.body
  );
  return res.status(httpStatus.OK).send(rtos);
});

const deleteRto = catchAsync(async (req, res, next) => {
  await rtoService.deleteRto(req.params.uuid);
  return res.status(httpStatus.NO_CONTENT).send();
});


module.exports = {
  rtoView,
  rtoCreateView,
  createRto,
  getRto,
  // toggleDealerShipStatus,
  deleteRto,
  editRtoView,
  updateRto,
}
