/*
router for coordinating get and post request when server recieves said request.
three schemas for each request
tutorial,lesson,slide
format guide
tut {name:  , lessons: [[]]}  //array of arrays
lesson {name: string, slides: [{}]} //array of object
slide {name:, value:}  //object
*/
const express = require('express');
const schema = require('./schema.js');
const axios = require('axios');
const router = express.Router();

const dotenv = require('dotenv').config({path: '../.env'})
const mongoose = require('mongoose');
var User = schema.User;
var Lesson = schema.Lesson;
var Slide = schema.Slide;

router.use(function(req, res, next) {
    //console.log('new log from router.use', req.method, req.body);// log each request to the console
    next(); // continue doing what we were doing and go to the route
});

router.get('/query', function(req, res) {
  // console.log('sending request with query string')
  axios({
    method: 'get', 
    url: 'https://www.googleapis.com/youtube/v3/videos',
    params: {
      id: req.query.string,
      part: 'snippet,contentDetails,statistics',
      key: dotenv.parsed.ourKey
    }
  })
  .then((response) => {
    res.send(response.data.items);
  })
  .catch((err) => {
    console.log('Youtube API get request error', err);
  })
})

router.get('/',function(req, res) {
  res.end('router get worked');
});

//find specific user
router.get('/users/:userId', function(req, res) {
  User.find({_id: req.params.userId})
  .then(function(users) { 
    res.send(users);
  })
  .catch(function(err) {
    res.send(err);
  })
})

//find all users
router.get('/users', function(req, res) {
  User.find({})
  .then(function(users) { 
    res.send(users);
  })
  .catch(function(err) {
    res.send(err);
  })
})

//find specific lesson
router.get('/lesson/:lessonId', function(req, res) {
  Lesson.find({_id: req.params.lessonId})
  .then(function(lesson) {    
    return lesson[0];
  })
  .then((specificLesson) => {
    Slide.find({})
    .then((allSlides) => {
      specificLesson.slides = allSlides.filter((slide) => {
        if (specificLesson.slides.indexOf(slide._id) >= 0) {
          return slide;
        }
      });
      return specificLesson;
    })
    .then((lessonWithSlides) => {
      res.send(lessonWithSlides);
    })
  })
  .catch(function(err) {
    res.send(err);
  })
});
//find all lessons
router.get('/lessons', function(req, res) {
  Lesson.find({})
  .then(function(lessons) {
    res.send(lessons);
  })
  .catch(function(err) {
    res.send(err);
  })
});
//find specific slide using params
router.get('/slides/:slideId', function(req, res) {
  Slide.find({_id: req.params.slideId})
  .then(function(slides) {
    res.send(slides);
  })
  .catch(function(err) {
    throw err;
    return;
  })
});


//find all slides
router.get('/slides', function(req, res) {
  Slide.find({})
  .then(function(slides) {
    res.send(slides);
  })
  .catch(function(err) {
    throw err;
    return;
  })
});

// router.post('/login', function(req, res) {
//   res.send({loggedIn: true});
// });

// router.post('/users', function(req, res) {
//   var username = req.body.username;
//   var password = req.body.password;
//   var lessons = req.body.lessons || [];
//   var favorites = req.body.favorites || [];
//   var createdLessons = req.body.createdLessons || [];
//   User.create({
//   username: username, 
//   password: password,
//   lessons: lessons, 
//   favorites: favorites, 
//   createdLessons: createdLessons
//   })
//   .then(function(result) {
//     res.send(result);
//   })
//   .catch(function(err) {
//     res.send(err);
//   })
// })

router.post('/lessons', function(req, res) {
  var name = req.body.name;
  var userRef = req.body.userRef
  var description = req.body.description;
  var keywords = req.body.keywords;
  var slides = req.body.slides || [];
  Lesson.create({ 
    name: name, 
    userRef: userRef, 
    description: description, 
    keywords: keywords,
    slides: slides 
  })
  .then(function(result) {
    User.findById(userRef, function(err, user) {
      //console.log('err',err,'user',user);
      if (err) {
        throw err;
        return;
      } else {
        user.lessons.push(result._id);
        user.save();
      }
      // if (err) res.send(err);
      // user.lessons.push(result._id);
      // user.save();
    })
    return result;
  })
  .then(result => {
    res.send(result);
  })
  .catch(function(err) {
    res.send('Error at endpoint /lessons type POST: ', err);
  })
})

router.post('/slides', function(req, res) {
  var name = req.body.name;
  var lessonRef = req.body.lessonRef;
  var youTubeUrl = req.body.youTubeUrl;
  var text = req.body.text;
  var quizUrl = req.body.quizUrl;
  var youTubeThumbnailUrl = req.body.youTubeThumbnailUrl;
  var youTubeTags = req.body.youTubeTags;
  Slide.create({ 
    name: name,
    lessonRef: lessonRef,
    youTubeUrl: youTubeUrl, 
    text: text, 
    quizUrl: quizUrl,
    youTubeThumbnailUrl: youTubeThumbnailUrl,
    youTubeTags: youTubeTags
    })
  .then(function(result) {
    Lesson.findById(lessonRef, function(err, lesson) {
      if (err) {
        throw err;
        return;
      } else {
        lesson.slides.push(result._id)
        lesson.save();
      }
    })
    return result;
  })
  .then(result => {
    res.send(result);
  })
  .catch(function(err) {
    res.send(err);
  })
});

router.put('/users', function(req, res) {
  User.findById(req.query._id, function(err, user) {
    if (err) res.send(err);

    if (req.body.username) user.username = req.body.username;
    if (req.body.lessons) user.lessons = req.body.lessons;
    if (req.body.favorites) user.favorites = req.body.favorites;
    if (req.body.createdLessons) user.createdLessons = req.body.createdLessons;

    User.save(function (err) {
      if (err) {
        throw err;
        return;
      };
      res.send('user updated')
    })
  })
})

router.put('/lessons', function(req, res) {
  console.log('hello line239 router.js req is ', req.body);
  Lesson.findById(req.body.lessonid, function(err, lesson) {
    //console.log('lesson is ', lesson, 'err is ', err)
    console.log('Lesson is ', Lesson, lesson.keyWords)
    if (err) res.send(err);

    if (req.body.name) lesson.name = req.body.name;
    if (req.body.userRef) lesson.userRef = req.body.userRef;
    if (req.body.description) lesson.description = req.body.description;
    if (req.body.slides) lesson.slides = req.body.slides;
    if (req.body.keyWords) lesson.keyWords = req.body.keyWords;

    console.log('lesson.keyWords',lesson.keyWords, req.body.keyWords)
    lesson.save()
    .then(function (result) {
      res.send(result);
    })
    .catch(function(err) {
      console.log('line 271', err);
      throw err;
      return;
    })
  })
})

router.put('/slides', function(req, res) {
  Slide.findById(req.query._id, function(err, slide) {
    if (err) res.send(err);

    if (req.body.name) slide.name = req.body.name;
    if (req.body.lessonRef) slide.lessonRef = req.body.lessonRef;
    if (req.body.youTubeUrl) slide.youTuleUrl = req.body.youTubeUrl;
    if (req.body.text) slide.text = req.body.text;
    if (req.body.quizUrl) slide.quizUrl = req.body.quizUrl;
    if (req.body.youTubeThumbnailUrl) slide.youTubeThumbnailUrl = req.body.youTubeThumbnailUrl;
    if (req.body.youTubeTags) slide.youTubeTags = req.body.youTubeTags;

    Slide.save(function (err) {
      if (err) {
        throw err;
        return;
      }
      res.send('slide updated');
    })
  })
})

router.delete('/users', function(req, res) {
  User.findByIdAndRemove(req.query._id, function(err, user) {
    if (err) {
      throw err;
      return;
    };

    res.send(user._id + 'removed');
  })
})

router.delete('/lessons', function(req, res) {
  Lesson.findByIdAndRemove(req.query._id, function(err, lesson) {
    if (err) {
      throw err;
      return;
    };

    res.send(lesson._id + 'removed');
  })
})

router.delete('/slides', function(req, res) {
  Slide.findByIdAndRemove(req.query._id, function(err, slide) {
    if (err) {
      throw err;
      return;
    };

    res.send(slide._id + 'removed');
  })
})

module.exports = router;
