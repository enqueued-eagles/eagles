const dotenv = require('dotenv').config()
const request = require('request');
const axios = require('axios')

const gclass = axios.create({
  baseURL: 'https://classroom.googleapis.com/v1',
  timeout: 5000
})

// HELPERS

const getFirstValidCourse = function(profile, courses, isForTeacher) {
  let courseToUse;

  for (let i = 0; i < courses.length && !courseToUse; i++) {
    let course = courses[i];

    // Only returns true if it is for teacher AND it matches OR if both are false (NOT XOR)

    if (!((course.ownerId === profile.id) ^ isForTeacher)) {
      console.log('found course to use!', course);
      courseToUse = course;
    }
  }

  console.log('courseToUse', courseToUse);
  return courseToUse
}

// API CALLS

module.exports.getCourses = function(profile) {
  return gclass.get('/courses', {
    headers: { authorization: 'Bearer ' + profile.access }
  });
}

module.exports.getCourseWork = function(profile, isForTeacher) {
  const courses = profile.courses;

  let courseToUse = getFirstValidCourse(profile, courses, isForTeacher);
  console.log('courseToUse', courseToUse)

  return gclass.get(`/courses/${courseToUse}/courseWork`, {
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

  return gclass.post(`/courses/${profile.courses[0].id}/courseWork`, courseWork, {
    headers: {
      'authorization': 'Bearer ' + profile.access
    }
  })
  // .then(results => {
  //   return results;
  // })
  // .catch(err => {
  //   console.log('hey at least we caught this err', err.Error)
  //   return err;
  // })
}

module.exports.getSubmissions = function(profile, courseWork) {
  var courses = profile.courses;
  var googleID = profile.id;
  var accessCode = profile.access;
  var courseWorkID = courseWork.id;
  var courseID = getFirstValidCourse(profile, courses, false).id;

  var url = `https://classroom.googleapis.com/v1/courses/${courseID}/courseWork/${courseWorkID}/studentSubmissions/`;
  var authorization = 'Bearer ' + profile.access;
  console.log('authorization', authorization);
  console.log('url', url);

  return gclass.get(url, {
    headers: {
      'authorization': authorization
    }
  })
  // .then(results => {
  //   console.log('results', results)
  //   return results;
  // })
  // .catch(err => {
  //   console.log('hey at least we caught this err', err.Error)
  //   return err;
  // })
}

module.exports.submitAssignment = function(profile, courseWorkID, submission) {
  var courses = profile.courses;
  var accessCode = profile.access;
  
  var courseID = getFirstValidCourse(profile, courses, false).id;
  var submissionID = submission.id;

  var url = `https://classroom.googleapis.com/v1/courses/${courseID}/courseWork/${courseWorkID}/studentSubmissions/${submissionID}:turnIn`;
  var authorization = 'Bearer ' + accessCode;
  console.log('authorization', authorization);
  console.log('url', url);

  var options = { method: 'POST',
  url: url,
  headers: 
   { 'postman-token': '2eaf6498-3465-5b05-75f5-5a25402ac7a9',
     'cache-control': 'no-cache',
     'content-type': 'application/json',
     authorization: authorization } };

  return new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      if (error) {
        reject(error)
      } else {
        resolve(body)
      }
    });
  })

  // return gclass.post(url, {
  //   headers: {
  //     'authorization': authorization,
  //     'content-type': 'application/json',
  //     'cache-control': 'no-cache'
  //   }
  // })
  // .catch(err => console.log('err', err))
}

// // TESTING

// var exampleProfile = { 
//   id: '113023615147360761759',
//   courses: [
//     {
//       "id": "7975169558",
//       "name": "Example",
//       "section": "2",
//       "descriptionHeading": "Example 2",
//       "ownerId": "113023615147360761759",
//       "creationTime": "2017-10-03T18:42:57.533Z",
//       "updateTime": "2017-10-03T18:42:56.591Z",
//       "enrollmentCode": "em74vj7",
//       "courseState": "ACTIVE",
//       "alternateLink": "http://classroom.google.com/c/Nzk3NTE2OTU1OFpa",
//       "teacherGroupEmail": "Example_2_teachers_0c89c763@classroom.google.com",
//       "courseGroupEmail": "Example_2_ec09148f@classroom.google.com",
//       "teacherFolder": {
//           "id": "0By1klvMUz8W2fnlCcklxMFNBNE1xOGV4YUtFRVJEanR3eDV6UnZGUFB5cmUtS0lJRTl3V1k",
//           "title": "Example 2",
//           "alternateLink": "https://drive.google.com/drive/folders/0By1klvMUz8W2fnlCcklxMFNBNE1xOGV4YUtFRVJEanR3eDV6UnZGUFB5cmUtS0lJRTl3V1k"
//       },
//       "guardiansEnabled": false,
//       "calendarId": "classroom111688772478550726892@group.calendar.google.com"
//     },
//     {
//       "id": "7991479107",
//       "name": "cactus",
//       "section": "cactus",
//       "descriptionHeading": "cactus cactus",
//       "ownerId": "113759565923940941388",
//       "creationTime": "2017-10-05T00:24:45.447Z",
//       "updateTime": "2017-10-05T00:24:44.391Z",
//       "enrollmentCode": "lxcjq",
//       "courseState": "ACTIVE",
//       "alternateLink": "http://classroom.google.com/c/Nzk5MTQ3OTEwN1pa",
//       "teacherGroupEmail": "cactus_cactus_teachers_b68dd61c@classroom.google.com",
//       "courseGroupEmail": "cactus_cactus_0f0615c6@classroom.google.com",
//       "guardiansEnabled": false,
//       "calendarId": "classroom109631009975707105705@group.calendar.google.com"
//     }
//   ],
//   access: process.env.EXAMPLE_ACCESS
// }

// // var exampleCoursework = {
// //   "courseId": "7975169558",
// //   "id": "8016138630",
// //   "title": "CM<BVDXKVBDSLKVB<CVB<BD<>VB><ZBVZSLK",
// //   "description": "cactus",
// //   "materials": [
// //       {
// //           "link": {
// //               "url": "http://127.0.0.1:3000/lesson/59d7c5fa5db29f1d684267f4",
// //               "thumbnailUrl": "https://www.google.com/webpagethumbnail?c=73&s=105:70&f=0&d=http://127.0.0.1:3000/lesson/59d7c5fa5db29f1d684267f4&a=AIYkKU--q6V03taxOkmEbkvfqueJJFM1Xw"
// //           }
// //       }
// //   ],
// //   "state": "PUBLISHED",
// //   "alternateLink": "http://classroom.google.com/c/Nzk3NTE2OTU1OFpa/a/ODAxNjEzODYzMFpa/details",
// //   "creationTime": "2017-10-06T18:18:57.869Z",
// //   "updateTime": "2017-10-06T18:18:57.848Z",
// //   "workType": "ASSIGNMENT",
// //   "submissionModificationMode": "MODIFIABLE_UNTIL_TURNED_IN",
// //   "assigneeMode": "ALL_STUDENTS",
// //   "creatorUserId": "113023615147360761759"
// // }

// var exampleCourseWorkCraig = {
//   "courseId": "7991479107",
//   "id": "8005561209",
//   "title": "WGLHEWOIGWEGHLKHGD><XHV<>X<>X",
//   "description": "ewithetoiewthweioghew",
//   "materials": [
//       {
//           "link": {
//               "url": "http://127.0.0.1:3000/lesson/59d6429e5514481d247ac1cf",
//               "thumbnailUrl": "https://www.google.com/webpagethumbnail?c=73&s=105:70&f=0&d=http://127.0.0.1:3000/lesson/59d6429e5514481d247ac1cf&a=AIYkKU_AjM0aAH_6-J_oAWjd7O5gulzaXA"
//           }
//       }
//   ],
//   "state": "PUBLISHED",
//   "alternateLink": "http://classroom.google.com/c/Nzk5MTQ3OTEwN1pa/a/ODAwNTU2MTIwOVpa/details",
//   "creationTime": "2017-10-06T00:18:57.217Z",
//   "updateTime": "2017-10-06T00:18:57.195Z",
//   "workType": "ASSIGNMENT",
//   "submissionModificationMode": "MODIFIABLE_UNTIL_TURNED_IN",
//   "associatedWithDeveloper": true,
//   "creatorUserId": "113759565923940941388"
// }

// var exampleSubmission = {
//     "courseId": "7991479107",
//     "courseWorkId": "8005561209",
//     "id": "CgwIxeih3AgQ-das6R0",
//     "userId": "113023615147360761759",
//     "creationTime": "2017-10-07T00:08:09.841Z",
//     "updateTime": "2017-10-07T00:20:27.615Z",
//     "state": "RECLAIMED_BY_STUDENT",
//     "alternateLink": "http://classroom.google.com/c/Nzk5MTQ3OTEwN1pa/a/ODAwNTU2MTIwOVpa/submissions/student/MjM0MDk3NTY4NVpa",
//     "courseWorkType": "ASSIGNMENT",
//     "assignmentSubmission": {},
//     "associatedWithDeveloper": true
// }

// module.exports.markComplete(exampleProfile, exampleCourseWorkCraig, exampleSubmission)

// console.log('this is about to run')

// module.exports.getSubmissions(exampleProfile, exampleCoursework);


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



