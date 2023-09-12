#pragma once

#include <userver/components/component_context.hpp>
#include <userver/server/handlers/http_handler_json_base.hpp>
#include <userver/storages/postgres/cluster.hpp>
#include <userver/storages/postgres/component.hpp>

using namespace userver;

namespace handlers::api::entity::post {

class View final : public server::handlers::HttpHandlerJsonBase {
  storages::postgres::ClusterPtr pg_cluster_;

 public:
  View(const components::ComponentConfig& config,
       const components::ComponentContext& component_context);

  static constexpr std::string_view kName = "handler-create-api-entity";
  formats::json::Value HandleRequestJsonThrow(
      const server::http::HttpRequest&, const formats::json::Value&,
      server::request::RequestContext&) const override;
};
}  // namespace handlers::api::entity::post