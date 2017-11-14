const gclass = require('./gclass');

// HELPERS

const getSubmissionsBasedOnRequest = function(profile, lessonID) {
  console.log('getSubmissions helper running')
   return gclass.getCourseWork(profile, false)
  .then(results => {
    var courseWorks = results.data.courseWork;

    var courseWork = courseWorks.find((work) => {
      var url = work.materials[0].link.url
      var urlParts = url.split('/');
      var foundLessonID = urlParts[urlParts.length - 1]
      return foundLessonID = lessonID;
    })

    return gclass.getSubmissions(profile, courseWork)
  })
}

// SIMPLE ROUTES

module.exports.addCourseWork = function(req, res) {
  console.log('addcoursework running')
  let profile = req.user || req.session.user || req.body.user;
  let title = req.body.title;
  let description = req.body.description;
  let link = req.body.link;

  gclass.postCourseWork(profile, title, description, link)
  .then((results) => {
    res.status(201).send(results.data);
  })
  .catch((err) => {
    res.status(400).send(err);
  })
}

module.exports.getCourseWork = function(req, res, isForTeacher) {
  let profile = req.user;
  gclass.getCourseWork(profile, isForTeacher)
  .then((results) => {
    res.status(201).send(results.data);
  })
  .catch((err) => {
    console.log('err caught', err);
    res.status(400).send(err);
  })
}

// COUMPOUND ROUTES

module.exports.getSubmissionsAsStudent = function(req, res) {
  var lessonID = req.params.lessonId;
  var profile = req.user;

  return getSubmissionsBasedOnRequest(profile, lessonID)
  .then(results => {
    res.status(200).send(results.data)
  })
  .catch(err => {
    console.log('err caught', err);
    res.status(400).send(err);
  });
}

module.exports.submitAssignment = function(req, res) {
  console.log('submit assignment running')
  console.log('req.params from client. should contain lessonID:', req.params);
  var lessonID = req.params.lessonId;
  var profile = req.user;
  var profileID = req.user.id;

  return getSubmissionsBasedOnRequest(profile, lessonID)
  .then(results => {
    var submissions = results.data.studentSubmissions
    var submission = submissions.find((submission) => {
      return submission.userId = profileID;
    });
    var courseWorkID = submission.courseWorkId;

    gclass.submitAssignment(profile, courseWorkID, submission)
    .then(results => res.status(201).send('success!'))
    .catch(err => res.status(400).send(err))
  })
}



// TESTING 

// var example = {
//   'user': { 
//   'id': '113023615147360761759',
//   'courses': ['7975169558'],
//   'access': process.env.EXAMPLE_ACCESS
//   },
//   'title': 'this is a lesson',
//   'description': 'a real lesson',
//   'link': 'http://www.example.com'
// }
