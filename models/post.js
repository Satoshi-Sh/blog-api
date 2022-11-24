const mongoose = require("mongoose");
const { DateTime } =require("luxon")

const Schema = mongoose.Schema;


const PostSchema = new Schema({
    title: {type:String,required:true,min_length:1,maxLength:100},
    text: {type:String, required:true,min_length:1,maxLength:1200},
    user: {type:Schema.Types.ObjectId, ref:"User",required:true},
    published:{type:Boolean, required:true,default:false}
},{timestamps:true,toJSON:{virtuals:true}})

//createdAt updatedAt
PostSchema.virtual("created_formatted").get(function(){
    var d = new Date()
    return this.createdAt? DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATE_MED) + ' ' +DateTime.fromJSDate(this.createdAt).toFormat('h:mm a')  :'';
})

PostSchema.virtual("updated_formatted").get(function(){
    var d = new Date()
    return this.updatedAt? DateTime.fromJSDate(this.updatedAt).toLocaleString(DateTime.DATE_MED) + ' ' +DateTime.fromJSDate(this.updatedAt).toFormat('h:mm a')  :'';
})


// Post url 
PostSchema.virtual('url').get(function(){
    return `/post/${this._id}`
})

// Export model 
module.exports = mongoose.model("Post",PostSchema)
