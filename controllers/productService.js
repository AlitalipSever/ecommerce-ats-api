const Product = require("../models/Product")


const productSave = async (req, res) => {

    try {
        const newProduct = new Product(req.body)
        const savedProduct = await newProduct.save()
        res.status(200).json(savedProduct)
    }catch (e) {
        res.status(500).json(e)
    }
}

const productUpdate = async (req, res) => {
    try{
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            //TODO Add id null check
            {
                $set:req.body
            },
            {new:true}
        );
        res.status(200).json(updatedProduct)
    }catch (e) {
        res.status(500).json(e)
        //TODO create custom API error
    }
}

module.exports = {productSave, productUpdate}