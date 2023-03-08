# NTEPP 💾
- Node
- TypeScript
- Express
- Postgres
- Prisma
## Routing

### Auth 🔐
| Method     | Endpoint                        | Description                 | Auth (JWT) | Body                                            |
|------------|---------------------------------|-----------------------------|------------|-------------------------------------------------|
| POST       | `/api/v1/auth/register`         | Register new users.         | ❌         | { "username": "", "email": "", "password":"" }  |
| POST       | `/api/v1/auth/login`            | Auth by credentials.        | ❌         | { "username": "", "password": "" }              |
| GET        | `/api/v1/auth/renew`            | Auth by JWT.                | ✔          | -                                               |
| GET        | `/api/v1/auth/logout`           | Logout account.             | ✔          | -                                               |

### Tasks 📃
| Method     | Endpoint                        | Description                 | Auth (JWT) | Body                                                   |
|------------|---------------------------------|-----------------------------|------------|--------------------------------------------------------|
| GET        | `/api/v1/tasks/get`             | Get tasks.                  | ✔          | -                                                      |
| POST       | `/api/v1/tasks/create`          | Create new task.            | ✔          | { "title": "", "description": "" }                     |
| PUT        | `/api/v1/tasks/update/:id`      | Edit an existing task.      | ✔          | { "title": "", "description": "", "completed": true }  |
| DELETE     | `/api/v1/tasks/delete/:id`      | Delete an existing task.    | ✔          | -                                                      |

### User 🧔
| Method     | Endpoint                        | Description                 | Auth (JWT) | Body                                            |
|------------|---------------------------------|-----------------------------|------------|-------------------------------------------------|
| POST       | `/api/v1/user/updateInfo`       | Update user info.           | ✔          | { "username": "", "email": "" }                 |
| POST       | `/api/v1/user/changePassword`   | Update password.            | ✔          | { "password": "", "newPassword": "" }           |