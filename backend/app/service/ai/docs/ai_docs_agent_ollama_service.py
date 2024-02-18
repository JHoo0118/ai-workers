import asyncio
import os
import json
import operator

from fastapi import UploadFile

from langchain import hub
from langchain.output_parsers.openai_tools import PydanticToolsParser
from langchain.prompts import PromptTemplate
from langchain.callbacks import AsyncIteratorCallbackHandler
from langchain_core.output_parsers import StrOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_core.utils.function_calling import convert_to_openai_tool
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.document_loaders import UnstructuredFileLoader
from langchain.embeddings import CacheBackedEmbeddings
from langchain.storage import LocalFileStore
from langchain.memory import ConversationSummaryBufferMemory
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores.faiss import FAISS
from langchain_core.vectorstores import VectorStoreRetriever
from langchain.callbacks.base import BaseCallbackHandler
from typing import Dict, List, TypedDict
from dotenv import load_dotenv
from langgraph.graph import END, StateGraph
from langchain_core.messages.base import BaseMessage
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.chat_models import ChatOllama


import json

from pyparsing import Any


load_dotenv()

splitter = CharacterTextSplitter.from_tiktoken_encoder(
    separator="\n",
    chunk_size=600,
    chunk_overlap=100,
)

embeddings = OllamaEmbeddings(model="mistral:latest")


class CustomCallbackHandler(AsyncIteratorCallbackHandler):
    def on_chat_model_start(
        self,
        serialized: Dict[str, Any],
        messages: List[List[BaseMessage]],
        **kwargs: Any,
    ):
        print("model started")

    def on_llm_start(self, *args, **kwargs):
        print("START!!")

    def on_llm_end(self, *args, **kwargs):
        print("END!!")

    def on_llm_new_token(self, token, *args, **kwargs):
        print(f"TOKEN: {token}")


class AIDocsAgentOllamaService(object):
    _instance = None
    _memory_llm: ChatOpenAI
    _memory: ConversationSummaryBufferMemory
    # 임시 path
    _memory_file_path = "./backend/.cache/chat_memory/memory.json"
    _retriever: VectorStoreRetriever
    _callback: AsyncIteratorCallbackHandler

    def __new__(class_, *args, **kwargs):
        if not isinstance(class_._instance, class_):
            class_._instance = object.__new__(class_, *args, **kwargs)

        return class_._instance

    def __init__(self):
        self._callback = CustomCallbackHandler()
        if not os.path.exists("./backend/.cache"):
            os.makedirs("./backend/.cache")

        if not os.path.exists("./backend/.cache/docs"):
            os.makedirs("./backend/.cache/docs")

        if not os.path.exists("./backend/.cache/docs/embeddings"):
            os.makedirs("./backend/.cache/docs/embeddings")

        if not os.path.exists("./backend/.cache/docs/files"):
            os.makedirs("./backend/.cache/docs/files")

        if not os.path.exists("./backend/.cache/docs/chat_memory"):
            os.makedirs("./backend/.cache/docs/chat_memory")

    def __init_path(self, email: str, filename: str):
        self._memory_file_path = (
            f"./backend/.cache/docs/chat_memory/{email}/{filename}_memory.json"
        )
        if not os.path.exists(f"./backend/.cache/docs/embeddings/{email}"):
            os.makedirs(f"./backend/.cache/docs/embeddings/{email}")

        if not os.path.exists(f"./backend/.cache/docs/files/{email}"):
            os.makedirs(f"./backend/.cache/docs/files/{email}")

        if not os.path.exists(f"./backend/.cache/docs/chat_memory/{email}"):
            os.makedirs(f"./backend/.cache/docs/chat_memory/{email}")

    def embed_file(self, email: str, file: UploadFile):
        try:
            file_content = file.file.read()
            filename = file.filename
            self.__init_path(email=email, filename=filename)
            # self._memory.clear()
            self._memory_file_path = (
                f"./backend/.cache/chat_memory/{filename}_memory.json"
            )
            if not os.path.exists(self._memory_file_path):
                with open(self._memory_file_path, "a+") as file:
                    file.write("{}")
                    file.close()
            # self.load_memory_from_file(self._memory_file_path)
            file_path = self.get_file_path(email=email, filename=filename)

            with open(file_path, "wb") as f:
                f.write(file_content)

            return self.get_retriever(email=email, filename=filename)
        except FileNotFoundError as e:
            print(e)

    def get_retriever(self, email: str, filename: str):
        cache_dir = LocalFileStore(
            f"./backend/.cache/docs/embeddings/{email}/{filename}"
        )
        file_path = self.get_file_path(filename)
        loader = UnstructuredFileLoader(file_path)
        docs = loader.load_and_split(text_splitter=splitter)
        all_splits = splitter.split_documents(docs)
        cached_embeddings = CacheBackedEmbeddings.from_bytes_store(
            embeddings, cache_dir
        )
        vectorstore = FAISS.from_documents(documents=all_splits, embedding=embeddings)
        self._retriever = vectorstore.as_retriever()
        return self._retriever

    def get_file_path(self, email: str, filename: str):
        return f"./backend/.cache/docs/files/{email}/{filename}"

    class GraphState(TypedDict):
        """
        Represents the state of our graph.

        Attributes:
            keys: A dictionary where each key is a string.
        """

        keys: Dict[str, any]

    def retrieve(self, state):
        """
        Retrieve documents

        Args:
            state (dict): The current graph state

        Returns:
            state (dict): New key added to state, documents, that contains retrieved documents
        """
        print("---RETRIEVE---")
        state_dict = state["keys"]
        question = state_dict["question"]
        documents = self._retriever.get_relevant_documents(question)
        return {"keys": {"documents": documents, "question": question}}

    def generate(self, state):
        """
        Generate answer

        Args:
            state (dict): The current graph state

        Returns:
            state (dict): New key added to state, generation, that contains LLM generation
        """
        print("---GENERATE---")
        state_dict = state["keys"]
        question = state_dict["question"]
        documents = state_dict["documents"]

        # Prompt
        prompt = hub.pull("rlm/rag-prompt")

        # LLM
        # llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0)
        llm = ChatOllama(model="mistral:latest", temperature=0)

        # Post-processing
        def format_docs(self, docs):
            return "\n\n".join(doc.page_content for doc in docs)

        # Chain
        rag_chain = prompt | llm | StrOutputParser()

        # Run
        generation = rag_chain.invoke({"context": documents, "question": question})
        return {
            "keys": {
                "documents": documents,
                "question": question,
                "generation": generation,
            }
        }

    def grade_documents(self, state):
        """
        Determines whether the retrieved documents are relevant to the question.

        Args:
            state (dict): The current graph state

        Returns:
            state (dict): Updates documents key with relevant documents
        """

        print("---CHECK RELEVANCE---")
        state_dict = state["keys"]
        question = state_dict["question"]
        documents = state_dict["documents"]

        # Data model
        class grade(BaseModel):
            """Binary score for relevance check."""

            binary_score: str = Field(description="Relevance score 'yes' or 'no'")

        # LLM
        model = ChatOllama(model="mistral:latest", format="json", temperature=0)

        # Parser
        from langchain_core.output_parsers import JsonOutputParser

        parser = JsonOutputParser(pydantic_object=grade)
        # parser_tool = PydanticToolsParser(tools=[grade])

        # Prompt
        prompt = PromptTemplate(
            template="""You are a grader assessing relevance of a retrieved document to a user question. \n 
            Here is the retrieved document: \n\n {context} \n\n
            Here is the user question: {question} \n
            If the document contains keyword(s) or semantic meaning related to the user question, grade it as relevant. \n
            Give a binary score 'yes' or 'no' score to indicate whether the document is relevant to the question.""",
            input_variables=["context", "question"],
            partial_variables={"format_instructions": parser.get_format_instructions()},
        )

        # Chain
        chain = prompt | model | parser

        # Score
        filtered_docs = []
        for d in documents:
            score = chain.invoke(
                {
                    "question": question,
                    "context": d.page_content,
                    "format_instructions": parser.get_format_instructions(),
                }
            )
            grade = score["binary_score"]
            if grade == "yes":
                print("---GRADE: DOCUMENT RELEVANT---")
                filtered_docs.append(d)
            else:
                print("---GRADE: DOCUMENT NOT RELEVANT---")
                continue

        return {"keys": {"documents": filtered_docs, "question": question}}

    def transform_query(self, state):
        """
        Transform the query to produce a better question.

        Args:
            state (dict): The current graph state

        Returns:
            state (dict): Updates question key with a re-phrased question
        """

        print("---TRANSFORM QUERY---")
        state_dict = state["keys"]
        question = state_dict["question"]
        documents = state_dict["documents"]

        # Create a prompt template with format instructions and the query
        prompt = PromptTemplate(
            template="""You are generating questions that is well optimized for retrieval. \n 
            Look at the input and try to reason about the underlying sematic intent / meaning. \n 
            Here is the initial question:
            \n ------- \n
            {question} 
            \n ------- \n
            Formulate an improved question: """,
            input_variables=["question"],
        )

        # Grader
        model = ChatOllama(model="mistral:latest", temperature=0)

        # Prompt
        chain = prompt | model | StrOutputParser()
        better_question = chain.invoke({"question": question})

        return {"keys": {"documents": documents, "question": better_question}}

    def prepare_for_final_grade(self, state):
        """
        Passthrough state for final grade.

        Args:
            state (dict): The current graph state

        Returns:
            state (dict): The current graph state
        """

        print("---FINAL GRADE---")
        state_dict = state["keys"]
        question = state_dict["question"]
        documents = state_dict["documents"]
        generation = state_dict["generation"]

        return {
            "keys": {
                "documents": documents,
                "question": question,
                "generation": generation,
            }
        }

    ### Edges ###

    def decide_to_generate(self, state):
        """
        Determines whether to generate an answer, or re-generate a question.

        Args:
            state (dict): The current state of the agent, including all keys.

        Returns:
            str: Next node to call
        """

        print("---DECIDE TO GENERATE---")
        state_dict = state["keys"]
        question = state_dict["question"]
        filtered_documents = state_dict["documents"]

        if not filtered_documents:
            # All documents have been filtered check_relevance
            # We will re-generate a new query
            print("---DECISION: TRANSFORM QUERY---")
            return "transform_query"
        else:
            # We have relevant documents, so generate answer
            print("---DECISION: GENERATE---")
            return "generate"

    def grade_generation_v_documents(self, state):
        """
        Determines whether the generation is grounded in the document.

        Args:
            state (dict): The current state of the agent, including all keys.

        Returns:
            str: Binary decision
        """

        print("---GRADE GENERATION vs DOCUMENTS---")
        state_dict = state["keys"]
        question = state_dict["question"]
        documents = state_dict["documents"]
        generation = state_dict["generation"]

        # Data model
        class grade(BaseModel):
            """Binary score for relevance check."""

            binary_score: str = Field(description="Relevance score 'yes' or 'no'")

        # LLM
        model = ChatOllama(model="mistral:latest", format="json", temperature=0)

        # Parser
        from langchain_core.output_parsers import JsonOutputParser

        parser = JsonOutputParser(pydantic_object=grade)

        # Prompt
        prompt = PromptTemplate(
            template="""You are a grader assessing whether an answer is grounded in / supported by a set of facts. \n 
            Here are the facts:
            \n ------- \n
            {documents} 
            \n ------- \n
            Here is the answer: {generation}
            Give a binary score 'yes' or 'no' to indicate whether the answer is grounded in / supported by a set of facts.""",
            input_variables=["generation", "documents"],
            partial_variables={"format_instructions": parser.get_format_instructions()},
        )

        # Chain
        chain = prompt | model | parser

        score = chain.invoke(
            {
                "question": question,
                "documents": documents,
                "format_instructions": parser.get_format_instructions(),
            }
        )
        grade = score["binary_score"]
        if grade == "yes":
            print("---DECISION: SUPPORTED, MOVE TO FINAL GRADE---")
            return "supported"
        else:
            print("---DECISION: NOT SUPPORTED, GENERATE AGAIN---")
            return "not supported"

    def grade_generation_v_question(self, state):
        """
        Determines whether the generation addresses the question.

        Args:
            state (dict): The current state of the agent, including all keys.

        Returns:
            str: Binary decision
        """

        print("---GRADE GENERATION vs QUESTION---")
        state_dict = state["keys"]
        question = state_dict["question"]
        documents = state_dict["documents"]
        generation = state_dict["generation"]

        # Data model
        class grade(BaseModel):
            """Binary score for relevance check."""

            binary_score: str = Field(description="Useful score 'yes' or 'no'")

        # LLM
        model = ChatOllama(model="mistral:latest", format="json", temperature=0)

        # Parser
        from langchain_core.output_parsers import JsonOutputParser

        parser = JsonOutputParser(pydantic_object=grade)

        # Prompt
        prompt = PromptTemplate(
            template="""You are a grader assessing whether an answer is useful to resolve a question. \n 
            Here is the answer:
            \n ------- \n
            {generation} 
            \n ------- \n
            Here is the question: {question}
            Give a binary score 'yes' or 'no' to indicate whether the answer is useful to resolve a question.""",
            input_variables=["generation", "question"],
            partial_variables={"format_instructions": parser.get_format_instructions()},
        )

        # Prompt
        chain = prompt | model | parser

        score = chain.invoke(
            {
                "generation": generation,
                "question": question,
                "format_instructions": parser.get_format_instructions(),
            }
        )
        grade = score["binary_score"]

        if grade == "yes":
            print("---DECISION: USEFUL---")
            return "useful"
        else:
            print("---DECISION: NOT USEFUL---")
            return "not useful"

    async def invoke_chain(self, email: str, filename: str, message: str):
        self.__init_path(email=email, filename=filename)
        workflow = StateGraph(self.GraphState)

        # Define the nodes
        workflow.add_node("retrieve", self.retrieve)  # retrieve
        workflow.add_node("grade_documents", self.grade_documents)  # grade documents
        workflow.add_node("generate", self.generate)  # generatae
        workflow.add_node("transform_query", self.transform_query)  # transform_query
        workflow.add_node(
            "prepare_for_final_grade", self.prepare_for_final_grade
        )  # passthrough

        # Build graph
        workflow.set_entry_point("retrieve")
        workflow.add_edge("retrieve", "grade_documents")
        workflow.add_conditional_edges(
            "grade_documents",
            self.decide_to_generate,
            {
                "transform_query": "transform_query",
                "generate": "generate",
            },
        )
        workflow.add_edge("transform_query", "retrieve")
        workflow.add_conditional_edges(
            "generate",
            self.grade_generation_v_documents,
            {
                "supported": "prepare_for_final_grade",
                "not supported": "generate",
            },
        )
        workflow.add_conditional_edges(
            "prepare_for_final_grade",
            self.grade_generation_v_question,
            {
                "useful": END,
                "not useful": "transform_query",
            },
        )
        # Compile
        app = workflow.compile()
        inputs = {"keys": {"question": message}}
        try:
            final_response = await app.ainvoke(inputs, {"recursion_limit": 10})
            return final_response["keys"]["generation"]
        except:
            return "해당 문서에서 질문에 대한 답을 찾을 수 없습니다."
