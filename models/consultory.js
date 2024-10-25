import mongoose from 'mongoose'
const Schema = mongoose.Schema


let consultorySchema = new Schema({
	name: { type: String, required: true },
	address: { type: String },
	country: { type: Schema.Types.ObjectId, ref: 'Country', required: true },
	state: { type: String },
	city: { type: String },
	cp: { type: Number },
	phone: { type: String },
	logo: { type: String },
	active: { type: Boolean, default: true },
	tenant: { type: Schema.Types.ObjectId, ref: 'Tenant' }
})

export default mongoose.model('Consultory', consultorySchema)
