SELECT id,
    title
FROM book_shop.cycles
ORDER BY id
LIMIT $1
OFFSET $2