const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    unique: true,
    minlength: 3,
  },
  name: {
    type: String,
    require: true,
    minlength: 3,
  },
  passwordHash: {
    type: String,
    minlength: 8,
  },
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
});
userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();

    delete returnedObject._id;
    delete returnedObject.__v;

    delete returnedObject.passwordHash;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
