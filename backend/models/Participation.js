import mongoose from "mongoose";

const participationSchema = new mongoose.Schema({
    //MongoDb Schema goes here
}, { timestamps: true} );

export default mongoose.model('VolunteerActivity', participationSchema);