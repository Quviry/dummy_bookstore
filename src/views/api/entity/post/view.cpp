#include "view.hpp"

#include <sql.hpp>

using namespace userver;

namespace handlers::api::entity::post {
View::View(const components::ComponentConfig& config,
           const components::ComponentContext& component_context)
    : HttpHandlerJsonBase(config, component_context),
      pg_cluster_(
          component_context.FindComponent<components::Postgres>("postgres-db")
              .GetCluster()) {}

formats::json::Value View::HandleRequestJsonThrow(
    const server::http::HttpRequest&, const formats::json::Value&,
    server::request::RequestContext&) const {
        return {};
    }

}  // namespace handlers::api::entity::post