# coding: UTF-8
# @Date    ：2024/9/9 16:15 
# @File    : __init__.py.py
# :Author:  fum
from pydantic import Field
from pydantic_settings import BaseSettings


class LlmBaseUpdateInfoConfig(BaseSettings):
    LLM_BASE_UPDATE_INFO_URL: str = Field(
        description="模型更新信息地址",
        default="",
    )
