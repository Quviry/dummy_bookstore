#pragma once

#include <string>
#include <unordered_set>

namespace models::entities {
const std::unordered_set<std::string> entities_list{
    "addresses", "authors", "books",     "customers",  "cycles", "employees",
    "genres",    "orders",  "positions", "publishers", "serias", "warehouses"};
}