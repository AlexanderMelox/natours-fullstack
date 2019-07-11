const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);

const getAllTours = (req, res) => {
  return res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
};

const getTour = (req, res) => {
  const tour = tours.find(tour => tour.id === parseInt(req.params.id));
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }

  return res.status(200).json({
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
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    error => {
      if (error) throw error;
      return res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );
};

const updateTour = (req, res) => {
  const tourIndex = tours.findIndex(
    tour => tour.id === parseInt(req.params.id)
  );
  const tour = tours[tourIndex];
  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Tour not found' });
  }
  const updatedTour = { ...tour, ...req.body };
  tours[tourIndex] = updatedTour;
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    error => {
      if (error) throw error;
      return res.status(200).json({
        status: 'success',
        data: {
          updatedTour
        }
      });
    }
  );
};

const deleteTour = (req, res) => {
  const tourIndex = tours.findIndex(
    tour => tour.id === parseInt(req.params.id)
  );
  const tour = tours[tourIndex];
  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Tour not found' });
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
};

app
  .route('/api/tours')
  .get(getAllTours)
  .post(createTour);

app
  .route('/api/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port http://localhost:${port}`);
});
