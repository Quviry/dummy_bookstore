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


function createTopBar() {
  let bar = document.createElement('div');

  let home_button = document.createElement('button');
  home_button.classList.add('btn');
  home_button.onclick = function() {
    (new Application()).render_schema();
  };
  home_button.textContent = 'Home';
  bar.appendChild(home_button);
  return bar;
}

function createEntitySection(entity){
    let container = document.createElement("div");
    return container;
}

function createEntitySpace(schema, entity_title) {
  let container = document.createElement('div');

  let top_bar = createTopBar();
  container.appendChild(top_bar);

  let entity_name = document.createElement("h2");
  entity_name.textContent = entity_title;
  container.appendChild(entity_name);

  for(let entity of schema.tables){
    if(entity.title == entity_title){
        let entity_section = createEntitySection(entity);
    }
  }

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
      'list-group', 'list-group-flush', );

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
          this.schema = {
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
      function(entity_title) {
    let main_container = createEntitySpace(this.schema, entity_title);
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
