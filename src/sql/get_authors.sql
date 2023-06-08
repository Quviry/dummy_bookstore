SELECT id,
    name::text
FROM book_shop.authors
ORDER BY id 
LIMIT $1
OFFSET $2