# DB操作升级

常用操作如下

```bash
# 数据库迁移历史标记为当前版本
flask db stamp head

# 自动检测数据模型变化并生成迁移脚本
flask db migrate

# 升级数据
flask db upgrade

# 将版本记录生成为SQL
flask db upgrade --sql > upgrade_script.sql
```

常见问题

* [flask_migrate] Error: Can't locate revision identified by '78e2c4d4c254'

清空版本记录 `truncate table alembic_version`