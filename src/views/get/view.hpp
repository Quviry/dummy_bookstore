#pragma once

#include <userver/server/handlers/http_handler_base.hpp>

namespace handlers::get {
class View final : public userver::server::handlers::HttpHandlerBase {
 public:
  View(const userver::components::ComponentConfig& config,
       const userver::components::ComponentContext& component_context);

  static constexpr std::string_view kName = "handler-root";
  std::string HandleRequestThrow(
      const userver::server::http::HttpRequest& request,
      userver::server::request::RequestContext&) const override;
};
}  // namespace handlers::get