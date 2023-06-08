#include "view.hpp"

#include <models/pg/schema.hpp>
#include <sql.hpp>

#include <cstdint>
#include <map>
#include <string>

using namespace userver;

namespace handlers::api::schema::get {

View::View(const components::ComponentConfig& config,
           const components::ComponentContext& component_context)
    : HttpHandlerJsonBase(config, component_context),
      pg_cluster_(
          component_context.FindComponent<components::Postgres>("postgres-db")
              .GetCluster()) {}

formats::json::Value View::HandleRequestJsonThrow(
    const server::http::HttpRequest&, const formats::json::Value&,
    server::request::RequestContext&) const {
  formats::json::ValueBuilder result;

  auto rows = pg_cluster_->Execute(storages::postgres::ClusterHostType::kMaster,
                                   kGetSchema);
  result["title"] = "The real bookstore";

  std::map<std::pair<std::string, int64_t>,
           std::vector<dummy_bookstore::models::TableColumn>>
      tables_list;
  for (auto row : rows) {
    const auto row_meta =
        row.As<dummy_bookstore::models::RowsMeta>(storages::postgres::kRowTag);
    tables_list[std::make_pair(row_meta.table_name, row_meta.rows_n)].push_back(
        dummy_bookstore::models::TableColumn{
            row_meta.column_name, row_meta.ordinal_position,
            row_meta.is_nullable, row_meta.is_pk, row_meta.data_type});
  }
  for (auto const& [headler, columns] : tables_list) {
    const auto [table_name, rows_n] = headler;
    formats::json::ValueBuilder table;
    table["title"] = table_name;
    table["entity"] = entities_list.find(table_name) != entities_list.end();
    table["rows_number"] = rows_n;
    for (const auto& column : columns) table["columns"].PushBack(column);
    result["tables"].PushBack(table.ExtractValue());
  }

  result["scripts"].PushBack(formats::json::MakeObject("title", "All books"));

  return result.ExtractValue();
}
}  // namespace handlers::api::schema::get
