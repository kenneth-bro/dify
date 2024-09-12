# coding: UTF-8
# @Date    ：2024/9/10 8:49 
# @File    : llm_cache_update.py
# :Author:  fum
import logging

import requests

from extensions.ext_flask_restx import app

logger = logging.getLogger(__name__)


class LLMCacheUpdate:
    def __init__(self):
        self.url = app.config['LLM_BASE_UPDATE_INFO_URL']

    def update(self):
        """
        更新缓存
        """
        if not self.url:
            logger.warning("LLM_BASE_UPDATE_INFO_URL is None ")
        else:
            self.update_llm_cache()

    def update_llm_cache(self):
        """
        发送请求
        """
        headers = {
            "Content-Type": "application/json",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0"
        }
        try:
            res = requests.get(self.url, headers=headers).json()
            if res.get("code") == "Success":
                logger.info("【LLMBase】应用缓存更新成功.")
            else:
                logger.error("【LLMBase】应用缓存更新失败.")
        except Exception as e:
            logging.error(e)
            return
