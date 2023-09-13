function curry(func) {
  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      return function(...args2) {
        return curried.apply(this, args.concat(args2));
      }
    }
  };
}

const EntityListTemplate = {
  'code': 'Ok',
  'data': [
    {'id': 'e3e70682-c209-4cac-a29f-6fbed82c07cd', 'title': 'David Dixon'},
    {'id': 'd3fbf47a-7e5b-4e7f-9ca5-499d004ae545', 'title': 'Sarah Jacobson'},
    {'id': 'f6be1f72-3405-495c-8a50-06c1ec188efb', 'title': 'Kimberly Roberts'},
  ]
};


const SchemaTempate = {
  'title': 'Test bookstore',
  'tables': [
    {
      'title': 'First table',
      'entity': true,
      'columns': [],
    },
    {
      'title': 'Second table',
      'entity': true,
      'columns': [],
    },
    {
      'title': 'Connection table',
      'entity': false,
      'columns': [],
    },
    {
      'title': 'Third table',
      'entity': true,
      'columns': [],
    },

  ],
  'scripts': [
    {
      'title': 'All books',
      'description': 'Get all books from schema',
      'code': 'SELECT title FROM books'
    },
    {
      'title': 'Sell all',
      'description': 'Remove all data for sale',
      'code': 'DELETE * FROM sales'
    }
  ]
};

const StandartWidth = ['col-8', 'mx-auto'];


function createTopBar() {
  let bar = document.createElement('div');
  bar.classList.add('text-start', ...StandartWidth);

  let home_button = document.createElement('button');
  home_button.classList.add('btn', 'btn-secondary', 'py-0', 'px-2');
  home_button.onclick = function() {
    (new Application()).render_schema();
  };
  home_button.textContent = '⌂ Home';
  bar.appendChild(home_button);
  return bar;
}

async function getEntityList(entity, page) {
  let response = await fetch(
      `api/entity/${entity}?` + new URLSearchParams({'page': page}));
  if (response.ok) {
    let json = await response.json();
    if (json.code != 'Ok') {
      new Application().render_error(json.code || 'Uncaught');
      return EntityListTemplate;
    } else {
      return json;
    }
  } else {
    new Application().render_error(response.error || 'Uncaught');
    return EntityListTemplate;
  }
}


function createEntityListContainer(data, entity) {
  let container = document.createElement('tr');

  let id_container = document.createElement('td');
  id_container.textContent = data.id;
  let human_readable_container = document.createElement('td');
  human_readable_container.textContent = data?.title || data?.name;
  let actions_container = document.createElement('td');
  actions_container.classList.add('text-end');

  // let edit_button = document.createElement('button');
  // edit_button.classList.add('btn', 'btn-secondary', 'btn-sm', 'ms-4');
  // edit_button.textContent = 'Edit';

  let delete_button = document.createElement('button');
  delete_button.classList.add('btn', 'btn-danger', 'btn-sm', 'ms-4');
  delete_button.textContent = 'Delete';

  delete_button.onclick = async (event) => {
    event.stopPropagation();
    await fetch(`api/entity/${entity}/${data.id}/`, {
      method: 'DELETE'
    }).then((response) => response.json().then(data => {
      if (data.code == 'Ok') {
        event.target.parentNode.parentNode.remove();
      } else {
        (new Application).render_error(data.code);
      }
    }));
  };

  // actions_container.appendChild(edit_button);
  actions_container.appendChild(delete_button);

  container.appendChild(id_container);
  container.appendChild(human_readable_container);
  container.appendChild(actions_container);

  container.onclick = async (event) => {
    event.stopPropagation();
    await fetch(`api/entity/${entity}/${data.id}/`, {
      method: 'GET'
    }).then((response) => response.json().then(data => {
      if (data.code == 'Ok') {
        const options = {};
        const ent = data.data[0];
        document.getElementById('staticBackdropLabel').textContent =
            entity + ': ' + ent.id;
        let bod = document.getElementById('staticBackdropContent');
        bod.textContent = '';
        for (var key in ent) {
          let c = document.createElement('div');
          c.classList.add('card', 'card-body', 'mb-3');
          c.textContent = key + ': ' + ent[key]
          bod.appendChild(c);
        }
        const myModalAlternative =
            new bootstrap.Modal('#staticBackdrop', options);
        myModalAlternative.show();
      } else {
        (new Application).render_error(data.code);
      }
    }));
  };


  return container;
}

async function createEntitySection(entity, page = 0) {
  let container = document.createElement('div');
  container.classList.add(...StandartWidth);

  let data = await getEntityList(entity, page);

  let table = document.createElement('table');
  table.classList.add('table', 'table-hover', 'align-middle');

  let thead = document.createElement('thead');

  let tr_h = document.createElement('tr');
  let id_h = document.createElement('th');
  id_h.textContent = 'id';
  id_h.classList.add('w-25');
  let hr_h = document.createElement('th');
  hr_h.textContent = 'human-readabale';
  let ac_h = document.createElement('th');
  ac_h.textContent = 'actions';
  ac_h.classList.add('me-4', 'text-end');
  tr_h.appendChild(id_h);
  tr_h.appendChild(hr_h);
  tr_h.appendChild(ac_h);
  thead.appendChild(tr_h);
  table.appendChild(thead);

  let tbody = document.createElement('tbody');
  for (const item of data.data) {
    tbody.appendChild(createEntityListContainer(item, entity));
  }
  table.appendChild(tbody);

  let next_link = document.createElement('button');
  next_link.innerText = '>';
  next_link.onclick = async () => {
    const section = await createEntitySection(entity, page + 1);
    container.parentNode.appendChild(section);
    container.remove();
  };

  container.appendChild(table);

  if (page > 0) {
    let prev_link = document.createElement('button');
    prev_link.innerText = '<';
    prev_link.onclick = async () => {
      const section = await createEntitySection(entity, page - 1);
      container.parentNode.appendChild(section);
      container.remove();
    };
    container.appendChild(prev_link);
  }

  let pager = document.createElement('p');
  pager.innerText = 'Page: ' + (page + 1);
  container.appendChild(pager);

  if (data.data.length == 100) {
    container.appendChild(next_link);
  }


  return container;
}

async function runCreation(event) {
  event.stopPropagation();
  const entity = document.getElementById('EntityLabel').textContent.toLowerCase();
  const data = (new Application).schema.tables.filter((v)=>{return v.title == entity})[0];
  const options = {};
  document.getElementById('staticBackdropLabel').textContent =
      entity + ': Creation';
  let bod = document.getElementById('staticBackdropContent');
  bod.textContent = '';
  for (var column of data.columns){
    let inp = document.createElement('input');
    inp.classList.add('form-control');
    inp.value = column.title;
    inp.required = !column.nullable;
    bod.appendChild(inp);
  }
  const myModalAlternative = new bootstrap.Modal('#staticBackdrop', options);
  myModalAlternative.show();
}

async function createEntitySpace(schema, entity_title) {
  for (let entity of schema.tables) {
    if (entity.title == entity_title) {
      var entity_data = entity;
    }
  }

  let container = document.createElement('div');

  let top_bar = createTopBar();
  container.appendChild(top_bar);

  let entity_name = document.createElement('h2');
  entity_name.textContent =
      entity_title.charAt(0).toUpperCase() + entity_title.slice(1);
  entity_name.id = 'EntityLabel';
  entity_name.classList.add('my-3');
  container.appendChild(entity_name);

  let new_btn = document.createElement('button');
  new_btn.classList.add(
      'ms-auto', 'w-auto', 'btn', 'btn-secondary', ...StandartWidth);
  new_btn.onclick = runCreation;
  new_btn.textContent = '+ New';
  container.appendChild(new_btn);

  let entity_counter = document.createElement('h6');
  entity_counter.classList.add('text-end', ...StandartWidth);
  entity_counter.textContent = 'Rows number: ' + entity_data.rows_number;
  container.appendChild(entity_counter);


  var entity_section = await createEntitySection(entity_title);

  container.appendChild(entity_section);

  return container;
}

function createEntityContainer(entity) {
  if (!entity.entity) {
    return null;
  }
  let entity_container = document.createElement('div');
  entity_container.classList.add('list-group-item', 'btn', 'btn-light');
  entity_container.textContent = entity.title;
  entity_container.onclick = function() {
    (new Application()).render_entity(entity.title);
  };
  return entity_container;
}

function createSection(title, elementGenerator, list) {
  let container = document.createElement('div');
  container.classList.add('my-2');

  let header = document.createElement('h3');
  header.textContent = title;
  container.appendChild(header);

  let card = document.createElement('div');
  card.classList.add('card', 'col-3', 'mx-auto');

  let _list = document.createElement('div');
  _list.classList.add(
      'list-group',
      'list-group-flush',
  );

  for (let item of list) {
    let generated_item = elementGenerator(item);
    if (generated_item) _list.appendChild(generated_item);
  }

  card.appendChild(_list);
  container.appendChild(card);

  return container;
}

function createEntitiesSection(tables) {
  return createSection('Entities', createEntityContainer, tables);
}

function createScriptContainer(script) {
  let script_container = document.createElement('div');
  script_container.classList.add('list-group-item', 'btn', 'btn-light');
  script_container.textContent = script.title;
  return script_container;
}

function createScriptsSection(scripts) {
  return createSection('Scripts', createScriptContainer, scripts);
}

function createConsoleContainer(item) {
  let entity_container = document.createElement('div');
  entity_container.classList.add('list-group-item', 'btn', 'btn-light');
  entity_container.textContent = 'Run console';
  return entity_container;
}

function createConsoleSection() {
  return createSection('Console', createConsoleContainer, ['console']);
}

function createMenu(schema) {
  let main_container = document.createElement('div');
  let top_header = document.createElement('h1');
  top_header.textContent = schema.title;
  main_container.appendChild(top_header);
  let entities_section = createEntitiesSection(schema.tables);
  main_container.appendChild(entities_section);
  let scripts_section = createScriptsSection(schema.scripts);
  main_container.appendChild(scripts_section);
  let console_section = createConsoleSection();
  main_container.appendChild(console_section);
  return main_container;
}


class Application {
  constructor() {
    if (Application._instance) {
      return Application._instance;
    }
    Application._instance = this;

    document.body.style.fontFamily = 'monospace';
    this.frame = document.getElementById('main');
    this.toaster = document.getElementById('toaster');
    this.prev_state = [];
    this.update_schema().finally(() => {
      this.render_schema();
    });
  };

  update_schema =
      function() {
    return fetch('/api/schema')
        .then(response => response.json())
        .then(data => {this.schema = data})
        .catch(error => {
          this.render_error(error);
          this.schema = SchemaTempate;
        });
  }


  render_error =
      function(error) {
    let toast = document.createElement('div');
    toast.classList.add('toast');
    toast.role = 'alert';
    toast.ariaLive = 'assertive';
    toast.ariaAtomic = true;

    let toast_header = document.createElement('div');
    toast_header.classList.add('toast-header', 'bg-warning');

    let toast_strong = document.createElement('strong');
    toast_strong.classList.add('me-auto');
    toast_strong.textContent = 'Error';
    toast_header.appendChild(toast_strong);

    let close_btn = document.createElement('button');
    close_btn.type = 'button';
    close_btn.classList.add('btn-close');
    close_btn.ariaLabel = 'Close';
    close_btn.setAttribute('data-bs-dismiss', 'toast');
    toast_header.appendChild(close_btn);

    let toast_body = document.createElement('div');
    toast_body.classList.add('toast-body');
    toast_body.textContent = error.toString();

    toast.appendChild(toast_header);
    toast.appendChild(toast_body);

    let cached_toast = new bootstrap.Toast(
        toast, {animation: true, autohide: true, delay: 5000});
    toaster.appendChild(toast);
    cached_toast.show()
  }

  render_entity =
      async function(entity_title) {
    let main_container = await createEntitySpace(this.schema, entity_title);
    this.frame.innerText = '';
    this.frame.appendChild(main_container);
    this.prev_state.push([this.render_entity, entity_title]);
  }

  render_schema = function() {
    let main_continer = createMenu(this.schema);
    this.frame.innerText = '';
    this.frame.appendChild(main_continer);
    this.prev_state.push(this.render_schema);
  }
}

let app = new Application();
