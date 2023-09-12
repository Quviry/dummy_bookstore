#include <userver/clients/http/component.hpp>
#include <userver/components/minimal_server_component_list.hpp>
#include <userver/server/handlers/ping.hpp>
#include <userver/server/handlers/tests_control.hpp>
#include <userver/testsuite/testsuite_support.hpp>
#include <userver/utils/daemon_run.hpp>
#include <userver/server/handlers/http_handler_static.hpp>

#include <hello.hpp>
#include <views/get/view.hpp>
#include <views/api/schema/get/view.hpp>
#include <views/api/entity/list/get/view.hpp>
#include <views/api/entity/get/view.hpp>
#include <views/api/entity/delete/view.hpp>
#include <views/api/entity/post/view.hpp>


int main(int argc, char* argv[]) {
  auto component_list = userver::components::MinimalServerComponentList()
                            .Append<userver::server::handlers::Ping>()
                            .Append<userver::components::TestsuiteSupport>()
                            .Append<userver::components::HttpClient>()
                            .Append<userver::server::handlers::TestsControl>()
                            .Append<userver::components::FsCache>("fs-cache-static")
                            .Append<userver::server::handlers::HttpHandlerStatic>()
                            .Append<handlers::get::View>()
                            .Append<handlers::api::schema::get::View>()
                            .Append<handlers::api::entity::list::get::View>()
                            .Append<handlers::api::entity::post::View>()
                            .Append<handlers::api::entity::get::View>()
                            .Append<handlers::api::entity::del::View>();

  dummy_bookstore::AppendHello(component_list);

  return userver::utils::DaemonMain(argc, argv, component_list);
}
