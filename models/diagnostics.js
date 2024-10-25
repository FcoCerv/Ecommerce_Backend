import mongoose from 'mongoose'
const Schema = mongoose.Schema

let diagnosticsSchema = new Schema({
    id: { type: String },
    desc: { type: String }
}, {collection: 'diagnostics'})

export default mongoose.model('Diagnostics', diagnosticsSchema)