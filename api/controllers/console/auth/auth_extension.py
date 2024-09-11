import logging

from flask_login import current_user, login_required
from flask_restful import Resource

from .. import api
from ..workspace.error import AccountNotInitializedError
from ..wraps import account_initialization_required

logger = logging.getLogger(__name__)

class LoginAuth(Resource):

    @login_required
    @account_initialization_required
    def get(self):
        account = current_user
        if not account.is_active:
            raise AccountNotInitializedError()

        return {
            "id": account.id,
            "name": account.name,
            "role": account.current_role,
            "is_admin_or_owner": account.is_admin_or_owner,
            "is_editor": account.is_editor
        }


api.add_resource(LoginAuth, "/extension/login-auth")