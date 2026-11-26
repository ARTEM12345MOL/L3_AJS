function fetchJsonPromise(path) {
    return fetch(`https://jsonplaceholder.typicode.com${path}`).then((response) => {
        if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
        return response.json();
    });
}

function getUsersPromise() {
    return fetchJsonPromise('/users').then((users) => users.map((user) => ({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
    })));
}

function getTodosPromise() {
    return fetchJsonPromise('/todos').then((todos) => todos.filter((todo) => !todo.completed));
}

getUsersPromise()
    .then((users) => console.log(`Promise /users — ${users.length} записей`, users.slice(0, 3)))
    .catch(console.error);

getTodosPromise()
    .then((todos) => console.log(`Promise /todos — ${todos.length} записей`, todos.slice(0, 3)))
    .catch(console.error);
