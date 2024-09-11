from pydantic import Field
from pydantic_settings import BaseSettings


class AgentConfig(BaseSettings):
    """
    Enterprise feature configs.
    **Before using, please contact business@dify.ai by email to inquire about licensing matters.**
    """

    AGENT_MAX_ITERATION: int = Field(
        description="最大的Agent迭代次数",
        default=5,
    )
