import mongoose from 'mongoose'
const Schema = mongoose.Schema

let countrySchema = new Schema({
		id: { type: Number },
		name_en: { type: String },
		name_es: { type: String },
		tel_code: {type: Number },
		iso_code: { type: String },
		default_locale: { type: String }

})

export default mongoose.model('Country', countrySchema)