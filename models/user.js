import mongoose from 'mongoose'

let validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE', 'ASIST_ROLE'],
    message: '{VALUE} no es un rol válido'
}


let Schema = mongoose.Schema


let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRoles
    },
    active: {
        type: Boolean,
        default: true
    },
    newUser: {
        type: Boolean,
        default: true
    },
    email_verified: {
        status: {
            type: Boolean,
            default: false
        },
        confirmationToken: {
            type:  String 
        }
    },
    tenant: { type: Schema.Types.ObjectId, ref: 'Tenant' },
    completedWizard: {
        type: Boolean,
        default: false
    },
    configMedRecs: {
        past: {
            pathological: { type: Boolean, default: true },
            no_pathological: { type: Boolean, default: true },
            heredophamiliar: { type: Boolean, default: true },
            gineco_obstetrics: { type: Boolean, default: false },
            psychiatric: { type: Boolean, default: false },
            nutriological_diet: { type: Boolean, default: false },
            vaccination_scheme: { type: Boolean, default: false }
        },
        med_cons: {
            vital_signs: { type: Boolean, default: false },
            nutritional_monitoring: { type: Boolean, default: false },
            cetosis: { type: Boolean, default: false },
            odontogram: { type: Boolean, default: false },
            antropometric: { type: Boolean, default: false }
        }
    },
    schedule: {
        dom: [ { from: { type: String }, to: { type: String } } ],
        lun: [ { from: { type: String }, to: { type: String } } ],
        mar: [ { from: { type: String }, to: { type: String } } ],
        mie: [ { from: { type: String }, to: { type: String } } ],
        jue: [ { from: { type: String }, to: { type: String } } ],
        vie: [ { from: { type: String }, to: { type: String } } ],
        sab: [ { from: { type: String }, to: { type: String } } ],
        config: {
            status:  { type: Boolean, default: false },
            consultation_duration: { type: String, default: '30'}
        }
    },
    profData: {
        idcard: { type: String, default: null },
        speciality: { type: Schema.Types.ObjectId, ref: 'Speciality', default: '5b7dee93ef9d091ef4ef68ed' },
        institute: { type: String, default: null },
        verified: { type: Boolean, default: false }
    },
    consultories: [
        { type: Schema.Types.ObjectId, ref: 'Consultory' }
    ]
})

userSchema.methods.toJSON = function() {

    let user = this
    let userObject = user.toObject();
    delete userObject.password

    return userObject
}
// const configTenant = {
//   tenantIdKey: 'tenant',
//   tenantIdType: Schema.Types.ObjectId
// }

// userSchema.plugin(mongoTenant,configTenant)

export default mongoose.model('User', userSchema)