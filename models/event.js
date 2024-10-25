import mongoose from 'mongoose'
const Schema = mongoose.Schema


let eventSchema = new Schema({
	title: { type: String, required: true },
	start: { type: Date },
	end: { type: Date },
	color: { type: String },
	patient: { type: Schema.Types.ObjectId, ref: 'Patient' },
	date: { type: String },
	from: { type: String },
	to: { type: String },
	notify_whatsapp: { type: Boolean },
	notify_email: { type: Boolean },
	patientname: { type: String },
	birthdate: { type: String },
	reason: { type: String },
	cel: { type: String },
	email: { type: String },
	status: { type: String },
	medic: { type: Schema.Types.ObjectId, ref: 'User' },
	event_type: { type: String },
	online: { type: Boolean, default: false },
	tenant: { type: Schema.Types.ObjectId, ref: 'Tenant' }
})

export default mongoose.model('Event', eventSchema)
