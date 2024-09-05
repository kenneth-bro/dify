from flask_restx import Resource, fields

from controllers.system import api
from configs import dify_config

# 定义响应模型
response_model = api.model('系统版本信息', {
    'welcome': fields.String(description="欢迎信息"),
    'api_version': fields.String(description="API版本"),
    'server_version': fields.String(description="服务器版本"),
})


@api.route('/', methods=['GET'])
class IndexApi(Resource):

    @api.doc(description="获取系统版本信息", responses={200: 'Success', 400: 'Bad Request'})
    @api.marshal_with(response_model)
    def get(self):
        """
        获取系统版本信息
        """
        return {
            "welcome": "Dify OpenAPI",
            "api_version": "v1",
            "server_version": dify_config.CURRENT_VERSION,
        }
