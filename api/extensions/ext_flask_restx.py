# coding: UTF-8
# @Date    ：2024/9/1 14:12 
# @File    : ext_flask_restx.py
# :Author:  fum
from flask import Blueprint
from flask_restx import Api

# 初始化 API
api_root = Api(version='1.0', title='二次开发API - Dify', description='二次开发接口文档', doc='/')

app = None


def init_app(app_):
    global app
    app = app_
    api_root.init_app(app)
