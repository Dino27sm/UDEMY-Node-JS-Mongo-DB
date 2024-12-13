const express = require('express');
//
//===========================================================
//
const router = express.Router();
const tourControler = require('./../controllers/tourController.js');

router.route('/').get(tourControler.getAllTours).post(tourControler.createTour);
router
  .route('/:id')
  .get(tourControler.getTour)
  .patch(tourControler.updateTour)
  .delete(tourControler.deleteTour);

module.exports = router;
