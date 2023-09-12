#include "view.hpp"

#include <models/entities.hpp>
#include <sql.hpp>

#include <exception>
#include <boost/lexical_cast.hpp>
#include <boost/uuid/uuid.hpp>
#include <boost/uuid/uuid_io.hpp>

using namespace userver;

namespace handlers::api::entity::get {
View::View(const components::ComponentConfig& config,
           const components::ComponentContext& component_context)
    : HttpHandlerJsonBase(config, component_context),
      pg_cluster_(
          component_context.FindComponent<components::Postgres>("postgres-db")
              .GetCluster()) {}

formats::json::Value View::HandleRequestJsonThrow(
    const server::http::HttpRequest& request, const formats::json::Value&,
    server::request::RequestContext&) const try {
  std::string entity_name = request.GetPathArg("name");
  std::string entity_id = request.GetPathArg("id");

  if (models::entities::entities_list.find(entity_name) !=
      models::entities::entities_list.end()) {
    storages::postgres::Query DeleteTemplate{
        fmt::format(
            R"(SELECT json_agg(a) FROM book_shop.{} as a
    WHERE id = $1
)",
            entity_name),
        userver::storages::postgres::Query::Name{
            fmt::format("get_{}", entity_name)}};
    auto result = pg_cluster_->Execute(
        storages::postgres::ClusterHostType::kMaster, DeleteTemplate,
        boost::lexical_cast<boost::uuids::uuid>(entity_id));
    if (result.Size() == 1) {
      formats::json::ValueBuilder vb;
      vb["code"] = "Ok";
      vb["data"] = result[0][0].As<formats::json::Value>();
      return vb.ExtractValue();
    }
  }
  return formats::json::MakeObject("code", "Failure");
} catch (const std::exception& e) {
  std::string exp = e.what();
  return formats::json::MakeObject("code", "Failure error: \n" + exp);
}

}  // namespace handlers::api::entity::get