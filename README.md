<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" />
  </a>
</p>

<p align="center">
A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.
</p>

<p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
</p>

---

# 📦 Project Overview

This repository contains a NestJS backend API powered by:
- ⛓ TypeScript
- 🏗 TypeORM + migrations
- 📦 PostgreSQL database
- 🌱 Seed scripts
- 🧪 Jest for unit testing
- 📘 Swagger API documentation
- 🐳 Docker ready

It is designed to be modular, scalable, and developer-friendly.

---

# 🚀 Getting Started

### Start database services & install dependencies
Make sure Docker Desktop is running, then execute:
```bash
docker-compose up -d
npm install
```

### Configure environment
Copy `.env.example` to `.env` and adjust:
```bash
cp .env.example .env
```

---

# 🛢 Database Setup

### Run migrations
```bash
npm run migration:run
```

### Seed initial required data
```bash
npm run seed:run
```

---

# ▶️ Run Application

### Development
```bash
npm run start:dev
```

### Watch mode
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

---

# 📘 API Documentation (Swagger)

Open in browser after server starts:

👉 **http://localhost:3000/docs**

<img width="1884" height="703" alt="image" src="https://github.com/user-attachments/assets/f3a49aaf-1253-412e-be24-3507065660e1" />

---

# 🧪 Testing

Run test suites:
```bash
npm run test
```

Watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:cov
```

# 🤝 Contribution Guide

1. Fork this repo
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit following conventional commits
4. Push and open a Pull Request 🎉

---

# ❤️ Powered by NestJS

Visit:
- 🌐 https://nestjs.com
- 🐦 https://twitter.com/nestframework
- 💬 https://discord.gg/G7Qnnhy

---

# 📜 License

MIT License.  
See the `LICENSE` file for details.
