import mongoose from 'mongoose'
const Schema = mongoose.Schema

let consultationSchema = new Schema({
		patient: { type: Schema.Types.ObjectId, ref: 'Patient' },
		date: { type: Date },
		medic: { type: Schema.Types.ObjectId, ref: 'User' },
		disease_notes: {
			reason: { type: String },
			symptom: { type: String },
			physical_exploration: { type: String },
			notes: { type: String }
		},
		vital_signs: {
			height: { type: String },
			weight: { type: Number },
			temp: { type: Number },
			breathing_frequency: { type: Number },
			systolic: { type: Number },
			diastolic: { type: Number },
			hearth_rate: { type: Number }
		},
		cetosis: {
			saciety: { type: Number },
			cramps: { type: Number },
			diarrhea: { type: Number },
			depressed: { type: Number },
			tolerance: { type: Number },
			constipation: { type: Number },
			vertigo: { type: Number },
			anxiety: { type: Number },
			irritability: { type: Number },
			impulse_control: { type: Number },
			halitosis: { type: Number },
			hunger: { type: Number },
			sleep_problems: { type: Number },
			impatient: { type: Number },
			stimulants: { type: Number },
			migraine_headache: { type: Number },
			tiredness: { type: Number },
			concentration: { type: Number },
			aggressiveness: { type: Number }
		},
		odontogram: { 
			isChild: { type: Boolean, default: false },
			data: [{
				toothName: { type: String },
				toothSection: { type: String },
				toothSectionName: { type: String },
				diagnostic: { 
					id: { type: String },
					desc: { type: String }
				},
				treatment: { type: String },
				notes: { type: String }
			}]
		},
		diagnostics: [{ 
				id: { type: String },
		 		desc: { type: String }
		 	}],
		procedures: [{ 
				id: { type: String },
		 		desc: { type: String }
		 	}],
		laboratory_studies: [ {type: String } ],
		meds: [{
				quantity: { type: Number },
				name: { type: String },
				presentation: { type: String },
				dosis: { type: String },
				frequency: { type: String },
				duration: { type: String },
				via: { type: String },
				note: { type: String }
			}
		],
		med_comments: { type: String },
		charges: {
			discountType: { type: String, default: '%' },
			discount: { type: Number, default: 0 },
			taxType: { type: String, default: '%' },
			tax: { type: Number, default: 0 },
			//paymentType: { type: String, default: 'Efectivo' },
			subtotal: { type: Number, default: 0 },
			discount_total: { type: Number, default: 0 },
			tax_total: { type: Number, default: 0 },
			total: { type: Number, default: 0 },
			//status: { type: Boolean, default: false },
			// payed: { type: Number, default: 0 },
			// restant: { type: Number, default: 0 },
			products: [ {
				name: { type: String }, 
				price: { type: Number }, 
				quantity: { type: Number }
			} ]
		},
		payments: {
			//restant: { type: Number },
			payed: { type: Number, default: 0 },
			paying: [{
				date: { type: Date },
				amount: { type: Number },
				paymentType: { type: String, default: 'Efectivo' },
				note: { type: String }
			}]
		},
		tenant: { type: Schema.Types.ObjectId, ref: 'Tenant' }
})

export default mongoose.model('Consultation', consultationSchema)