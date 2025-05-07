import mongoose from "mongoose";

// cong ty logictuc
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: String, required: true },
    receiver: { type: String, required: true },
    addressWallet: { type: String, required: true },
    provider: { type: String, required: true },
    dateAdded: { type: Date, default: Date.now },
    status: { type: String, required: true },
    type: { type: String, required: true }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;