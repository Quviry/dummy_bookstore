#include "view.hpp"

#include <sql.hpp>

#include <cstdint>
#include <map>
#include <string>

#include <userver/storages/postgres/io/uuid.hpp>
#include <userver/storages/postgres/io/type_mapping.hpp>
#include <boost/uuid/uuid.hpp>
#include <boost/uuid/uuid_io.hpp>


using namespace userver;

namespace {
const std::map<std::string, storages::postgres::Query> query_mapper{
    {"books", kGetBooks},         {"authors", kGetAuthors},
    {"addresses", kGetAddresses}, {"customers", kGetCustomers},
    {"cycles", kGetCycles},       {"employees", kGetEmployees},
    {"genres", kGetGenres},       {"orders", kGetOrders},
    {"positions", kGetPositions}, {"publishers", kGetPublishers},
    {"serias", kGetSerias},       {"warehouses", kGetWarehouses}};
}

namespace handlers::api::entity::list::get {

View::View(const components::ComponentConfig& config,
           const components::ComponentContext& component_context)
    : HttpHandlerJsonBase(config, component_context),
      pg_cluster_(
          component_context.FindComponent<components::Postgres>("postgres-db")
              .GetCluster()) {}

formats::json::Value View::HandleRequestJsonThrow(
    const server::http::HttpRequest& request, const formats::json::Value&,
    server::request::RequestContext&) const {
  formats::json::ValueBuilder result;
  int64_t offset;

  if (request.HasArg("page")) {
    offset = std::stoi(request.GetArg("page")) * kPageLimit;
  } else {
    offset = 0;
  }

  const std::string name = request.GetPathArg("name");
  if (entities_list.find(name) == entities_list.end()) {
    request.SetResponseStatus(server::http::HttpStatus::kNotFound);
    result["code"] = "Not entity";
    return result.ExtractValue();
  }
  auto rows = pg_cluster_->Execute(storages::postgres::ClusterHostType::kMaster,
                                   query_mapper.at(name), kPageLimit, offset);
  if (rows.IsEmpty()) {
    result["code"] = "Empty";
    return result.ExtractValue();
  }

  for (const auto& row : rows) {
    formats::json::ValueBuilder line;
    for (const auto& column : row) {
      if (column.Name() == "id") {
        line["id"] = boost::uuids::to_string(column.As<boost::uuids::uuid>());
      } else {
        line[std::string{column.Name()}] = column.As<std::string>();
      }
    }
    result["data"].PushBack(line.ExtractValue());
  }
  result["code"] = "Ok";
  return result.ExtractValue();
}
}  // namespace handlers::api::entity::list::get
