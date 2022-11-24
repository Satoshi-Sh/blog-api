const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    user_name: {type:String, required:true,maxLength:100,minLength:1,unique:true},
    password: {type:String, required:true, maxLength:100}}
    ,{toJSON:{virtuals:true}}
)

// Virtual for user's URL 
UserSchema.virtual('url').get(function(){
    return `/user/${this._id}`
})

// Export model 

module.exports = mongoose.model("User",UserSchema)