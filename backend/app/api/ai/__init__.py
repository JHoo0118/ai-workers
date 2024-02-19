from .ai_api import *
from .ai_api import router as aiRouter
from .docs import *
from .docs.ai_docs_api import router as aiDocsRouter
from .erd import *
from .erd.ai_erd_api import router as aiErdRouter
from .code_convert import *
from .code_convert.ai_code_convert_api import router as aiCodeConvertRouter
from .api_gen import *
from .api_gen.ai_api_gen_api import router as aiApiGenRouter
from .sql import *
from .sql.ai_sql_api import router as aiSqlGenRouter

aiRouter.include_router(aiDocsRouter)
aiRouter.include_router(aiErdRouter)
aiRouter.include_router(aiCodeConvertRouter)
aiRouter.include_router(aiApiGenRouter)
aiRouter.include_router(aiSqlGenRouter)

__all__ = ["aiRouter"]
