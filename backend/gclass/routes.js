const gclass = require('./gclass');

module.exports.addCourseWork = function(req, res) {
  console.log('req.body', req.body)
  let profile = req.user || req.body.user;
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
