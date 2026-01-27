import json

# Read the db.json
with open('src/lib/db.json', 'r') as f:
    db = json.load(f)

# Read the products
with open('/tmp/products.json', 'r') as f:
    products = json.load(f)

# Merge
db['products'] = products

# Write back
with open('src/lib/db.json', 'w') as f:
    json.dump(db, f, indent=2)

print("Database updated with", len(products), "products")
