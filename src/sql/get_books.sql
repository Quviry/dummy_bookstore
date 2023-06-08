-- simple select
-- double comment
SELECT id,
    title
FROM book_shop.books -- book table
ORDER BY id
LIMIT $1
OFFSET $2