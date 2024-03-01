import mongoose from "mongoose";

const modelCourts = new mongoose.Schema({
    title : { type : String , require : true },
    description : { type : String },
    price : { type : Number , require : true},
    media : { type: [{type: mongoose.Schema({
        name: {type: String, require: true},
        type: {type: String, require: true}
    })}]},
    club_owner : {type: mongoose.Schema.Types.ObjectId, ref:"modeloClubes"},
    type : {type: String, require : true},
    courts : { type: [{type: mongoose.Schema({
        name: {type: String, require: true},
        schedule: {type: Array, require: true},
        courtTime: {type: String, require: true},
        surface : {type: String, require: true},
        status: {type: Boolean}
    })}]}
}, {timestamps: true});

export default mongoose.model('modeloCanchas', modelCourts);