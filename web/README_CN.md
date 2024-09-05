# Dify 前端

这是一个使用 [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) 引导的 [Next.js](https://nextjs.org/) 项目。

## 开始

### 通过源代码运行

要启动 web 前端服务，你需要 [Node.js v18.x (LTS)](https://nodejs.org/en) 和 [NPM 版本 8.x.x](https://www.npmjs.com/) 或 [Yarn](https://yarnpkg.com/)。

首先，安装依赖项：

```bash
npm install
# 或者
yarn install --frozen-lockfile
```

然后，配置环境变量。在当前目录下创建一个名为 `.env.local` 的文件，并从 `.env.example` 复制内容。根据你的需求修改这些环境变量的值：

```
# 对于生产发布，将此改为 PRODUCTION
NEXT_PUBLIC_DEPLOY_ENV=DEVELOPMENT
# 部署版本，SELF_HOSTED
NEXT_PUBLIC_EDITION=SELF_HOSTED
# 控制台应用的基础 URL，如果控制台域名与 API 或 Web 应用域名不同，则指向 WEB 服务的控制台基础 URL。
# 示例：http://cloud.dify.ai/console/api
NEXT_PUBLIC_API_PREFIX=http://localhost:5001/console/api
# Web 应用的 URL，如果 Web 应用域名与控制台或 API 域名不同，则指向 WEB 服务的 Web 应用基础 URL。
# 示例：http://udify.app/api
NEXT_PUBLIC_PUBLIC_API_PREFIX=http://localhost:5001/api

# SENTRY
NEXT_PUBLIC_SENTRY_DSN=
```

最后，运行开发服务器：

```bash
npm run dev
# 或者
yarn dev
```

使用浏览器打开 [http://localhost:3000](http://localhost:3000) 查看结果。

你可以开始编辑 `app` 文件夹下的文件。页面会随着你编辑文件自动更新。

## 部署

### 在服务器上部署

首先，为生产构建应用：

```bash
npm run build
```

然后，启动服务器：

```bash
npm run start
```

如果你想自定义主机和端口：

```bash
npm run start --port=3001 --host=0.0.0.0
```

## 代码检查

如果你的 IDE 是 VSCode，将 `web/.vscode/settings.example.json` 重命名为 `web/.vscode/settings.json` 以进行代码检查设置。

## 测试

我们开始使用 [Jest](https://jestjs.io/) 和 [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) 进行单元测试。

你可以在要测试的文件旁边创建一个后缀为 `.spec` 的测试文件。例如，如果你想测试一个名为 `util.ts` 的文件。测试文件名应为 `util.spec.ts`。

运行测试：

```bash
npm run test
```

如果你不熟悉编写测试，这里有一些代码可以参考：
* [classnames.spec.ts](./utils/classnames.spec.ts)
* [index.spec.tsx](./app/components/base/button/index.spec.tsx)

## 文档

访问 <https://docs.dify.ai/getting-started/readme> 查看完整文档。

## 社区

Dify 社区可以在 [Discord 社区](https://discord.gg/5AEfbxcd9k) 找到，你可以在那里提问、表达想法和分享你的项目。
