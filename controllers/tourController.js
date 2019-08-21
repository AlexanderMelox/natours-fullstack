const fs = require('fs');

// Parse the simple-tours JSON file synchronously
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
);

const checkID = (req, res, next, val) => {
  console.log('Tour id is:', val);
  const tour = tours.find(tour => tour.id === parseInt(req.params.id));
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  next();
};

const checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price'
    });
  }
  next();
};

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours
    }
  });
};

const getTour = (req, res) => {
  const tour = tours.find(tour => tour.id === parseInt(req.params.id));
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { ...req.body, id: newId };

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    error => {
      if (error) throw error;
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );
};

const updateTour = (req, res) => {
  const tourIndex = tours.findndex(tour => tour.id === parseInt(req.params.id));
  const tour = tours[tourIndex];
  const updatedTour = { ...tour, ...req.body };
  tours[tourIndex] = updatedTour;
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    error => {
      if (error) throw error;
      res.status(200).json({
        status: 'success',
        data: {
          updatedTour
        }
      });
    }
  );
};

const deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  });
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  checkID,
  checkBody
};
