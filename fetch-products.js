const https = require('https');
const fs = require('fs');

const SHOP_ID = process.env.PRINTIFY_SHOP_ID;
const TOKEN = process.env.PRINTIFY_TOKEN;

const options = {
  hostname: 'api.printify.com',
  path: `/v1/shops/${SHOP_ID}/products.json`,
  method: 'GET',
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);

      // ✅ FIX: Extract correct array (depends on API structure)
      const products = parsed.data || parsed; // handle both possibilities

      if (!Array.isArray(products)) {
        throw new Error("Expected an array of products.");
      }

      const simplified = products.map((product) => ({
        title: product.title,
        image: product.images?.[0]?.src || '',
        price: product.variants?.[0]?.price || '',
        link: `https://halal-hustler.printify.me/products/${product.handle}`,
      }));

      fs.writeFileSync('products.json', JSON.stringify(simplified, null, 2));
      console.log('✅ products.json updated successfully');
    } catch (error) {
      console.error('❌ Failed to parse JSON:', error.message);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error.message);
  process.exit(1);
});

req.end();

