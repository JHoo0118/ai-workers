import os
from typing import Dict, TypedDict, Annotated, Sequence
from fastapi import HTTPException, status
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser

from langchain import hub
from langgraph.graph import END, StateGraph
from langchain.output_parsers.openai_tools import PydanticToolsParser
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_core.utils.function_calling import convert_to_openai_tool
from langchain_openai import ChatOpenAI
from langchain_community.chat_models import ChatOllama
from app.model.ai.code_convert.ai_code_convert_model import CodeConvertGenerateInputs
from app.model.ai.api_gen.ai_api_gen_model import ApiGenerateInputs


class AIApiGenService(object):
    _instance = None

    class GraphState(TypedDict):
        """
        Represents the state of our graph.

        Attributes:
            keys: A dictionary where each key is a string.
        """

        keys: Dict[str, any]

    def __new__(class_, *args, **kwargs):
        if not isinstance(class_._instance, class_):
            class_._instance = object.__new__(class_, *args, **kwargs)

        return class_._instance

    def __init__(self):
        if not os.path.exists("./backend/.cache"):
            os.makedirs("./backend/.cache")

        if not os.path.exists("./backend/.cache/api_gen"):
            os.makedirs("./backend/.cache/api_gen")

    def __init_path(self, email: str):
        if not os.path.exists(f"./backend/.cache/api_gen/{email}"):
            os.makedirs(f"./backend/.cache/api_gen/{email}")

    ### Nodes ###
    def summarize_user_request(self, state):
        """
        Converts user request into a short summarized goal

        Args:
            state (dict): The current graph state

        Returns:
            state (dict): The current graph state
        """

        state_dict = state["keys"]
        input = state_dict["input"]
        framework = state_dict["framework"]

        prompt = PromptTemplate(
            template="""
            Converts user request into a short summarized goal.

            Example 1:
            input = "I need a website that lets users login and logout. It needs to look fancy and accept payments."
            OUTPUT = "build a website that handles users logging in and logging out and accepts payments"
            Example 2:
            input = "Create something that stores crypto price data in a database using supabase and retrieves prices on the frontend."
            OUTPUT = "build a website that fetches and stores crypto price data within a supabase setup including a frontend UI to fetch the data."

            
            YOUR TURN!
            input:{input}
            OUTPUT:?

            """,
            input_variables=["input"],
        )

        # LLM
        # llm = ChatOpenAI(model_name="gpt-4-0125-preview", temperature=0)
        llm = ChatOllama(model="mistral:latest")

        # Chain
        rag_chain = prompt | llm | StrOutputParser()

        # Run
        input = rag_chain.invoke({"input": input})
        return {"keys": {"input": input, "framework": framework}}

    def make_project_scope(self, state):
        """
        Takes in a user request to build a website project description

        Args:
            state (dict): The current graph state

        Returns:
            state (dict): Updates project_scope key with project scope
        """
        state_dict = state["keys"]
        input = state_dict["input"]
        framework = state_dict["framework"]

        prompt = PromptTemplate(
            template="""
            Takes in a user request to build a website project description.

            Output: Prints an object response in the following format:
            {{
                "is_crud_required": bool, // true if site needs CRUD functionality
                "is_user_login_and_logout": bool // true if site needs users to be able to log in and log out
                "is_external_urls_required": bool // true if site needs to fetch data from third part providers
            }}

            Example 1:
            input = "I need a full stack website that accepts users and gets stock price data"
            prints:
            {{
                "is_crud_required": true
                "is_user_login_and_logout": true
                "is_external_urls_required": true
            }}
            Example 2:
            input = "I need a simple TODO app"
            prints:
            {{
                "is_crud_required": true
                "is_user_login_and_logout": false
                "is_external_urls_required": false
            }}
            
            YOUR TURN!
            input:{input}
            OUTPUT:?

            """,
            input_variables=["input"],
        )

        # LLM
        # llm = ChatOpenAI(model_name="gpt-4-0125-preview", temperature=0)
        llm = ChatOllama(model="mistral:latest")

        # Chain
        rag_chain = prompt | llm | StrOutputParser()

        # Run
        project_scope = rag_chain.invoke({"input": input})
        return {
            "keys": {
                "input": input,
                "framework": framework,
                "project_scope": project_scope,
            }
        }

    def make_backend_code(self, state):
        """
        Create a backend code based on the user input, framework and project scope.

        Args:
            state (dict): The current graph state

        Returns:
            state (dict): Updates backend_code key with generated backend code.
        """

        state_dict = state["keys"]
        input = state_dict["input"]
        framework = state_dict["framework"]
        project_scope = state_dict["project_scope"]

        prompt = PromptTemplate(
            template="""
            Create a backend code based on the user input, framework and project scope.

            user input: {input}
            framework: {framework}
            project_scope: {project_scope}

            1. CRUD Logic: Generate models and controllers (or equivalent) to handle Create, Read, Update, and Delete operations for the data entities defined in the project. This includes setting up database connections, defining schemas or models, and creating the necessary endpoints for these operations.
            2. Login/Logout Logic: Implement an authentication system that supports user login and logout. This will involve generating user models, authentication controllers, and middleware for session management or token-based authentication (e.g., JWT), ensuring secure handling of user credentials and sessions.
            3. External URLs Logic: Create functionality to interact with external APIs or web resources. This includes setting up HTTP clients, configuring request handlers, and integrating these capabilities into the application to fetch, send, or manipulate data from external sources.

            Proceed to outline the basic structure of the backend code. This includes setting up the project environment, defining models for database interactions, implementing authentication mechanisms, and integrating external APIs or URLs. The prompt will guide the model to generate code snippets that illustrate these functionalities, ensuring that they are scalable, secure, and adhere to best practices for backend development.
            The generated backend code will serve as a template or starting point for further customization and development, enabling the user to quickly scaffold their project with essential features and focus on adding specific functionalities or business logic as per their requirements.
            
            Self Evaluation:
            - Review if the generated code covers all aspects of the project scope.
            - Assess the code for adherence to the chosen framework's conventions and best practices.
            - Ensure the code is modular, easily understandable, and scalable.
            - Verify security measures, especially in user authentication and data manipulation, to prevent common vulnerabilities.
            - Do not just code comment. You should generate codes following your code comment.
            
            Based on the self-evaluation, refine the prompt or generated code to better meet the project requirements, improve code quality, or enhance security and performance.

            IMPORATNT: Print ONLY the code, nothing else.
            IMPORTANT: Write functions that make sense for the users request if required.
            """,
            input_variables=["input", "framework", "project_scope"],
        )
        # LLM
        # llm = ChatOpenAI(model_name="gpt-4-0125-preview", temperature=0)
        llm = ChatOllama(model="mistral:latest")

        # Chain
        rag_chain = prompt | llm | StrOutputParser()

        # Run
        backend_code = rag_chain.invoke(
            {"input": input, "framework": framework, "project_scope": project_scope}
        )
        return {
            "keys": {
                "input": input,
                "framework": framework,
                "project_scope": project_scope,
                "backend_code": backend_code,
            }
        }

    async def invoke(self, email: str, inputs: ApiGenerateInputs):
        self.__init_path(email=email)
        pInputs = {"keys": inputs.model_dump()}
        workflow = StateGraph(self.GraphState)

        # Define the nodes
        workflow.add_node(
            "summarize_user_request", self.summarize_user_request
        )  # summarize_user_request
        workflow.add_node(
            "make_project_scope", self.make_project_scope
        )  # make_project_scope
        workflow.add_node(
            "make_backend_code", self.make_backend_code
        )  # make_backend_code

        # Build graph
        workflow.set_entry_point("summarize_user_request")
        workflow.add_edge("summarize_user_request", "make_project_scope")
        workflow.add_edge("make_project_scope", "make_backend_code")
        workflow.add_edge("make_backend_code", END)

        # Compile
        app = workflow.compile()

        try:
            final_response = await app.ainvoke(pInputs, {"recursion_limit": 10})
            return final_response["keys"]["backend_code"]
        except:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="API 생성에 실패했습니다.",
                headers={"WWW-Authenticate": "Bearer"},
            )