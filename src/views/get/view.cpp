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
    <div id="main" class="text-center align-self-center my-4">Hello, loading!</div>
    <div class="toast-container position-fixed bottom-0 end-0 p-3" id="toaster"></div>
    <div class="toast-container position-fixed bottom-0 end-0 p-3" id="modals">
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" id="staticBackdropContent">
            ...
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    </div>
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
    const userver::server::http::HttpRequest&,
    userver::server::request::RequestContext&) const {
  return response_template;
}
}  // namespace handlers::get