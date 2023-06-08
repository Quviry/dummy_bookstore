SELECT id,
    (SELECT title FROM book_shop.books WHERE id = book_id )
FROM book_shop.positions
ORDER BY id
LIMIT $1
OFFSET $2