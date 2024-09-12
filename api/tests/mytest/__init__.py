# coding: UTF-8
# @Date    ：2024/9/2 15:06 
# @File    : __init__.py.py
# :Author:  fum
import os

from flask import Flask

# 创建一个flask app 对象 初始化数据库连接
from extensions.ext_database import init_app

Flask = Flask(__name__)

# 测试文件中兼容没有env ########################################
DB_USERNAME = "dify"
DB_PASSWORD = "MJwKmr5n5egcN77Y"
DB_HOST = "10.9.1.33"
DB_PORT = 9615
DB_DATABASE = "dify"
# 配置 PostgreSQL 数据库连接
Flask.config[
    'SQLALCHEMY_DATABASE_URI'] = f'postgresql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_DATABASE}'
################################################################


init_app(Flask)
