from .ai_api import *
from .ai_api import router as aiRouter
from .docs import *
from .docs.ai_docs_api import router as aiDocsRouter
from .erd import *
from .erd.ai_erd_api import router as aiErdRouter

aiRouter.include_router(aiDocsRouter)
aiRouter.include_router(aiErdRouter)

__all__ = ["aiRouter"]
