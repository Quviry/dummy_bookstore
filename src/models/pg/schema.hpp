#pragma once

#include <userver/storages/postgres/io/io_fwd.hpp>
#include <userver/storages/postgres/io/pg_types.hpp>

using namespace userver;

namespace dummy_bookstore::models {
struct RowsMeta {
  std::string table_name;
  std::string column_name;
  int64_t ordinal_position;
  bool is_nullable;
  std::string data_type;
  int64_t rows_n;
  bool is_unique;
  bool is_pk;
};

struct TableColumn {
  std::string title;
  int64_t order;
  bool is_nullable;
  bool is_pk;
  std::string datatype;
};

formats::json::Value Serialize(const TableColumn& value,
                               formats::serialize::To<formats::json::Value>) {
  formats::json::ValueBuilder result;
  result["title"] = value.title;
  result["order"] = value.order;
  result["is_nullable"] = value.is_nullable;
  result["is_pk"] = value.is_pk;
  result["datatype"] = value.datatype;
  return result.ExtractValue();
}
}  // namespace dummy_bookstore::models

namespace userver::storages::postgres::io {
template <>
struct CppToUserPg<dummy_bookstore::models::RowsMeta> {
  static constexpr DBTypeName postgres_name =
      "book_shop.schema_container_type";
};
}  // namespace userver::storages::postgres::io