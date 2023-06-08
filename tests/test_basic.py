import pytest

from testsuite.databases import pgsql


# Start the tests via `make test-debug` or `make test-release`


async def test_ping(service_client):
    response = await service_client.get(
        '/ping',
    )
    assert response.status == 200


async def test_root(service_client):
    response = await service_client.get('/')
    assert response.status == 200
    assert "html" in response.text


async def test_static(service_client):
    response = await service_client.get('/static/js/application.js')
    assert response.status == 200


async def test_schema(service_client):
    response = await service_client.get('/api/schema')
    assert response.status == 200


@pytest.mark.parametrize(
    ('entity'), ['books', 'authors', 'addresses', 'cycles', 'genres', 'positions',
                 'serias', 'customers', 'employees', 'orders', 'publishers', 'warehouses']
)
async def test_entity(service_client, entity):
    response = await service_client.get(f'/api/entity/{entity}')
    assert response.status == 200
