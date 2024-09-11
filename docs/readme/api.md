

# 目录结构

## 整体介绍

```
.idea: IntelliJ IDEA 的工作空间配置文件夹，包含了项目的结构、设置等信息。
.vscode: VSCode 的配置文件夹，可以包含如任务定义、扩展配置等。
configs: 配置文件存放目录。
constants: 常量定义文件存放目录。
contexts: 上下文相关的逻辑或数据存放目录。
controllers: 控制器代码存放目录。
core: 核心模块或库的存放目录。
docker: Docker 相关的配置文件，如 Dockerfile 或 docker-compose.yml。
events: 事件处理逻辑存放目录。
extensions: 扩展或插件存放目录。
fields: 字段定义或表单字段相关逻辑存放目录。
libs: 第三方库或自定义库的存放目录。
migrations: 数据库迁移文件存放目录。
models: 数据模型定义，常见于后端项目。
schedule: 定时任务相关逻辑存放目录。
services: 服务端代码或业务逻辑存放目录。
tasks: 任务相关逻辑存放目录。
templates: 模板文件存放目录，如 HTML 模板。
tests: 单元测试和集成测试文件存放目录。
.dockerignore: Docker 忽略文件列表，指定在构建 Docker 镜像时不需要复制到镜像中的文件或目录。
.env: 环境变量文件，用于存储项目的环境变量。
.env.example: 示例环境变量文件，用于指导如何设置 .env 文件。
app.py: 应用程序的主要入口文件。
commands.py: 命令行工具或自定义命令的定义文件。
Dockerfile: Docker 构建文件，定义如何构建 Docker 镜像。
poetry.lock: Poetry 的锁定文件，记录具体版本的依赖树。
poetry.toml: Poetry 的配置文件，定义项目的依赖和元数据。
pyproject.toml: Python 项目的配置文件，定义项目的依赖和构建工具。
README.md: 项目的 README 文件，介绍项目的基本信息。
README_CN.md: 项目的中文 README 文件，介绍项目的中文信息。
script.sql: SQL 脚本文件，用于数据库操作。
upgrade: 升级脚本或升级相关逻辑存放目录。
```

## Core

```
|- agent agent最终的运行函数
|-- cot_agent_runner agent运行
|-- cot_chat_agent_runner chat agent运行
|-- fc_agent_runner functionCall的agent运行（回调工具）

|- app
|-- apps
|---- agent_chat agent对话的配置生成
|------ app_generator
|------ app_runner 应用运行

|- callback_handler
|---- agent_tool_callback_handler.py 回调处理(工具调用日志打印等)

|- tools 工具
|-- tool
|---- tool_engine.py 工具运行引擎
|---- api_tool.py 工具请求

```



# 源码 路由文档地址

 > http://127.0.0.1:5001/docs/api


# config 添加配置方法
1. 在config中定义好变量（新建了一个ai-chat-report文件分组来装我们自己定义的系统参数）
```python
class LlmBaseUpdateInfoConfig(BaseSettings):
    LLM_BASE_UPDATE_INFO_URL: str = Field(
        description="模型更新信息地址",
        default="",
    )

```
2. 在env中为其赋值 (SettingsConfigDict就会将env中的变量赋值给config)
```angular2html
LLM_BASE_UPDATE_INFO_URL = https://aistock-retail.test.investoday.net/llm-base/task/update-agents-integrate
```

3. 使用方法
```angular2html

app.config.get("LLM_BASE_UPDATE_INFO_URL","")

```


# 接口添加方法
```python

# 路由：
# 参考：api/controllers/investoday/index.py

# 业务代码
# 参考： api/services/investoday/llm_cache_update.py

```

# post请求入参支持 body

