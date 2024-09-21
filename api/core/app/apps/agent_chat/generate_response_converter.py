import json
import logging
from collections.abc import Generator
from typing import cast

from core.app.apps.base_app_generate_response_converter import AppGenerateResponseConverter
from core.app.entities.task_entities import (
    ChatbotAppBlockingResponse,
    ChatbotAppStreamResponse,
    ErrorStreamResponse,
    MessageEndStreamResponse,
    PingStreamResponse,
)

logger = logging.getLogger(__name__)


class AgentChatAppGenerateResponseConverter(AppGenerateResponseConverter):
    _blocking_response_type = ChatbotAppBlockingResponse

    @classmethod
    def convert_blocking_full_response(cls, blocking_response: ChatbotAppBlockingResponse) -> dict:
        """
        Convert blocking full response.
        :param blocking_response: blocking response
        :return:
        """
        response = {
            "event": "message",
            "task_id": blocking_response.task_id,
            "id": blocking_response.data.id,
            "message_id": blocking_response.data.message_id,
            "conversation_id": blocking_response.data.conversation_id,
            "mode": blocking_response.data.mode,
            "answer": blocking_response.data.answer,
            "metadata": blocking_response.data.metadata,
            "created_at": blocking_response.data.created_at,
        }

        return response

    @classmethod
    def convert_blocking_simple_response(cls, blocking_response: ChatbotAppBlockingResponse) -> dict:
        """
        Convert blocking simple response.
        :param blocking_response: blocking response
        :return:
        """
        response = cls.convert_blocking_full_response(blocking_response)

        metadata = response.get("metadata", {})
        response["metadata"] = cls._get_simple_metadata(metadata)

        return response

    @classmethod
    def convert_stream_full_response(
            cls, stream_response: Generator[ChatbotAppStreamResponse, None, None]
    ) -> Generator[str, None, None]:
        """
        Convert stream full response.
        :param stream_response: stream response
        :return:
        """
        agent_thoughts = []
        for chunk in stream_response:
            chunk = cast(ChatbotAppStreamResponse, chunk)
            sub_stream_response = chunk.stream_response
            if sub_stream_response.event.value == "agent_thought":
                agent_thoughts.append(sub_stream_response)

            if isinstance(sub_stream_response, PingStreamResponse):
                yield "ping"
                continue

            response_chunk = {
                "event": sub_stream_response.event.value,
                "conversation_id": chunk.conversation_id,
                "message_id": chunk.message_id,
                "created_at": chunk.created_at,
            }

            if isinstance(sub_stream_response, ErrorStreamResponse):
                data = cls._error_to_stream_response(sub_stream_response.err)
                response_chunk.update(data)
            else:
                ###########################################################
                # 如果子流响应是消息结束流响应，则进行以下操作
                if isinstance(sub_stream_response, MessageEndStreamResponse):
                    try:
                        # 初始化数据资源列表
                        data_resources = []
                        # 获取子流响应中的资源配置
                        retriever_resource_config = sub_stream_response.retriever_resource_config
                        # 如果资源配置中没有指定资源，则将响应更新为字典形式
                        if 'resources' not in retriever_resource_config:
                            response_chunk.update(sub_stream_response.to_dict())
                        else:
                            no_repeat_data = {}
                            # 遍历资源配置中的每个资源节点
                            for node in retriever_resource_config['resources']:
                                # 遍历代理思考中的每个思考
                                for agent_thought in agent_thoughts:
                                    if agent_thought.observation:
                                        try:
                                            # 尝试从代理的观察结果中获取数据
                                            observation_dict = json.loads(agent_thought.observation)
                                            if node['id'] not in observation_dict:
                                                continue
                                            data = []
                                            try:
                                                _data = json.loads(observation_dict[node['id']])
                                                try:
                                                    # 尝试进一步处理数据，如果数据中包含'Data'或'data'字段，则获取相应字段的数据
                                                    if 'Data' in _data:
                                                        data = _data['Data']
                                                    elif 'data' in _data:
                                                        data = _data['data']
                                                    else:
                                                        raise Exception("非标准接口 缺少data or Data 字段")
                                                    # 为每行数据添加链接字段
                                                    for row in data:
                                                        row['to_link'] = f"{node['to_link']}"
                                                except Exception as e:
                                                    # 如果处理数据时出现异常，则将数据转换为列表
                                                    logging.error(f"Error processing data: {e}")
                                            except Exception as e:
                                                logging.error(f"Error processing data: {e}")
                                                data = agent_thought.observation.split(
                                                    '\n') if agent_thought.observation else []
                                            data_resource = {
                                                "type": node['type'],
                                                "id": node['id'],
                                                "src_column": node['src_column'],
                                                "data_type": node['data_type'],
                                                "match_column": node['match_column'],
                                                "show_column": node['show_column'],
                                                "data": data,
                                            }
                                            no_repeat_data[data_resource['id']] = data_resource
                                        except Exception as e:
                                            pass
                            # 将去重后的数据资源添加到列表中
                            for i in no_repeat_data.values():
                                data_resources.append(i)
                            sub_stream_response.metadata['data_resources'] = data_resources
                            response_chunk.update(sub_stream_response.to_dict())
                    except Exception as e:
                        logging.error(f"Error processing data: {e}")
                        sub_stream_response.metadata['data_resources'] = []
                        response_chunk.update(sub_stream_response.to_dict())
                ###########################################################
                else:
                    response_chunk.update(sub_stream_response.to_dict())

            yield json.dumps(response_chunk)

    @classmethod
    def convert_stream_simple_response(
            cls, stream_response: Generator[ChatbotAppStreamResponse, None, None]
    ) -> Generator[str, None, None]:
        """
        Convert stream simple response.
        :param stream_response: stream response
        :return:
        """
        for chunk in stream_response:
            chunk = cast(ChatbotAppStreamResponse, chunk)
            sub_stream_response = chunk.stream_response

            if isinstance(sub_stream_response, PingStreamResponse):
                yield "ping"
                continue

            response_chunk = {
                "event": sub_stream_response.event.value,
                "conversation_id": chunk.conversation_id,
                "message_id": chunk.message_id,
                "created_at": chunk.created_at,
            }

            if isinstance(sub_stream_response, MessageEndStreamResponse):
                sub_stream_response_dict = sub_stream_response.to_dict()
                metadata = sub_stream_response_dict.get("metadata", {})
                sub_stream_response_dict["metadata"] = cls._get_simple_metadata(metadata)
                response_chunk.update(sub_stream_response_dict)

            if isinstance(sub_stream_response, ErrorStreamResponse):
                data = cls._error_to_stream_response(sub_stream_response.err)
                response_chunk.update(data)
            else:
                response_chunk.update(sub_stream_response.to_dict())

            yield json.dumps(response_chunk)
