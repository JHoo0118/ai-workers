import os
import json
from dotenv import load_dotenv
from operator import itemgetter
from typing import AsyncGenerator
from fastapi import UploadFile
from langchain_community.document_loaders import UnstructuredFileLoader
from langchain.embeddings import CacheBackedEmbeddings
from langchain_openai import OpenAIEmbeddings
from langchain.storage import LocalFileStore
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores.faiss import FAISS
from langchain.prompts import ChatPromptTemplate
from langchain.schema.runnable import RunnableLambda, RunnablePassthrough
from langchain.schema import messages_to_dict, messages_from_dict
from langchain.memory import ConversationSummaryBufferMemory
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
from langchain_community.vectorstores.supabase import SupabaseVectorStore
from langchain.document_transformers.embeddings_redundant_filter import (
    EmbeddingsRedundantFilter,
)
from langchain.retrievers.document_compressors import (
    DocumentCompressorPipeline,
    EmbeddingsFilter,
)
from langchain.retrievers.contextual_compression import ContextualCompressionRetriever
from app.db.supabase import SupabaseService


load_dotenv()


prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
            You're a master of document summarization.
            IMPORTANT: Answer the question ONLY the following context. If you don't know the answer just say you don't know. DON'T make anything up.
            Context: {context}

            And you will get about summaried context of previous chat. If it's empty you don't have to care
            Previous-chat-context: {chat_history}
            IMPORTATNT: Please do all the answers in Korean.
            """,
        ),
        ("human", "{question}"),
    ]
)

splitter = CharacterTextSplitter.from_tiktoken_encoder(
    separator="\n",
    chunk_size=600,
    chunk_overlap=100,
)

embeddings = OpenAIEmbeddings()


class AIDocsService(object):
    _instance = None
    _memory_llm: ChatOpenAI
    _memory: ConversationSummaryBufferMemory
    _memory_file_path: str
    _supabaseService: SupabaseService

    def __new__(class_, *args, **kwargs):
        if not isinstance(class_._instance, class_):
            class_._instance = object.__new__(class_, *args, **kwargs)

        return class_._instance

    def __init__(self):
        self._supabaseService = SupabaseService()
        self._memory_llm = ChatOpenAI(
            temperature=0.1,
            model="GPT-4 Turbo",
        )

        self._memory = ConversationSummaryBufferMemory(
            llm=self._memory_llm,
            max_token_limit=120,
            memory_key="chat_history",
            return_messages=True,
        )

        if not os.path.exists("./backend/.cache"):
            os.makedirs("./backend/.cache")

        if not os.path.exists("./backend/.cache/docs"):
            os.makedirs("./backend/.cache/docs")

    def __init_path(self, email: str, filename: str):
        self._memory_file_path = (
            f"./backend/.cache/docs/{email}/chat_memory/{filename}_memory.json"
        )
        if not os.path.exists(f"./backend/.cache/docs/{email}"):
            os.makedirs(f"./backend/.cache/docs/{email}")

        if not os.path.exists(f"./backend/.cache/docs/{email}/embeddings"):
            os.makedirs(f"./backend/.cache/docs/{email}/embeddings")

        if not os.path.exists(f"./backend/.cache/docs/{email}/files/"):
            os.makedirs(f"./backend/.cache/docs/{email}/files/")

        if not os.path.exists(f"./backend/.cache/docs/{email}/chat_memory"):
            os.makedirs(f"./backend/.cache/docs/{email}/chat_memory")

    def load_json(self, path):
        if not os.path.exists(path):
            return None
        with open(path, "r") as f:
            return json.load(f)

    def save_message(self, path, input, output):
        self._memory.save_context(inputs={"input": input}, outputs={"output": output})
        # self.save_memory_on_file(
        #     memory_file_path=path,
        #     history=[HumanMessage(content=input), AIMessage(content=output)],
        # )

    def save_memory_on_file(self, memory_file_path, history):
        print("work save memory on file")
        print(self.get_history())
        history = messages_to_dict(history)

        with open(memory_file_path, "w") as f:
            json.dump(history, f)

    def load_memory_from_file(self, memory_file_path):
        print("work load memory from file")
        loaded_message = self.load_json(memory_file_path)
        if loaded_message is None:
            return
        if len(loaded_message) != 0:
            history = messages_from_dict(loaded_message)
            print(history)
            for h in history:
                print(f"h: {h}")
                # if isinstance(h, HumanMessage) :
                #     self._memory.save_context({"input": h["input"]}, {"output": h["output"]})

    def restore_memory():
        print("work restore memory")

    def get_history(self):
        return self._memory.load_memory_variables({})

    def format_docs(self, docs):
        return "\n\n".join(doc.page_content for doc in docs)

    def get_file_path(self, email: str, filename: str):
        return f"./backend/.cache/docs/{email}/files/{filename}"

    def embed_file(self, email: str, file: UploadFile):
        try:
            file_content = file.file.read()
            filename = file.filename
            self.__init_path(email=email, filename=filename)
            self._memory.clear()
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
            f"./backend/.cache/docs/{email}/embeddings/{filename}"
        )
        file_path = self.get_file_path(email=email, filename=filename)
        loader = UnstructuredFileLoader(file_path)
        docs = loader.load_and_split(text_splitter=splitter)
        cached_embeddings = CacheBackedEmbeddings.from_bytes_store(
            embeddings, cache_dir
        )
        # cached_embeddings = CacheBackedEmbeddings.from_bytes_store(
        #     embeddings, InMemoryByteStore()
        # )
        # vectorstore = FAISS.from_documents(docs, cached_embeddings)
        vectorstore = SupabaseVectorStore.from_documents(
            docs,
            cached_embeddings,
            client=self._supabaseService.supabase,
            table_name="Documents",
            query_name="match_documents",
            chunk_size=500,
        )
        retriever = vectorstore.as_retriever()

        return retriever

    def restore_memory():
        pass

    async def invoke_chain(
        self, email: str, filename, message
    ) -> AsyncGenerator[str, None]:
        self.__init_path(email=email, filename=filename)
        # callback = AsyncIteratorCallbackHandler()
        llm = ChatOpenAI(
            # "gpt-4-0125-preview",
            model="gpt-3.5-turbo-1106",
            temperature=0.1,
            streaming=True,
            # callbacks=[callback],
        )

        # invoke the chain
        parser = StrOutputParser()
        retriever = self.get_retriever(email=email, filename=filename)

        # redundant_filter = EmbeddingsRedundantFilter(embeddings=embeddings)
        # relevant_filter = EmbeddingsFilter(embeddings=embeddings, k=5)
        # pipeline_compressor = DocumentCompressorPipeline(
        #     transformers=[redundant_filter, relevant_filter]
        # )
        # compression_retriever_pipeline = ContextualCompressionRetriever(
        #     base_retriever=retriever,
        #     base_compressor=pipeline_compressor,
        # )
        chain = (
            {
                "context": retriever | RunnableLambda(self.format_docs),
                "question": RunnablePassthrough(),
            }
            | RunnablePassthrough.assign(
                chat_history=RunnableLambda(self._memory.load_memory_variables)
                | itemgetter("chat_history")
            )
            | prompt
            | llm
            | parser
        )
        # run = asyncio.create_task(chain.ainvoke(input=message))
        # async for token in callback.aiter():
        #     print(f"token: {token}", end=" | ")
        #     yield token
        # await run
        response = ""
        async for token in chain.astream(input=message):
            yield token
            response += token

    # async def generator(self, chain: RunnableSerializable, message):
    #     for chunk in chain.stream(input=message):
    #         print(chunk, end="|", flush=True)
    #         yield chunk
