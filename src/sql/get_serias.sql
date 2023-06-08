SELECT id,
    title
FROM book_shop.serias
ORDER BY id
LIMIT $1 OFFSET $2