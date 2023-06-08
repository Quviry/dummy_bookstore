-- schemas  
CREATE schema IF NOT EXISTS book_shop;

-- extentions 
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- tables

CREATE TABLE IF NOT EXISTS book_shop.authors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  bio TEXT
);


CREATE TABLE IF NOT EXISTS book_shop.authorities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL,
  book_id UUID NOT NULL
);


CREATE TABLE IF NOT EXISTS book_shop.cycles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL, 
  author_id UUID NOT NULL,
  description TEXT
);


-- Фактически описывает тираж, а не книгу
CREATE TABLE IF NOT EXISTS book_shop.books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  main_genre_id UUID NOT NULL,
  publisher_id UUID NOT NULL,
  published_at date NOT NULL,
  produced_at date NOT NULL,
  price money,
  cicle_id UUID,
  lang_code CHAR(3),
  seria_id UUID
);




CREATE TABLE IF NOT EXISTS book_shop.genres (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 title TEXT NOT NULL,
 description TEXT
);



CREATE TABLE IF NOT EXISTS book_shop.genred (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 book_id UUID,
 genre_id UUID
);

CREATE TABLE IF NOT EXISTS book_shop.publishers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS book_shop.serias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  publisher_id UUID,
  title TEXT
);

CREATE TABLE IF NOT EXISTS book_shop.coutries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code CHAR(3),
  name TEXT
);

CREATE TABLE IF NOT EXISTS book_shop.limitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country_id UUID,
  book_id UUID NOT NULL,
  rating integer,
  extra TEXT
);

CREATE TYPE book_shop.position_status AS ENUM (
  'stored',
  'shiped',
  'ordered',
  'sold'
);

CREATE TABLE IF NOT EXISTS book_shop.positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL,
  PRICE MONEY,
  status book_shop.position_status NOT NULL,
  stored_in UUID -- warehouse id
);

CREATE TABLE IF NOT EXISTS book_shop.warehouses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address_id UUID NOT NULL,
  phone TEXT,
  is_store BOOLEAN 
);

CREATE TABLE IF NOT EXISTS book_shop.people ( -- person
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  email TEXT,
  phone TEXT
);

CREATE TABLE IF NOT EXISTS book_shop.employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  person_id UUID NOT NULL,
  store_id UUID NOT NULL, -- warehouse store:TRUE
  salary MONEY,
  payd_days INTEGER,
  unpayd_days INTEGER
);

CREATE TABLE IF NOT EXISTS book_shop.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  person_id UUID NOT NULL UNIQUE,
  address_id UUID
);

CREATE TABLE IF NOT EXISTS book_shop.addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country_id UUID NOT NULL,
  coordinates POINT NOT NULL,
  sity TEXT,
  street TEXT,
  house TEXT,
  zip_code TEXT,
  extra TEXT
);

CREATE TABLE IF NOT EXISTS book_shop.orders(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL,
  price MONEY NOT NULL,
  created_at timestamp,
  delivered_at timestamp,
  delivery_adress_id UUID,
  delivery_cost MONEY,
  saler_id UUID -- employees
);

CREATE TABLE IF NOT EXISTS book_shop.order_lines(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL,
  quantity INTEGER,
  itemprice MONEY
);

CREATE TYPE book_shop.payment_status AS ENUM ('unpayd', 'payment_in_process', 'payd');

CREATE TYPE book_shop.delivery_status AS ENUM ('ordered', 'collected', 'inway', 'delivered');

CREATE TABLE IF NOT EXISTS book_shop.orders_history(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL,
  created_at timestamp,
  delivery_status book_shop.delivery_status,
  payment_status book_shop.payment_status NOT NULL
);


CREATE TYPE book_shop.schema_container_type AS (
  table_name TEXT,
  column_name TEXT, 
  ordinal_position INTEGER,
  is_nullable BOOLEAN,
  data_type TEXT,
  rows_n INTEGER,
  is_unique BOOLEAN,
  is_pk BOOLEAN
);


-- relations


-- data COMMENT
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