SELECT id,
    title
FROM book_shop.genres
ORDER BY id
LIMIT $1
OFFSET $2