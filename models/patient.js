import mongoose from 'mongoose'
const Schema = mongoose.Schema

let patientSchema = new Schema({
		first_name: { type: String, required: true },
		last_name: { type: String, required: true },
		birthdate: { type: String, required: true },
		sex: { type: String, required: true },
		celintcode: { type: Number },
		cel: { type: String },
		email: { type: String },
		curp: { type: String },
		img: { type: String },
		civil_status: { type: String },
		demographic_info: {
			country: { type: Schema.Types.ObjectId, ref: 'Country' },
			state: { type: String },
			city: { type: String },
			address: { type: String },
			cp: { type: Number }
		},
		emergency_data: {
			name: { type: String },
			relationship:  { type: String },
			cel:  { type: String }
		},
		medical_history: {
			allergies: [ 
				{ type: String }
			],
			other_allergies: { type: String },
			pathological: { 
				previous_hospitalization: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				},
				previous_surgeries: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				},
				diabetes: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				},
				thyroid_diseases: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				},
				arterial_hypertension: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				},
				cardiac_diseases: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				},
				trauma: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				},
				cancer: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				},
				tuberculosis: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				},
				transfusions: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				},
				respiratory_pathologiess: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				},
				gastrointestinal_pathologies: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				},
				sexually_transmitted_diseases: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				},
				others: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				}
			},
            no_pathological: { 
            	physical_activity: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				},
				smoking: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				},
				alcoholism: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				},
				drugs: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				},
				vaccine_or_recent_immunization: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				},
				others: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				}
			},
            heredophamiliar: { 
            	diabetes: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				},
				heart_disease: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				},
				arterial_hypertension: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				},
				thyroid_diseases: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				},
				others: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				}
            },
            psychiatric_history: {
            	familiar_history: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				},
				disease_awareness: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				},
				areas: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				},
				past_treatments: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				},
				current_treatments: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				},
				social_support: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				},
				familiar_group: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				},
				social_aspects: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				},
				laboral_aspects: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				},
				authority_relationship: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				},
				impulse_control: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				},
				frustration: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				},
				others: {
					is: { type: Boolean, default: false },
					desc: { type: String }
				}
            },
            vaccination_scheme: {
            	born: {
					bcg: { type: Boolean, default: false },
					first_hepatitis_b: { type: Boolean, default: false }
            	},
            	two_months: {
					first_pentavalent_acellular: { type: Boolean, default: false },
					second_hepatitis_b: { type: Boolean, default: false },
					first_rotavirus: { type: Boolean, default: false },
					first_neumococo: { type: Boolean, default: false }
            	},
            	four_months: {
					second_pentavalent_acellular: { type: Boolean, default: false },
					second_rotavirus: { type: Boolean, default: false },
					second_neumococo: { type: Boolean, default: false }
            	},
            	six_months: {
					third_pentavalent_acellular: { type: Boolean, default: false },
					third_hepatitis_b: { type: Boolean, default: false },
					third_rotavirus: { type: Boolean, default: false },
					first_influenza: { type: Boolean, default: false }
            	},
            	seven_months: {
					second_influenza: { type: Boolean, default: false }
            	},
            	twelve_months: {
					first_srp: { type: Boolean, default: false },
					third_neumococo: { type: Boolean, default: false }
            	},
            	eighteen_months: {
					fourth_pentavalent_acellular: { type: Boolean, default: false }
            	},
            	two_years: {
					influenza_anual: { type: Boolean, default: false }
            	},
            	three_years: {
					influenza_anual: { type: Boolean, default: false }
            	},
            	four_years: {
					dpt: { type: Boolean, default: false },
					influenza_anual: { type: Boolean, default: false }
            	},
            	five_years: {
					vop_opv: { type: Boolean, default: false },
					influenza_anual: { type: Boolean, default: false }
            	},
            	six_years: {
					second_srp: { type: Boolean, default: false },
            	},
            	eleven_years: {
					vph: { type: Boolean, default: false },
            	},
            	other: {
					is: { type: Boolean, default: false },
					desc: { type: String }
            	}
            },
            nutriological_diet: {
            	breakfast: { 
            		is:{ type: Boolean, default: false },
            		desc: { type: String }
            	},
            	morning_collation: { 
            		is:{ type: Boolean, default: false },
            		desc: { type: String }
            	},
            	lunch: { 
            		is:{ type: Boolean, default: false },
            		desc: { type: String }
            	},
            	afternoon_collation: { 
            		is:{ type: Boolean, default: false },
            		desc: { type: String }
            	},
            	dinner: { 
            		is:{ type: Boolean, default: false },
            		desc: { type: String }
            	},
            	home_foods: { 
            		is:{ type: Boolean, default: false },
            		desc: { type: String }
            	},
            	appetite_level: { type: Number },
            	hunger_satiety: { 
            		is:{ type: Boolean, default: false },
            		desc: { type: String }
            	},
            	water: { type: Number },
            	preferences: { type: String },
            	annoyance_foods: { 
            		is:{ type: Boolean, default: false },
            		desc: { type: String }
            	},
            	supplements: { 
            		is:{ type: Boolean, default: false },
            		desc: { type: String }
            	},
            	other_diets: {
            		is:{ type: Boolean, default: false },
            		desc: { type: String }
            	},
            	ideal_weight: { type: Number },
            	current_condition: {
            		is:{ type: Boolean, default: false },
            		desc: { type: String }
            	},
            	personal_history: {
            		is:{ type: Boolean, default: false },
            		desc: { type: String }
            	},
            	liquids: {
            		is:{ type: Boolean, default: false },
            		desc: { type: String }
            	},
            	nutriological_education: {
					is:{ type: Boolean, default: false },
            		desc: { type: String }
            	},
            	others: {
					is:{ type: Boolean, default: false },
            		desc: { type: String }
            	}
            },
            gineco_obstetrics: {
            	first_menstruation: {
            		is: { type: Boolean, default: false },
            		desc: { type: String }
            	},
            	last_menstruation: {
            		is: { type: Boolean, default: false },
            		desc: { type: String }
            	},
            	caracteristic_menstruation: {
            		is: { type: Boolean, default: false },
            		desc: { type: String }
            	},
            	pregnancies: { 
            		is: { type: Boolean, default: false },
            		desc: { type: String }
            	},
            	cervical_cancer: { 
            		is: { type: Boolean, default: false },
            		desc: { type: String }
            	},
            	uterine_cancer: { 
            		is: { type: Boolean, default: false },
            		desc: { type: String }
            	},
            	mama_cancer: { 
            		is: { type: Boolean, default: false },
            		desc: { type: String }
            	},
            	sexual_activity: {
            		is: { type: Boolean, default: false },
            		desc: { type: String }
            	},
            	anticonceptive_method: {
            		is: { type: Boolean, default: false },
            		desc: { type: String }
            	},
            	hormone_replacement: {
            		is: { type: Boolean, default: false },
            		desc: { type: String }
            	},
            	last_papanicolau: { 
            		is: { type: Boolean, default: false },
            		desc: { type: String }
            	},
            	last_mastography: { 
            		is: { type: Boolean, default: false },
            		desc: { type: String }
            	},
            	others: {
            		is: { type: Boolean, default: false },
            		desc: { type: String }
            	}
            }
		},
		active_medications: [
			{ medicament: { type: String } }
		],
		notes: { type: String },
		attachments: [{ 
			name: { type: String },
			originalname: { type: String },
			mimetype: { type: String },
			destination: { type: String },
			filename: { type: String },
			path: { type: String },
			size: { type: Number }
		}],
		tenant: { type: Schema.Types.ObjectId, ref: 'Tenant' }
})

export default mongoose.model('Patient', patientSchema)