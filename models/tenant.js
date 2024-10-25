import mongoose from 'mongoose'
const Schema = mongoose.Schema

let validPlans = {
    values: ['DEMO', 'GRATIS', 'BASICO', 'PREMIUM', 'PERSONALIZADO'],
    message: '{VALUE} no es un plan válido'
}
let validTypes = {
    values: ['Clinica','Consultorio','Otro'],
    message: '{VALUE} no es un tipo válido'
}

let tenantSchema = new Schema({
	owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
	name: { type: String, required: true },
	//country: { type: Schema.Types.ObjectId, ref: 'Country', required: true },
	type_org: { type: String, enum: validTypes , default: 'Clinica' },
	//speciality: { type: Schema.Types.ObjectId, ref: 'Speciality', required: true },
	avg_medics: { type: String, required: true  },
	//cel: { type: Number, required: true },
	//phone: { type: Number },
	active: { type: Boolean, default: true },
    licenses:[{
    	license: { type: String }, // Token con validez del tiempo suscrito y datos de suscripción -Tipo,propietario,valido desde,valido hasta-
    	validFrom: { type: Date },
    	validTo: { type: Date },
    	type_lic: { type: String, default: 'DEMO' },
    	owner: { type: Schema.Types.ObjectId, ref: 'User', unique: true },
    	status: { type: Boolean }
    }],
    startAt: { type: Date, default: Date.now }
})

export default mongoose.model('Tenant', tenantSchema)