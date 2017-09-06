const app = require('express').Router();
const db = require('../db');
const { Day, Hotel, Restaurant, Activity, Place } = db.models;

app.get('/', (req, res, next) => {
  return Day.findAll({
    order: ['id'],
    include: [
      { model: Hotel, include: [Place] },
      { model: Restaurant, include: [Place] },
      { model: Activity, include: [Place] }
    ]
  })
    .then(days => {
      res.send(days);
    })
    .catch(next);
});

app.post('/', (req, res, next) => {
  return Day.create({})
    .then(day => {
      res.send(day);
    });
});

app.delete('/:id', (req, res, next) => {
  //TODO - implement
  console.log('delete = ', req.params.id);
  return Day.destroy({ where: { id: req.params.id } })
    .then(() => {
      res.end();
    })
});

//TO DO - total of six routes, add and remove hotels, restaurants, activities for a day

// restaurants
app.post('/:dayId/restaurants/:id', (req, res, next) => {
  console.log('post dayId = ', req.params.dayId);
  console.log('post id = ', req.params.id);
  return Promise.all([
    Day.findById(req.params.dayId),
    Restaurant.findById(req.params.id, { include: [{ all: true }] })
  ])
    .then(([day, restaurant]) => {
      console.log(restaurant);
      res.send(restaurant);
      return day.addRestaurants(restaurant);
    })
});

app.delete('/:dayId/restaurants/:id', (req, res, next) => {
  // console.log('getting to delete restaurants!');
  return Promise.all([
    Day.findById(req.params.dayId),
    Restaurant.findById(req.params.id)
  ])
    .then(([day, restaurant]) => {
      res.send();
      return day.removeRestaurants(restaurant);
    })
    .catch(err => {
      console.log(err);
    })
});

// hotels
app.post('/:dayId/hotels/:id', (req, res, next) => {
  console.log('post dayId = ', req.params.dayId);
  console.log('post id = ', req.params.id);
  return Promise.all([
    Day.findById(req.params.dayId),
    Hotel.findById(req.params.id, { include: [{ all: true }] })
  ])
    .then(([day, hotel]) => {
      res.send(hotel);
      return day.addHotels(hotel);
    })
  // .then( () => {
  //   return res.redirect('/');
  // })
});

app.delete('/:dayId/hotels/:id', (req, res, next) => {
  // console.log('getting to delete restaurants!');
  return Promise.all([
    Day.findById(req.params.dayId),
    Hotel.findById(req.params.id)
  ])
    .then(([day, hotel]) => {
      day.removeHotels(hotel);
      res.send({
        day: day,
        place: hotel
      })
    })
    .catch(err => {
      console.log(err);
    })
});

// activities
app.post('/:dayId/activities/:id', (req, res, next) => {
  console.log('post dayId = ', req.params.dayId);
  console.log('post id = ', req.params.id);
  return Promise.all([
    Day.findById(req.params.dayId),
    Activity.findById(req.params.id, { include: [{ all: true }] })
  ])
    .then(([day, activity]) => {
      res.send(activity);
      return day.addActivities(activity);
    })
});

app.delete('/:dayId/activities/:id', (req, res, next) => {
  // console.log('getting to delete restaurants!');
  return Promise.all([
    Day.findById(req.params.dayId),
    Activity.findById(req.params.id)
  ])
    .then(([day, activity]) => {
      res.send();
      return day.removeActivity(activity);
    })
    .catch(err => {
      console.log(err);
    })
});

module.exports = app;
