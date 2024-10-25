import mongoose from 'mongoose'
const Schema = mongoose.Schema

let plmSchema = new Schema({
    label: { type: String },
    category: { type: String },
    key: { type: String }
}, {collection: 'plm'})

export default mongoose.model('Plm', plmSchema)