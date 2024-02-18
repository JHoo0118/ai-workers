import os


class AICodeConvertService(object):
    _instance = None

    def __new__(class_, *args, **kwargs):
        if not isinstance(class_._instance, class_):
            class_._instance = object.__new__(class_, *args, **kwargs)

        return class_._instance

    def __init__(self):
        if not os.path.exists("./backend/.cache"):
            os.makedirs("./backend/.cache")

        if not os.path.exists("./backend/.cache/code_convert"):
            os.makedirs("./backend/.cache/code_convert")

    def __init_path(self, email: str):
        if not os.path.exists(f"./backend/.cache/code_convert/{email}"):
            os.makedirs(f"./backend/.cache/code_convert/{email}")
