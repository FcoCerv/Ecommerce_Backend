import mongoose from 'mongoose'
const Schema = mongoose.Schema

let productSchema = new Schema({
    name: { type: String },
    catalog_type: { type: String },
    price: { type: Number },
    status: { type: Boolean },
    tenant: { type: Schema.Types.ObjectId, ref: 'Tenant' }
}, {collection: 'products'})

export default mongoose.model('Product', productSchema)