# coding: UTF-8
# @Date    ：2024/9/2 15:06 
# @File    : __init__.py.py
# :Author:  fum
import os

from flask import Flask as DifyApp

from configs import dify_config
from extensions.ext_database import db, init_app
from models import Message

dify_app = DifyApp(__name__)

# dify_app.config.from_mapping(dify_config.model_dump())
# # populate configs into system environment variables
# for key, value in dify_app.config.items():
#     if isinstance(value, str):
#         os.environ[key] = value
#     elif isinstance(value, int | float | bool):
#         os.environ[key] = str(value)
#     elif value is None:
#         os.environ[key] = ""


DB_USERNAME = "dify"
DB_PASSWORD = "MJwKmr5n5egcN77Y"
DB_HOST = "10.9.1.33"
DB_PORT = 9615
DB_DATABASE = "dify"
# 配置 PostgreSQL 数据库连接
dify_app.config[
    'SQLALCHEMY_DATABASE_URI'] = f'postgresql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_DATABASE}'

init_app(dify_app)
