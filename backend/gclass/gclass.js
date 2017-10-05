const request = require('request');
const axios = require('axios')

const gclass = axios.create({
  baseURL: 'https://classroom.googleapis.com/v1',
  timeout: 1000
})

module.exports.getCourses = function(profile) {
  return gclass.get('/courses', {
    headers: { authorization: 'Bearer ' + profile.access }
  })
}

module.exports.getCourseWork = function(profile) {
  return gclass.get(`/courses/${profile.courses[0]}/courseWork`, {
    headers: { authorization: 'Bearer ' + profile.access }
  })
}

module.exports.postCourseWork = function(profile, title, description, link) {
  console.log('postCourseWork running')
  let courseWork = {  
  'title': title,  
  'description': description,  
  'materials': [  
     {'link': { 'url': link }},  
  ],  
  'workType': 'ASSIGNMENT',  
  'state': 'PUBLISHED',  
  }
  console.log('courseWork', JSON.stringify(courseWork))
  console.log('profile.access', 'Bearer ' + profile.access)

  console.log('profile.courses[0]', profile.courses[0].id)
  console.log('url', `/courses/${profile.courses[0].id}/courseWork`)

  return gclass.post(`/courses/${profile.courses[0].id}/courseWork`, courseWork, {
    headers: {
      'authorization': 'Bearer ' + profile.access
    }
  })
  .then(results => {
    return results;
  })
  .catch(err => {
    console.log('hey at least we caught this err', err.Error)
    return err;
  })
}

//TESTING

// var exampleProfile = { 
//   id: '113023615147360761759',
//   courses: ['7975169558'],
//   access: process.env.EXAMPLE_ACCESS
// }

// var courseWorks = {  
//   'title': 'Ant colonies pt 4',  
//   'description': 'Read the article about ant colonies and complete the quiz.',  
//   'materials': [  
//      {'link': { 'url': 'http://example.com/ant-colonies' }},  
//      {'link': { 'url': 'http://example.com/ant-quiz' }}  
// ],  
//   'workType': 'ASSIGNMENT',  
//   'state': 'PUBLISHED',  
// }

// module.exports.postCourseWork(exampleProfile, courseWorks.title, courseWorks.description, courseWorks.materials[0].link.url)
// .then(results => {
//   console.log('success! results', results.data)
// })
// .catch(err => {
//   console.log('there was an error', err)
// })

// getAssignments(exampleProfile)
// .then(results => {
//   console.log('results', results.data)
// })
// .catch(err => {
//   console.log('there was an error', err)
// })


