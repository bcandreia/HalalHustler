const https = require('https');
const fs = require('fs');

// Replace with your Printify shop ID
const SHOP_ID = process.env.PRINTIFY_SHOP_ID;
const TOKEN = process.env.PRINTIFY_TOKEN;

const options = {
  hostname: 'api.printify.com',
  path: `/v1/shops/${SHOP_ID}/products.json`,
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  },
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const products = json.map((product) => {
        return {
          id: product.id,
          title: product.title,
          image: product.images?.[0]?.src || '',
          price: (product.variants?.[0]?.price / 100).toFixed(2),
          link: `https://halal-hustler.printify.me/products/${product.handle}`,
        };
      });

      fs.writeFileSync('products.json', JSON.stringify(products, null, 2));
      console.log('✅ products.json updated successfully!');
    } catch (error) {
      console.error('❌ Failed to parse JSON:', error);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error);
  process.exit(1);
});

req.end();
