const express = require('express');
const nodemailer = require('nodemailer');
const schema = require('../db/schema.js');
const router = express.Router();
const mongoose = require('mongoose');
var User = schema.User;
var Lesson = schema.Lesson;
var Slide = schema.Slide;

const shouldEmail = (likes) => {
  return true;
  // let goal = 10;
  // while(goal <= likes) {
  //   goal *= 2;
  // }
  // if(goal === likes) return true;
  // return false;
}

const sendCongad = (userRef, lessonName, numLikes) => {
  // create reusable transporter object using the default SMTP transport
  User.find({ _id : userRef })
  .then((user) => {
    user = user[0];
    if (user.email) {
        console.log('sending email to ', user.email);
        var smtpTransport = nodemailer.createTransport({
          service: "Gmail",
          auth: {
              user: "learningwithlessons@gmail.com",
              pass: "test123test"
            }
          });

        let mailOptions ={
            from: "Learning with Lessons", // sender address
            to: user.email, // list of receivers
            subject: "Congratulations!", // Subject line
            text: `Your lesson named ${lessonName} just reached ${numLikes} likes!`, // plaintext body
            html: `<p>Your lesson named ${lessonName} just reached ${numLikes} likes!<p>` // html body
        }

        smtpTransport.sendMail(mailOptions, function(error, response){
          if(error){
              console.log(error);
          }else{
              res.redirect('/');
          }
      });
    }
  })
  .catch((err) => {
    console.log('Error sending email: ', err);
  })
}

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
    slides: slides ,
    likes: 0,
    userLikes: [],
    preReqLessons: []
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
    })
    return result;
  })
  .then(result => {
    res.send(result);
  })
  .catch(function(err) {
    console.log('Error at endpoint /lessons type POST: ', err);
    res.send('Error');
  })
})

router.put('/lessons', function(req, res) {
  console.log('req.body:', req.body);
  Lesson.findById(req.body.lessonId, function(err, lesson) {
    //console.log('lesson is ', lesson, 'err is ', err)
    // console.log('Lesson is ', Lesson, lesson.keywords)
    if (err) res.send(err);

    if (req.body.name) lesson.name = req.body.name;
    if (req.body.userRef) lesson.userRef = req.body.userRef;
    if (req.body.description) lesson.description = req.body.description;
    if (req.body.slides) lesson.slides = req.body.slides;
    if (req.body.keywords) lesson.keywords = req.body.keywords;
    if (req.body.preReqLessons) lesson.preReqLessons = req.body.preReqLessons;
    if (req.body.fromLike) { // Therefore likes will not be added on put requests not from lesson.js
      if (lesson.userLikes.length !== 0) {
        if (lesson.userLikes.indexOf(req.session.username) === -1) {
          lesson.userLikes.push(req.session.username);
          if (req.body.likes) lesson.likes = req.body.likes; // If they've liked it, good.
          if(shouldEmail(lesson.userLikes.length)) sendCongad(lesson.userRef, lesson.name, lesson.userLikes.length);
        }
      } else {
        lesson.userLikes.push(req.session.username);
         if (req.body.likes) lesson.likes = req.body.likes
      }
    }
    // console.log('lesson.keywords',lesson.keywords, req.body.keywords)
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

router.delete('/lessons/:lessonId', function(req, res) {
  Lesson.findByIdAndRemove(req.params.lessonId, function(err, lesson) {
    if (err) {
      throw err;
      return;
    };

    res.send(lesson);
  });
});

module.exports = router;