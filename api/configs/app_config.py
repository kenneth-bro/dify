from pydantic_settings import SettingsConfigDict

from configs.agent import AgentConfig
from configs.deploy import DeploymentConfig
from configs.enterprise import EnterpriseFeatureConfig
from configs.extra import ExtraServiceConfig
from configs.feature import FeatureConfig
from configs.investoday import InvestodayApplicationConfig
from configs.middleware import MiddlewareConfig
from configs.packaging import PackagingInfo


class DifyConfig(
    # Packaging info
    PackagingInfo,
    # Deployment configs
    DeploymentConfig,
    # Feature configs
    FeatureConfig,
    # Middleware configs
    MiddlewareConfig,
    # Extra service configs
    ExtraServiceConfig,
    # Enterprise feature configs
    # **Before using, please contact business@dify.ai by email to inquire about licensing matters.**
    EnterpriseFeatureConfig,
    # 新增
    InvestodayApplicationConfig,
    # Agent配置
    AgentConfig,

):
    model_config = SettingsConfigDict(
        # read from dotenv format config file
        env_file=".env",
        env_file_encoding="utf-8",
        frozen=True,
        # ignore extra attributes
        extra="ignore",
    )

    # Before adding any config,
    # please consider to arrange it in the proper config group of existed or added
    # for better readability and maintainability.
    # Thanks for your concentration and consideration.
