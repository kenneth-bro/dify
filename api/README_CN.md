# Dify 后端 API

## 使用方法

> [!IMPORTANT]
> 在 v0.6.12 版本中，我们弃用了 `pip` 作为 Dify API 后端服务的包管理工具，并替换为 `poetry`。

1. 启动 docker-compose 堆栈

   后端需要一些中间件，包括 PostgreSQL、Redis 和 Weaviate，这些可以通过 `docker-compose` 一起启动。

   ```bash
   cd ../docker
   cp middleware.env.example middleware.env
   # 如果你不使用 weaviate，请将配置文件更改为其他向量数据库
   docker compose -f docker-compose.middleware.yaml --profile weaviate -p dify up -d
   cd ../api
   ```

2. 将 `.env.example` 复制到 `.env`
3. 在 `.env` 文件中生成一个 `SECRET_KEY`。

   ```bash for Linux
   sed -i "/^SECRET_KEY=/c\SECRET_KEY=$(openssl rand -base64 42)" .env
   ```

   ```bash for Mac
   secret_key=$(openssl rand -base64 42)
   sed -i '' "/^SECRET_KEY=/c\
   SECRET_KEY=${secret_key}" .env
   ```

4. 创建环境。

   Dify API 服务使用 [Poetry](https://python-poetry.org/docs/) 来管理依赖项。你可以执行 `poetry shell` 来激活环境。

5. 安装依赖项

   ```bash
   poetry env use 3.10
   poetry install
   ```

   如果贡献者未能更新 `pyproject.toml` 的依赖项，你可以执行以下 shell 命令。

   ```bash
   poetry shell                                               # 激活当前环境
   poetry add $(cat requirements.txt)           # 安装生产依赖项并更新 pyproject.toml
   poetry add $(cat requirements-dev.txt) --group dev    # 安装开发依赖项并更新 pyproject.toml
   ```

6. 运行迁移

   在首次启动前，将数据库迁移到最新版本。

   ```bash
   poetry run python -m flask db upgrade
   ```

7. 启动后端

   ```bash
   poetry run python -m flask run --host 0.0.0.0 --port=5001 --debug
   ```

8. 启动 Dify [web](../web) 服务。
9. 通过访问 `http://localhost:3000` 设置你的应用程序...
10. 如果你需要调试本地异步处理，请启动 worker 服务。

   ```bash
   poetry run python -m celery -A app.celery worker -P gevent -c 1 --loglevel INFO -Q dataset,generation,mail,ops_trace,app_deletion
   ```

   启动的 celery 应用程序处理异步任务，例如数据集导入和文档索引。

## 测试

1. 为后端和测试环境安装依赖项

   ```bash
   poetry install --with dev
   ```

2. 在 `pyproject.toml` 的 `tool.pytest_env` 部分中使用模拟的系统环境变量在本地运行测试

   ```bash
   cd ../
   poetry run -C api bash dev/pytest/pytest_all_tests.sh
   ```
