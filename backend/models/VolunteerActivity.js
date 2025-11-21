import mongoose from "mongoose";

const volunteerActivitySchema = new mongoose.Schema({
    //MongoDb Schema goes here
}, { timestamps: true} );

export default mongoose.model('VolunteerActivity', volunteerActivitySchema);