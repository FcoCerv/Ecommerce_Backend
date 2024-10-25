import mongoose from 'mongoose'
const Schema = mongoose.Schema

let substanceSchema = new Schema({
    name: { type: String }
}, {collection: 'substances'})

export default mongoose.model('Substance', substanceSchema)