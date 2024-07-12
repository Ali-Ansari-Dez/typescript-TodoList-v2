type Filter = 'All' | 'Done' | 'Todo';

interface TodoItem {
  id: number;
  title: string;
  done: boolean;
}

interface State {
  latestID: number;
  todos: ReadonlyArray<TodoItem>;
  selectedFilter: Filter;
}
const useState = (state:State) => {
  let internalState=state;
  const setState = (fn: (state: State) => State) => {
    internalState = fn(internalState);
    draw(internalState);
  };
  draw(internalState)
  return [internalState, setState] as const

}
const [internalState, setState]= useState({
  latestID: 0,
  todos: [ ],
  selectedFilter: 'All',
});

const toggleTodo = (id: number) => {
  setState((state) => ({
    ...state,
    todos: state.todos.map((x) => (x.id === id ? { ...x, done: !x.done } : x)),
  }));
};
const addTodo = (todo: string) => {
  setState((state)=> ({
    ...state,
    latestID: state.latestID + 1,
    todos: [
      ...state.todos,
      { id: state.latestID + 1, title: todo, done: false },
    ],
  }));
};

const setSelectedFilter = (filter: Filter) => {
  setState((state) => ({
    ...state,
    selectedFilter: filter,
  }));
};

function draw(state: State) {
  const app = document.getElementById('app');
  if (app === null) {
    throw new Error('you should have a div with an "app" ID');
  }
  [...app.children].forEach((x) => {
    app.removeChild(x);
  });

  const form = document.createElement('form');
  const input = document.createElement('input');
  input.placeholder = 'enter new Task :)';

  const submit = createButton('add todo');

  form.append(input);
  form.append(submit);
  app.append(form);

  const ul = document.createElement('ul');
  state.todos
    .filter((todoItem): boolean => {
      switch (state.selectedFilter) {
        case 'All':
          return true;
        case 'Done':
          return todoItem.done;
        case 'Todo':
          return !todoItem.done;
      }
    })
    .map((todoItem) => {
      const li = document.createElement('li');
      const text = document.createTextNode(todoItem.title);
      li.append(text);
      li.style.cursor = 'pointer';
      li.style.textDecoration = todoItem.done ? 'line-through' : 'none';
      li.addEventListener('click', () => {
        toggleTodo(todoItem.id);
      });
      return li;
    })
    .forEach((x) => {
      ul.append(x);
    });
  app.append(ul);
  function createButton(str: string) {
    const button = document.createElement('button');
    const buttonText = document.createTextNode(str);
    button.append(buttonText);
    return button;
  }

  form.addEventListener('submit', (Event) => {
    Event.preventDefault();
    addTodo(input.value);
    input.value = '';
  });
  const filterContainer = document.createElement('div');

  const setSelectedButton = (button: HTMLButtonElement) => {
    button.style.backgroundColor = 'white';
    button.style.border = 'none';
  };
 

  function createFilterButton(title: string) {
    const button = createButton(title);
    button.style.backgroundColor = '#d6d6d6';
    button.style.border = '1px solid black';
    return button;
  }
  const todoButton = createFilterButton('Todo');
  const allButton = createFilterButton('All');
  const doneButoon = createFilterButton('Done');

  todoButton.addEventListener('click', () => {
    setSelectedFilter('Todo');
  });
  allButton.addEventListener('click', () => {
    setSelectedFilter('All');
  });
  doneButoon.addEventListener('click', () => {
    setSelectedFilter('Done');
  });
  switch (state.selectedFilter) {
    case 'All':
      setSelectedButton(allButton);
      break;
    case 'Done':
      setSelectedButton(doneButoon);
      break;
    case 'Todo':
      setSelectedButton(todoButton);
      break;
  }

  filterContainer.append(allButton);
  filterContainer.append(todoButton);
  filterContainer.append(doneButoon);
  app.append(filterContainer);
}
