const Product = require('../models/product')
const {cloudinary} = require('../config/cloudinary')

const getProducts = async(req , res) => {
  try {
    const products = await Product.find({});
    res.json(products);

  }
  catch(error) 
  {
    res.status(500).json({message : "Server error"})
  }
};

const getProductById = async(req,res) => {
  try {
    const product = await Product.findById(req.params.id)
    if(product)
    {
      res.json(product)
    }
    else {
      res.status(404).json({message : "Product not found"})
    }
  }
  catch(error) {
    res.status(500).json({message : 'Server error'})
  }
};

const createProduct = async(req,res) => {
 try {
  const {name , description , price , category , stock} = req.body;
  const missingFields = ['name', 'description', 'price', 'category', 'stock']
    .filter((field) => req.body[field] === undefined || req.body[field] === '');
  if(missingFields.length > 0) {
    return res.status(400).json({message: `Missing required fields: ${missingFields.join(', ')}`});
  }
  if(!req.file) {
    return res.status(400).json({message: "Product image is required in the 'image' field"});
  }

  let result;
  try {
    result = await cloudinary.uploader.upload(req.file.path);
  } catch(error) {
    console.error('Product image upload failed:', error);
    return res.status(502).json({message: 'Product image upload failed'});
  }

  const product = new Product({
    name ,
    description ,
    price ,
    category ,
    stock,
    imageUrl: result.secure_url
  })

  const saveProduct = await product.save();
  res.status(201).json(saveProduct);
}

  catch(error) {
    console.error('Product creation failed:', error);
    if(error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({message: error.message});
    }
    res.status(500).json({message : 'Product creation failed'});
  }

};

const updateProduct = async(req ,res) => {
  try {
    const {name , description , price , category , stock } = req.body;
    const product = await Product.findById(req.params.id);
    if(product) 
    {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price =  price || product.price;
      product.category = category || product.category;
      product.stock = stock || product.stock;
      if(req.file)
      {
        const result = await cloudinary.uploader.upload(req.file.path);
        console.log(result);
        product.imageUrl = result.secure_url;
      }
      const updatedProduct = await product.save();
      res.json(updatedProduct);


    }

    else {
      res.status(404).json({message : 'Product Not Found'})
    }
  }

  catch(error)
  {
    res.status(500).json({message : "Server error"})
  }
};

const deleteProduct = async(req ,res) => {
  try {
    const product = await Product.findById(req.params.id);
    if(product) 
    {
      await  product.deleteOne();
      res.json({message: "Product removed"});
    }
    else {
      res.status(404).json({message : 'Product Not Found'})
    }
  }
  catch(error) 
  {
    res.status(500).json({message:"Server error"})
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};