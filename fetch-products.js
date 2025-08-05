const fs = require("fs");
const https = require("https");

const shopId = process.env.PRINTIFY_SHOP_ID;
const token = process.env.PRINTIFY_TOKEN;

const options = {
  hostname: "api.printify.com",
  path: `/v1/shops/${shopId}/products.json`,
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

https
  .request(options, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      try {
        const raw = JSON.parse(data);
        const products = raw.map((product) => {
          const variant = product.variants?.[0];
          const image = variant?.images?.[0]?.src || product.images?.[0]?.src;
          const price = (variant?.price || 0) / 100;

          return {
            title: product.title || "No title",
            image: image || "",
            price: price.toFixed(2),
            link: `https://halal-hustler.printify.me/products/${product.handle || product.id}`,
          };
        });

        fs.writeFileSync("products.json", JSON.stringify(products, null, 2));
        console.log("✅ products.json updated");
      } catch (err) {
        console.error("❌ Failed to parse response:", err.message);
      }
    });
  })
  .on("error", (err) => {
    console.error("❌ HTTPS request failed:", err.message);
  })
  .end();
