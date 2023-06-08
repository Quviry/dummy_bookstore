-- lol, lov it
WITH glop AS (
  SELECT 
  k.table_name,
  k.column_name
  FROM    information_schema.constraint_column_usage v
  JOIN information_schema.key_column_usage k
  ON k.constraint_name = v.constraint_name
  WHERE k.position_in_unique_constraint IS NULL
)
SELECT 
  isc.table_name table_name,
  isc.column_name column_name, 
  isc.ordinal_position ordinal_position,
  isc.is_nullable::boolean is_nullable,
  isc.data_type data_type,
  (xpath('/row/c/text()', query_to_xml(format('SELECT count(*) AS c FROM %I.%I', 'book_shop', isc.table_name), FALSE, TRUE, '')))[1]::text::integer AS rows_n,
  (glop.column_name IS NOT NULL) is_unique,
  isc.column_name = 'id' is_pk
FROM 
   information_schema.columns isc
LEFT JOIN glop 
ON isc.table_name = glop.table_name AND isc.column_name = glop.column_name
WHERE table_schema = 'book_shop'
ORDER BY table_name, ordinal_position;