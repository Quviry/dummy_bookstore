SELECT
id, coordinates::text
FROM 
book_shop.addresses
LIMIT $1
OFFSET $2