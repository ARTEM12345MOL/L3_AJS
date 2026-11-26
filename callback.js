function requestWithCallback(path, callback) {
    const request = new XMLHttpRequest();
    request.open('GET', `https://jsonplaceholder.typicode.com${path}`);
    request.responseType = 'json';
    request.timeout = 15000;

    request.onload = () => {
        if (request.status !== 200 || !Array.isArray(request.response)) {
            callback(new Error(`${path}: некорректный ответ, HTTP ${request.status}`));
            return;
        }
        callback(null, request.response);
    };
    request.onerror = () => callback(new Error(`${path}: ошибка сети`));
    request.ontimeout = () => callback(new Error(`${path}: истекло время ожидания`));
    request.send();
}

function getPostsCallback(callback) {
    requestWithCallback('/posts', (error, posts) => {
        if (error) return callback(error);
        const sorted = posts.sort((a, b) => b.title.length - a.title.length);
        callback(null, sorted);
    });
}

function getCommentsCallback(callback) {
    requestWithCallback('/comments', (error, comments) => {
        if (error) return callback(error);
        const sorted = comments.sort((a, b) => a.name.localeCompare(b.name, 'en'));
        callback(null, sorted);
    });
}

function showEventLoop(log = console.log) {
    log('Начало синхронного кода');
    setTimeout(() => log('Задача таймера setTimeout'), 0);
    Promise.resolve().then(() => log('Микрозадача Promise.then'));
    queueMicrotask(() => log('Микрозадача queueMicrotask'));
    log('Конец синхронного кода');
}

function showCallbackResult(label) {
    return (error, items) => {
        if (error) {
            console.error(error);
            return;
        }
        console.log(`${label} — ${items.length} записей`, items.slice(0, 3));
    };
}

showEventLoop();
getPostsCallback(showCallbackResult('Callback /posts'));
getCommentsCallback(showCallbackResult('Callback /comments'));
