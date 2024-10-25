import mongoose from 'mongoose'
const Schema = mongoose.Schema

let medicamentSchema = new Schema({
    name: { type: String },
    substances: [ {type: String } ],
    form: { type: String },
    presentation: { type: String },
    alboratory: { type: String },
    key: { type: String },
    type: { type: String }
}, {collection: 'medicaments'})

export default mongoose.model('Medicament', medicamentSchema)