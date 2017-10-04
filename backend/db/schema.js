/*
Schemas for each part. 
user,tutorial,lesson,slide
//don't mind the {type:String, required: true} it could just be String

stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
*/



const mongoose = require(`mongoose`);
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  lessons: [String],
  favorites: [String],
  email: String,
  githubURL: String,
  emailPublic: String,
  emailLikeGoal: Number,
  avatarURL: String,
  fullName: String,
  location: String,
  website: String
});
var User = mongoose.model('User', userSchema);

//////////////////

var lessonSchema = new Schema({
  name: {type: String, required: true},
  userRef: String,
  description: String,
  keywords: [String],
  slides: [],
  likes: Number,
  userLikes: [String],
  preReqLessons: [String]
});
var Lesson = mongoose.model('Lesson', lessonSchema);

//////////////////

let slideSchema = new Schema({
  name: String,
  lessonRef: String,
  youTubeUrl: String,
  text: String,
  quizUrl: String,
  youTubeThumbnailUrl: String,
  youTubeTags: [String]
});
let Slide = mongoose.model('Slide', slideSchema);

module.exports = {
  User: User,
  Lesson: Lesson,
  Slide: Slide
}