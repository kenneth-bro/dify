# SQL
* 将db生成SQL
```
flask db upgrade --sql > upgrade_script.sql
```
* 生成数据库迁移脚本
```bash
$ flask db stamp head
$ flask db migrate
$ flask db upgrade
```