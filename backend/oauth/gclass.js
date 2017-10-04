const request = require('request');
const axios = require('axios')

const gclass = axios.create({
  baseURL: 'https://classroom.googleapis.com/v1',
  timeout: 1000
})

const getClasses = function(profile) {
  return gclass.get('/courses', {
    headers: { authorization: 'Bearer ' + profile.access }
  })
}

const getAssignments = function(profile) {
  return gclass.get(`/courses/${profile.courses[0]}/courseWork`, {
    headers: { authorization: 'Bearer ' + profile.access }
  })
}

// TESTING

// var exampleProfile = { 
//   id: '113023615147360761759',
//   courses: ['7975169558'],
//   access: process.env.EXAMPLE_ACCESS
// }

// getAssignments(exampleProfile)
// .then(results => {
//   console.log('results', results.data)
// })
// .catch(err => {
//   console.log('there was an error', err)
// })


