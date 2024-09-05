## Docker 部署 README

欢迎使用新的 `docker` 目录来通过 Docker Compose 部署 Dify。本 README 概述了更新内容、部署说明以及现有用户的迁移细节。

### 更新内容
- **持久化环境变量**：环境变量现在通过 `.env` 文件进行管理，确保配置在不同部署之间持久化。

   > 什么是 `.env`？ </br> </br>
   > `.env` 文件是 Docker 和 Docker Compose 环境中的一个关键组件，作为一个集中配置文件，您可以在其中定义在容器运行时可访问的环境变量。这个文件简化了环境设置在开发、测试和生产不同阶段的管理，为部署提供了配置的一致性和便利性。

- **统一向量数据库服务**：所有向量数据库服务现在通过一个 `docker-compose.yaml` 文件进行管理。您可以通过在 `.env` 文件中设置 `VECTOR_STORE` 环境变量来切换不同的向量数据库。
- **必需的 .env 文件**：现在运行 `docker compose up` 需要一个 `.env` 文件。这个文件对于配置您的部署和任何自定义设置在升级过程中持久化至关重要。
- **遗留支持**：之前的部署文件现在位于 `docker-legacy` 目录中，不再维护。

### 如何使用 `docker-compose.yaml` 部署 Dify
1. **先决条件**：确保您的系统上安装了 Docker 和 Docker Compose。
2. **环境设置**：
   - 导航到 `docker` 目录。
   - 通过运行 `cp .env.example .env` 将 `.env.example` 文件复制到一个新文件 `.env`。
   - 根据需要自定义 `.env` 文件。参考 `.env.example` 文件获取详细的配置选项。
3. **运行服务**：
   - 从 `docker` 目录执行 `docker compose up` 启动服务。
   - 要指定一个向量数据库，在您的 `.env` 文件中设置 `VECTOR_store` 变量为所需的向量数据库服务，例如 `milvus`、`weaviate` 或 `opensearch`。

### 如何为开发 Dify 部署中间件
1. **中间件设置**：
   - 使用 `docker-compose.middleware.yaml` 设置必要的数据库和缓存等中间件服务。
   - 导航到 `docker` 目录。
   - 确保通过运行 `cp middleware.env.example middleware.env` 创建 `middleware.env` 文件（参考 `middleware.env.example` 文件）。
2. **运行中间件服务**：
   - 执行 `docker-compose -f docker-compose.middleware.yaml up -d` 启动中间件服务。

### 现有用户的迁移
对于从 `docker-legacy` 设置迁移的用户：
1. **审查更改**：熟悉新的 `.env` 配置和 Docker Compose 设置。
2. **转移自定义配置**：
   - 如果您有自定义配置，如 `docker-compose.yaml`、`ssrf_proxy/squid.conf` 或 `nginx/conf.d/default.conf`，您需要在创建的 `.env` 文件中反映这些更改。
3. **数据迁移**：
   - 确保数据库和缓存等服务的数据已备份并适当地迁移到新结构（如果必要）。

### `.env` 概述

#### 关键模块和自定义

- **向量数据库服务**：根据使用的向量数据库类型（`VECTOR_STORE`），用户可以设置特定的端点、端口和认证细节。
- **存储服务**：根据存储类型（`STORAGE_TYPE`），用户可以为 S3、Azure Blob、Google Storage 等配置特定设置。
- **API 和 Web 服务**：用户可以定义影响 API 和 Web 前端操作的 URL 和其他设置。

#### 其他值得注意的变量
提供的 `.env.example` 文件在 Docker 设置中非常广泛，涵盖了广泛的配置选项。它被分为几个部分，每个部分涉及应用程序及其服务的不同方面。以下是一些关键部分和变量：

1. **通用变量**：
   - `CONSOLE_API_URL`、`SERVICE_API_URL`：不同 API 服务的 URL。
   - `APP_WEB_URL`：前端应用程序 URL。
   - `FILES_URL`：文件下载和预览的基本 URL。

2. **服务器配置**：
   - `LOG_LEVEL`、`DEBUG`、`FLASK_DEBUG`：日志和调试设置。
   - `SECRET_KEY`：用于加密会话 cookie 和其他敏感数据的密钥。

3. **数据库配置**：
   - `DB_USERNAME`、`DB_PASSWORD`、`DB_HOST`、`DB_PORT`、`DB_DATABASE`：PostgreSQL 数据库凭证和连接细节。

4. **Redis 配置**：
   - `REDIS_HOST`、`REDIS_PORT`、`REDIS_PASSWORD`：Redis 服务器连接设置。

5. **Celery 配置**：
   - `CELERY_BROKER_URL`：Celery 消息代理的配置。

6. **存储配置**：
   - `STORAGE_TYPE`、`S3_BUCKET_NAME`、`AZURE_BLOB_ACCOUNT_NAME`：文件存储选项（如本地、S3、Azure Blob 等）的设置。

7. **向量数据库配置**：
   - `VECTOR_STORE`：向量数据库类型（例如 `weaviate`、`milvus`）。
   - 每个向量存储的特定设置，如 `WEAVIATE_ENDPOINT`、`MILVUS_HOST`。

8. **CORS 配置**：
   - `WEB_API_CORS_ALLOW_ORIGINS`、`CONSOLE_CORS_ALLOW_ORIGINS`：跨域资源共享设置。

9. **其他服务特定的环境变量**：
   - 每个服务（如 `nginx`、`redis`、`db` 和向量数据库）都有直接在 `docker-compose.yaml` 中引用的特定环境变量。

### 附加信息
- **持续改进阶段**：我们正在积极寻求社区反馈，以完善和增强部署过程。随着更多用户采用这种方法，我们将继续根据您的经验和建议进行改进。
- **支持**：有关详细的配置选项和环境变量设置，请参考 `.env.example` 文件和 `docker` 目录中的 Docker Compose 配置文件。

本 README 旨在指导您使用新的 Docker Compose 设置进行部署。如有任何问题或需要进一步帮助，请参考官方文档或联系支持。
