# coding: UTF-8
# @Date    ：2024/9/2 15:12 
# @File    : test.py
# :Author:  fum

import warnings
from unittest import TestCase
from uuid import UUID

from sqlalchemy import bindparam, text

from extensions.ext_database import db
from models import Message

from . import Flask

warnings.filterwarnings("ignore", category=DeprecationWarning)

import unittest


class MyFlaskDBTests(TestCase):

    def test_sql(self):
        with Flask.app_context():
            # 使用原生 SQL 查询
            with db.engine.connect() as connection:
                query = text("SELECT * FROM messages LIMIT 10")
                result = connection.execute(query)
                for row in result:
                    print(row)

    def test_orm(self):
        with Flask.app_context():
            # 查询数据库
            history_messages = db.session.query(Message).filter(
                Message.conversation_id == "f9ed127e-efbb-477e-b750-8b3c24f032f6").order_by(
                Message.created_at.desc()).limit(10).all()
            print(history_messages)

    def test_provider_id(self):
        with Flask.app_context():
            with db.engine.connect() as connection:
                # 查询数据库
                sql = text('SELECT name, description FROM tool_api_providers WHERE id = :provider_id')
                result = connection.execute(sql, {
                    "provider_id": "7cf9c295-24c2-492a-8d7f-b04636512224"}).fetchone()._asdict()
                if result:
                    print(result)
                else:
                    print("No results found")

    def test_provider_id(self):
        provider_ids = ("7cf9c295-24c2-492a-8d7f-b04636512224", "552f9f01-efa3-4f68-9eaf-7c14f6d53ca8")
        with Flask.app_context():
            with db.engine.connect() as connection:
                sql = text('SELECT id, name, description FROM tool_api_providers WHERE id IN :provider_ids').bindparams(
                    bindparam('provider_ids', expanding=True)
                )
                results = connection.execute(sql, {"provider_ids": tuple(provider_ids)}).fetchall()
                print(results)
            provider_map = {result.id: result._asdict() for result in results}
            agent_app = provider_map.get(UUID("7cf9c295-24c2-492a-8d7f-b04636512224"), {})

            print(provider_map)
            print(agent_app)


if __name__ == '__main__':
    unittest.main()
