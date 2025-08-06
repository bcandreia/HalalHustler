# HalalHustler
Islamic Apparel

## Updating Products

The shop page uses `products.json` which is generated from the Printify API.
To refresh the list with current prices and images:

1. Set the environment variables `PRINTIFY_SHOP_ID` and `PRINTIFY_TOKEN`.
2. Run `node fetch-products.js`.

This will overwrite `products.json` with the latest product data.
