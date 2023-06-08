SELECT id,
    name
FROM book_shop.warehouses
ORDER BY id
LIMIT $1 OFFSET $2