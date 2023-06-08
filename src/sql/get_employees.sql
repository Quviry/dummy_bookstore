SELECT id,
    (SELECT full_name FROM book_shop.people WHERE id = person_id)
FROM book_shop.employees
ORDER BY id
LIMIT $1
OFFSET $2