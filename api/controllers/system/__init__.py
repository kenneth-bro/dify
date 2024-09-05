# coding: UTF-8
# @Date    ：2024/9/1 12:51 
# @File    : __init__.py.py
# :Author:  fum


from extensions.ext_flask_restx import api_root

# 添加命名空间(新的路由分支) 主要是为了显示在 Swagger 文档中的分类
api = api_root.namespace('system', description='二开系统模块', path='/system')

from . import index

app = None


def init_system(app_):
    global app
    app = app_
