const gclass = require('./gclass');

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

module.exports.getCourseWork = function(req, res) {
  let profile = req.user;
  gclass.getCourseWork(profile)
  .then((results) => {
    res.status(201).send(results.data);
  })
  .catch((err) => {
    console.log('err caught', err);
    res.status(400).send(err);
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
