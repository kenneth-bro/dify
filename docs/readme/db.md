# DB操作升级

常用操作如下

```bash
# 列出所有的头部
flask db heads

# 数据库迁移历史标记为当前版本
flask db stamp head
flask db stamp <指定head>

# 自动检测数据模型变化并生成迁移脚本
flask db migrate
flask db migrate --head <指定版本>

# 升级数据
flask db upgrade <指定head>

# 将版本记录生成为SQL
flask db upgrade --sql > upgrade_script.sql
```

常见问题

* [flask_migrate] Error: Can't locate revision identified by '78e2c4d4c254'

清空版本记录 `truncate table alembic_version`

* 出现 Multiple head revisions are present for given argument 'head'; please specify a specific target revision, '<branchname>@head' to narrow to a specific head, or 'heads' for all heads

执行`flask db heads`,执行 upgrade 命令时加上指定头部