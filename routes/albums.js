var express = require('express');
var monk = require('../config/database');
var albumsCollection = monk.get('albums');
var router = express.Router();

// Index
router.get('/', function(req, res, next) {
  res.render('albums', { title: 'Express' });
});

// Show
router.get('/albums', function(req, res) {
  albumsCollection.find({}, function(err, data) {
    if(err) console.log(err);
    res.render('show', {albums: data});
  });
});

// Create
router.post('/albums', function(req, res) {
  albumsCollection.insert(req.body, function(err, data) {
    if(err) console.log(err);
    res.redirect('/albums');
  });
});

// New
router.get('/albums/new', function(req, res) {
  res.render('new');
});

// Edit
router.get('/albums/:id', function(req, res) {
  // console.log('params: ', req.params);
  albumsCollection.findOne({_id: req.params['id']}, function(err, data) {
    // console.log(data);
    if(err) console.log(err);
    res.render('album', {album: data});
  });
});

// Update
router.get('/albums/:id/edit', function(req, res) {
  console.log(req.params);
  albumsCollection.findOne({_id: req.params['id']}, function(err, data) {
    if(err) console.log(err);
    console.log(req.params);
    res.render('edit', {album: data});
  })
});

// The REAL Update
router.put('/albums/:id', function(req, res) {
  // console.log(req.params);
  albumsCollection.update({_id: req.params['id']}, {'$set': req.body}, function(err, data) {
    if(err) console.log(err);
    // console.log(req.params);
    res.redirect('/albums');
  })
});

// Delete
router.delete('/albums/:id', function(req, res){
  console.log('test');
  albumsCollection.remove({_id: req.params['id']}, function(err, data){
    res.redirect('/albums')
  });
});

module.exports = router;
