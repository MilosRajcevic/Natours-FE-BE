const Tour = require('../models/tourModel');

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'Fail',
      message: 'Missing name or price',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  // res.status(200).json({
  //   status: 'success',
  //   results: tours.length,
  //   requestedAdt: req.requestTime,
  //   data: {
  //     tours,
  //   },
  // });
};

exports.getTour = (req, res) => {
  // const tour = tours.find((tour) => +req.params.id === tour.id);
  // res.status(200).json({
  //   status: 'success',
  //   data: { tour },
  // });
};

exports.createTour = (req, res) => {};

exports.updateTour = (req, res) => {
  // const updatedTour = { ...tour, duration: 20 };
  // res.status(200).json({
  //   status: 'success',
  //   data: { tour: updatedTour },
  // });
};

exports.deleteTour = (req, res) => {
  // const modifiedTours = tours.filter((tour) => +req.params.id !== tour.id);
};
