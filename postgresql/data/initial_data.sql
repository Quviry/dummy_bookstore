
insert INTO book_shop.genres (title) VALUES ('horror');
insert INTO book_shop.publishers (title, phone, address) VALUES ('Horror house', '+88005553535', 'High road, Low Street, 7b');

INSERT INTO book_shop.books (
  title,
  main_genre_id,
  publisher_id,
  published_at,
  produced_at
) VALUES (
  'Nice History',
  (SELECT id FROM book_shop.genres LIMIT 1),
  (SELECT id FROM book_shop.publishers LIMIT 1),
  '10-10-2000',
  '10-10-2000'
);