import mongoose from 'mongoose'
const Schema = mongoose.Schema

let specialitySchema = new Schema({
		id: { type: Number },
		name_en: { type: String },
		name_es: { type: String }
})

export default mongoose.model('Speciality', specialitySchema)