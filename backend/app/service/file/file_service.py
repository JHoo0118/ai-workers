def getFileExtension(filename: str) -> str:
    splitted = filename.split(".")
    if len(splitted) == 1:
        return ""
    return splitted[-1]
