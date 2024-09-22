import json
import logging
from collections.abc import Generator
from typing import Any, cast

logger = logging.getLogger(__name__)
from core.app.apps.base_app_generate_response_converter import AppGenerateResponseConverter
from core.app.entities.task_entities import (
    AppBlockingResponse,
    AppStreamResponse,
    ChatbotAppBlockingResponse,
    ChatbotAppStreamResponse,
    ErrorStreamResponse,
    MessageEndStreamResponse,
    NodeFinishStreamResponse,
    NodeStartStreamResponse,
    PingStreamResponse,
)


class AdvancedChatAppGenerateResponseConverter(AppGenerateResponseConverter):
    _blocking_response_type = ChatbotAppBlockingResponse

    @classmethod
    def convert_blocking_full_response(cls, blocking_response: AppBlockingResponse) -> dict[str, Any]:
        """
        Convert blocking full response.
        :param blocking_response: blocking response
        :return:
        """
        blocking_response = cast(ChatbotAppBlockingResponse, blocking_response)
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
    def convert_blocking_simple_response(cls, blocking_response: AppBlockingResponse) -> dict[str, Any]:
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
            cls, stream_response: Generator[AppStreamResponse, None, None]
    ) -> Generator[str, Any, None]:
        """
        Convert stream full response.
        :param stream_response: stream response
        :return:
        """
        node_finished = []
        for chunk in stream_response:
            chunk = cast(ChatbotAppStreamResponse, chunk)
            sub_stream_response = chunk.stream_response
            if sub_stream_response.event.value == "node_finished":
                node_finished.append(sub_stream_response)
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
                #############################################################
                if isinstance(sub_stream_response, MessageEndStreamResponse):
                    retriever_resource_config = sub_stream_response.retriever_resource_config
                    no_repeat_data = {}
                    data_resources = []
                    if 'resources' in retriever_resource_config:
                        for node in retriever_resource_config['resources']:
                            for finished_node in node_finished:
                                if node['id'] == finished_node.data.node_id:
                                    data = []
                                    try:
                                        print(finished_node.data.outputs)
                                        _data = finished_node.data.outputs
                                        if 'text' in _data:
                                            try:
                                                text = json.loads(_data['text'])
                                                if "data" in text or "Data" in text:
                                                    if isinstance(text["data"], list):
                                                        data = text["data"]
                                                        for i in data:
                                                            i["to_link"] = node["to_link"]
                                                    else:
                                                        data = [text["data"]]
                                            except Exception as e:
                                                data = [_data['text']]
                                        elif 'result' in _data:
                                            if isinstance(_data['result'], list):
                                                data = _data['result']
                                            else:
                                                data = [_data['result']]
                                        elif _data:
                                            data = [_data]
                                    except Exception as e:
                                        logging.warning(e)
                                        data = [finished_node.data.outputs]
                                    data_resource = {
                                        "type": node['type'],
                                        "id": node['id'],
                                        "name": finished_node.data.title,
                                        "src_column": node['src_column'],
                                        "data_type": node['data_type'],
                                        "match_column": node['match_column'],
                                        "show_column": node['show_column'],
                                        "to_link": node['to_link'],
                                        "data": data,
                                    }
                                    no_repeat_data[node['id']] = data_resource
                                    break
                    for i in no_repeat_data.values():
                        data_resources.append(i)
                    sub_stream_response.metadata['data_resources'] = data_resources
                #############################################################
                response_chunk.update(sub_stream_response.to_dict())
            yield json.dumps(response_chunk)

    @classmethod
    def convert_stream_simple_response(
            cls, stream_response: Generator[AppStreamResponse, None, None]
    ) -> Generator[str, Any, None]:
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
            elif isinstance(sub_stream_response, NodeStartStreamResponse | NodeFinishStreamResponse):
                response_chunk.update(sub_stream_response.to_ignore_detail_dict())
            else:
                response_chunk.update(sub_stream_response.to_dict())

            yield json.dumps(response_chunk)
