const express = require('express');
const tourControler = require('./../controllers/tourController.js');
//
//===========================================================
//
const router = express.Router();

router.param('id', tourControler.checkID);

router.route('/').get(tourControler.getAllTours).post(tourControler.createTour);
router
  .route('/:id')
  .get(tourControler.getTour)
  .patch(tourControler.updateTour)
  .delete(tourControler.deleteTour);

module.exports = router;
