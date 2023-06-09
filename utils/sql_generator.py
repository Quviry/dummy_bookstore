#!/bin/python3
import argparse
import pathlib
import os
from typing import List, Tuple

HEADERS = """// sql.hpp
#include <userver/storages/postgres/query.hpp>

// ATTENTION: FILE AUTOGENERATED  

"""
# const storages::postgres::Query kSelectMany{
#     "SELECT generate_series(1, 100)",
#     storages::postgres::Query::Name{"chaos_select_many"},
# };

# const storages::postgres::Query kSelectValue{
#     "SELECT value FROM key_value_table WHERE key=$1",
#     storages::postgres::Query::Name{"sample_select_value"},
# };


def to_constant_name(name: str) -> str:
    return 'k' + ''.join([word.capitalize() for word in name.split('_')])


def get_headers() -> str:
    return HEADERS

def to_raw_sql(lines: List[str]) -> Tuple[str, str]:
    code = ''
    comment = ''
    for line in lines:
        splitted = line.split(sep='--', maxsplit=1)
        code += splitted[0]
        comment += splitted[1] if len(splitted) != 1 else ''
    return code, comment

def to_statement(path: pathlib.Path):
    name = path.name[:-4]
    query_bracket_name = '{"' + name + '"}'
    query_name = f'storages::postgres::Query::Name{ query_bracket_name }'
    constant_name = to_constant_name(name)
    with open(path, 'r') as file:
        content, comment = to_raw_sql(file.readlines())
    if comment != '':
        comment = '//' + comment.strip().replace('\n', '\n//')
    type = 'const storages::postgres::Query'
    inter = "{"
    outer = "};"
    return f'\n{comment}\n{type} {constant_name + inter}R"({content})",{query_name + outer}'


def parse_sql(path: pathlib.Path) -> str:
    parsed = []
    for file in path.glob('**/*.sql'):
        parsed.append(to_statement(file))
    return '\n'.join(parsed) + '\n'


def is_sql_available(path: pathlib.Path) -> bool:
    if not path.is_dir():
        return False
    if 'sql' not in [_.name for _ in path.iterdir()]:
        return False
    sql_path = path / 'sql'
    if not sql_path.is_dir():
        return False
    return True


def write_hpp(path: pathlib.Path, source: str):
    file_name = path / 'sql.hpp'
    with open(file_name, 'w') as file:
        file.write(get_headers())
        file.write(source)


def main(args) -> None:
    path = pathlib.Path(args.path)
    if is_sql_available(path):
        hpp_source = parse_sql(path / 'sql')
        write_hpp(path, hpp_source)
    else:
        raise LookupError()


if __name__ == '__main__':
    parser = argparse.ArgumentParser("python3 sql_generator.py")
    parser.add_argument(
        '-p', '--path', help='Path to source files', type=str, default='./src', metavar='path', required=False)
    args = parser.parse_args()
    main(args)
