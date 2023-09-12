#include "view.hpp"

#include <cstdint>
#include <exception>
#include <map>
#include <sql.hpp>
#include <string>

const std::string query_template{"SELECT json_agg(a) FROM ({}) a "};

namespace handlers::api::console::post {
View::View(const components::ComponentConfig& config,
           const components::ComponentContext& component_context)
    : HttpHandlerJsonBase(config, component_context),
      pg_cluster_(
          component_context.FindComponent<components::Postgres>("postgres-db")
              .GetCluster()) {}

formats::json::Value View::HandleRequestJsonThrow(
    const server::http::HttpRequest& request, const formats::json::Value&,
    server::request::RequestContext&) const try {
  std::string script = "SELECT * FROM book_shop.authors";
  const auto result = pg_cluster_->Execute(
      storages::postgres::ClusterHostType::kMaster, query_template, script);
  result.RowsAffected();
  for (auto row : result) {
    row[0].As<formats::json::Value>();
  }
  return {};
} catch (const std::exception& e) {
  e.what();
}
}  // namespace handlers::api::console::post