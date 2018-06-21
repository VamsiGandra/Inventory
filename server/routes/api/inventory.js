const User = require('../../models/User');
const Product = require('../../models/Product');


module.exports = (app) => {
 
  app.get('/api/inventory/products', (req, res) => {

    Product.find({}).then((products) => {
        return res.send({
            data: products
        });
        });
  });

  // add a product
  app.post('/api/inventory/addproduct', (req, res) => {

    const { body } = req;
    const {
      productName,
      numberOfItems
    } = body;
    
    console.log(body);

    if (!productName) {
      return res.send({
        success: false,
        message: 'Error: product cannot be blank.'
      });
    }

    const newProduct = new Product();

    newProduct.productName = productName;
    newProduct.numberOfItems = numberOfItems;
    newProduct.save((err, product) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Error: Server error'
          });
        }
        return res.send({
          success: true,
          message: 'product added'
        });
      });

  });

  // update a product
  app.put('/inventory/products/:id', (req, res, next) => {
    
    console.log('inside');
    const { body } = req;
    const {
      productName,
      numberOfItems
    } = body;

    const productId = req.params.id;
    
    console.log(body);

    Product.findByIdAndUpdate(productId, {
        productName: productName,
        numberOfItems: numberOfItems
    }, {new: true})
    .then(product => {
        if(!product) {
            return res.status(404).send({
                message: "Product not found with id " + productId
            });
        }
        res.send(product);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Product not found with id " + productId
            });                
        }
        return res.status(500).send({
            message: "Error updating product with id " + productId
        });
    });

  });

  app.delete('/inventory/products/:id', (req, res, next) => {
    
    const { body } = req;
  

    const productId = req.params.id;

    Product.findByIdAndRemove(productId)
    .then(product => {
        if(!product) {
            return res.status(404).send({
                message: "Product not found with id " + productId
            });
        }
        res.send({message: "Product deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Product not found with id " + productId
            });                
        }
        return res.status(500).send({
            message: "Product not delete note with id " + productId
        });
    });

  });
  
};