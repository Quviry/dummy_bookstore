#pragma once

#include <string>

#include <userver/formats/json/value.hpp>

using namespace userver;

namespace dummy_bookstore::models {

class Query {
  formats::json::Value schema;

 public:
  std::string name;
  std::string description;
  std::string script;
  const formats::json::Value GetSchema() const;
};
}  // namespace dummy_bookstore::models