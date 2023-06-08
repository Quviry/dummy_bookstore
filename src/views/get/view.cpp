#include "view.hpp"

namespace {

const std::string response_template = R"(
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Dummy bookstore</title>
    <link href="/static/css/bootstrap.min.css" rel="stylesheet">
  </head>
  <body>
    <div id="main" class="text-center align-self-center my-4">Hello, world!</div>
    <div class="toast-container position-fixed bottom-0 end-0 p-3" id="toaster"></div>
    <div class="toast-container position-fixed bottom-0 end-0 p-3" id="modals"></div>
    <script src="/static/js/popper.min.js"></script>
    <script src="/static/js/bootstrap.min.js"></script>
    <script src="/static/js/application.js"></script>
  </body>
</html>
)";

}

namespace handlers::get {
View::View(const userver::components::ComponentConfig& config,
           const userver::components::ComponentContext& component_context)
    : HttpHandlerBase(config, component_context) {}
std::string View::HandleRequestThrow(
    const userver::server::http::HttpRequest& request,
    userver::server::request::RequestContext&) const {
  return response_template;
}
}  // namespace handlers::get