import mongoose from "mongoose";


const modelTournament = new mongoose.Schema({
   
    owner: { type: mongoose.Schema.Types.ObjectId, ref:"modeloClubes"},
    type_name_discipline_description_date: { type: Object, require: true },
    configuration_of_tournament: { type: Object, require: true },
    organizationalClub_regulations_contacts_image_privacy_password: { type: Object, require: true },
    payments_fieldOfInscription_message_of_inscription: { type: Object, require: true}
    
});

export default mongoose.model("modeloTorneos", modelTournament)