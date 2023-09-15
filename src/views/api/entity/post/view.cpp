#include "view.hpp"

#include <boost/lexical_cast.hpp>
#include <boost/uuid/uuid.hpp>
#include <boost/uuid/uuid_generators.hpp>
#include <boost/uuid/uuid_io.hpp>
#include <sql.hpp>
#include <userver/formats/parse/common_containers.hpp>

using namespace userver;

namespace handlers::api::entity::post {

boost::uuids::uuid getuuid(const std::string& s){
    return boost::lexical_cast<boost::uuids::uuid>(s);
}

boost::uuids::uuid getuuids(const std::string& s){
    if (s == ""){
        return boost::uuids::random_generator()();
    }
    return getuuid(s);
}


View::View(const components::ComponentConfig& config,
           const components::ComponentContext& component_context)
    : HttpHandlerJsonBase(config, component_context),
      pg_cluster_(
          component_context.FindComponent<components::Postgres>("postgres-db")
              .GetCluster()) {}

formats::json::Value View::HandleRequestJsonThrow(
    const server::http::HttpRequest& request,
    const formats::json::Value& source,
    server::request::RequestContext&) const {
  const std::string entity_name = request.GetPathArg("name");
  const boost::uuids::uuid id = getuuids(source["id"].As<std::string>());
  constexpr auto atype = storages::postgres::ClusterHostType::kMaster;

  if (entity_name == "authors") {
    pg_cluster_->Execute(atype, kUpsertAuthors, id,
                         source["name"].As<std::string>(),
                         source["bio"].As<std::string>());
  } else if (true) {
    return {};
  } else {
    return formats::json::MakeObject("code", "Unknown entity");
  }

  return formats::json::MakeObject("code", "Ok");
}

}  // namespace handlers::api::entity::post