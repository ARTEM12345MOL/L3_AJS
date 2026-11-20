# Лабораторная работа № 3. HTTP

В Postman выполнены GET-запросы по HTTPS к учебному REST API [JSONPlaceholder](https://jsonplaceholder.typicode.com/guide/). На скриншотах видны метод, адрес, HTTP-статус и тело ответа.

| Запрос | HTTP-статус | Скриншот |
| --- | --- | --- |
| `GET /users` | `200 OK` | [3A.jpg](3A.jpg) |
| `GET /posts` | `200 OK` | [3B.jpg](3B.jpg) |
| `GET /posts/504` | `404 Not Found` | [3C.jpg](3C.jpg) |
| `GET /comments` | `200 OK` | [3D.jpg](3D.jpg) |
| `GET /comments/13` | `200 OK` | [3E.jpg](3E.jpg) |

Идентификатор поста рассчитан по заданию: `491 + 13 = 504`. В JSONPlaceholder есть 100 постов, поэтому сервер вернул `404 Not Found` с телом `{}`. Для запроса комментария использован номер по журналу `13`. В ответе на `GET /comments/13` поле `id` равно `13`.
