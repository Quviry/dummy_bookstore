INSERT INTO book_shop.authors (id, name, bio)
VALUES ($1, $2, $3)
ON CONFLICT (id) DO UPDATE
SET 
    name=EXCLUDED.name,
    bio=EXCLUDED.bio