import mongoose from "mongoose";

const modelClubs = new mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref:"modelousuarios"},
    name: {type: String, require: true},
    profilePicture: {type: String},
    courts: {type: [{type: mongoose.Schema({
        court: {type: mongoose.Schema.Types.ObjectId, ref:"modeloCanchas"}
    })}]},
    profile: {type: mongoose.Schema({
        phone: {type: Number},
        city: {type: String},
        adress: {type: String}
    })}
})

export default mongoose.model('modeloClubes', modelClubs);