import mongoose from "mongoose";

// cong ty logictuc
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    addressWallet: { type: String, required: true },
    provider: { type: String, required: true },
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;