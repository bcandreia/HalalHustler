// fetch-products.js
const fs = require('fs');
const https = require('https');

const SHOP_ID = process.env.PRINTIFY_SHOP_ID;
const TOKEN = process.env.PRINTIFY_TOKEN;

function fetchPrintifyProducts() {
  const options = {
    hostname: 'api.printify.com',
    path: `/v1/shops/${SHOP_ID}/products.json`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    }
  };

  const req = https.request(options, res => {
    let data = '';

    res.on('data', chunk => {
      data += chunk;
    });

    res.on('end', () => {
      const json = JSON.parse(data);
      const products = json.map(product => {
        const variant = product.variants[0];
        const image = variant ? variant.images[0] : null;
        return {
          name: product.title,
          image: image ? image.src : '',
          price: `$${(variant.price / 100).toFixed(2)}`,
          link: `https://halal-hustler.printify.me/product/${product.id}/${product.handle}`
        };
      });

      fs.writeFileSync('products.json', JSON.stringify(products, null, 2));
      console.log('✅ products.json updated successfully.');
    });
  });

  req.on('error', error => {
    console.error('❌ Error fetching products:', error);
  });

  req.end();
}

fetchPrintifyProducts();
