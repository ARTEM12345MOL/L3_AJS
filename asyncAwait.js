async function fetchJsonAsync(path) {
    const response = await fetch(`https://jsonplaceholder.typicode.com${path}`);
    if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
    return response.json();
}

async function getPostsAsync() {
    const posts = await fetchJsonAsync('/posts');
    return posts.sort((a, b) => b.title.length - a.title.length);
}

async function getCommentsAsync() {
    const comments = await fetchJsonAsync('/comments');
    return comments.sort((a, b) => a.name.localeCompare(b.name, 'en'));
}

async function getUsersAsync() {
    const users = await fetchJsonAsync('/users');
    return users.map(({ id, name, username, email, phone }) => ({
        id, name, username, email, phone,
    }));
}

async function getTodosAsync() {
    const todos = await fetchJsonAsync('/todos');
    return todos.filter((todo) => !todo.completed);
}

async function showAsyncResults() {
    const [posts, comments, users, todos] = await Promise.all([
        getPostsAsync(), getCommentsAsync(), getUsersAsync(), getTodosAsync(),
    ]);

    console.log(`Async/await /posts — ${posts.length} записей`, posts.slice(0, 3));
    console.log(`Async/await /comments — ${comments.length} записей`, comments.slice(0, 3));
    console.log(`Async/await /users — ${users.length} записей`, users.slice(0, 3));
    console.log(`Async/await /todos — ${todos.length} записей`, todos.slice(0, 3));
}

showAsyncResults().catch(console.error);
