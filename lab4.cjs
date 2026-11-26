const https = require('node:https');

const apiUrl = 'https://jsonplaceholder.typicode.com';

function getJson(path, callback) {
    let finished = false;

    function finish(error, data) {
        if (finished) return;
        finished = true;
        callback(error, data);
    }

    const request = https.get(`${apiUrl}${path}`, (response) => {
        response.on('error', finish);

        if (response.statusCode !== 200) {
            response.resume();
            finish(new Error(`${path}: HTTP ${response.statusCode}`));
            return;
        }

        let body = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
            body += chunk;
        });
        response.on('end', () => {
            let data;
            try {
                data = JSON.parse(body);
            } catch (error) {
                finish(error);
                return;
            }
            finish(null, data);
        });
    });

    request.on('error', finish);
    request.setTimeout(10000, () => {
        request.destroy(new Error(`${path}: request timed out`));
    });
}

function getJsonPromise(path) {
    return new Promise((resolve, reject) => {
        getJson(path, (error, data) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(data);
        });
    });
}

function sortPostsByTitleLength(posts) {
    return [...posts].sort((a, b) => b.title.length - a.title.length);
}

function sortCommentsByName(comments) {
    return [...comments].sort((a, b) => a.name.localeCompare(b.name, 'en'));
}

function selectUserFields(users) {
    return users.map(({ id, name, username, email, phone }) => ({
        id, name, username, email, phone,
    }));
}

function filterIncompleteTodos(todos) {
    return todos.filter((todo) => !todo.completed);
}

// Коллбэки
function getPostsCallback(callback) {
    getJson('/posts', (error, posts) => {
        if (error) {
            callback(error);
            return;
        }
        callback(null, sortPostsByTitleLength(posts));
    });
}

function getCommentsCallback(callback) {
    getJson('/comments', (error, comments) => {
        if (error) {
            callback(error);
            return;
        }
        callback(null, sortCommentsByName(comments));
    });
}

// Промисы
function getUsersPromise() {
    return getJsonPromise('/users').then(selectUserFields);
}

function getTodosPromise() {
    return getJsonPromise('/todos').then(filterIncompleteTodos);
}

// Async/await
async function getPostsAsync() {
    const posts = await getJsonPromise('/posts');
    return sortPostsByTitleLength(posts);
}

async function getCommentsAsync() {
    const comments = await getJsonPromise('/comments');
    return sortCommentsByName(comments);
}

async function getUsersAsync() {
    const users = await getJsonPromise('/users');
    return selectUserFields(users);
}

async function getTodosAsync() {
    const todos = await getJsonPromise('/todos');
    return filterIncompleteTodos(todos);
}

function showResult(label, items) {
    console.log(`\n${label} — ${items.length} записей, первые три:`);
    console.dir(items.slice(0, 3));
}

function showError(error) {
    console.error(error.message);
    process.exitCode = 1;
}

function showCallbackResult(label) {
    return (error, items) => {
        if (error) {
            showError(error);
            return;
        }
        showResult(label, items);
    };
}

async function showAsyncResults() {
    showResult('Async/await /posts', await getPostsAsync());
    showResult('Async/await /comments', await getCommentsAsync());
    showResult('Async/await /users', await getUsersAsync());
    showResult('Async/await /todos', await getTodosAsync());
}

if (require.main === module) {
    getPostsCallback(showCallbackResult('Callback /posts'));
    getCommentsCallback(showCallbackResult('Callback /comments'));
    getUsersPromise().then((users) => showResult('Promise /users', users)).catch(showError);
    getTodosPromise().then((todos) => showResult('Promise /todos', todos)).catch(showError);
    showAsyncResults().catch(showError);
}

module.exports = {
    getPostsCallback,
    getCommentsCallback,
    getUsersPromise,
    getTodosPromise,
    getPostsAsync,
    getCommentsAsync,
    getUsersAsync,
    getTodosAsync,
};
