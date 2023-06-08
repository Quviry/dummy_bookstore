SELECT id,
    title
FROM book_shop.publishers
ORDER BY id
LIMIT $1
OFFSET $2