SELECT id,
    created_at::text
FROM book_shop.orders
ORDER BY id
LIMIT $1
OFFSET $2