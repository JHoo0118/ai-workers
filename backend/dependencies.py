import sys
import os

import pypandoc


def download_pandoc():
    """Download pandoc if not already installed"""
    try:
        # Check whether it is already installed
        pypandoc.get_pandoc_version()
    except OSError:
        # Pandoc not installed. Let's download it silently.
        with open(os.devnull, "w") as devnull:
            sys.stdout = devnull
            pypandoc.download_pandoc()
            sys.stdout = sys.__stdout__

        # Hack to delete the downloaded file from the folder,
        # otherwise it could get accidently committed to the repo
        # by other scripts in the repo.
        pf = sys.platform
        if pf.startswith("linux"):
            pf = "linux"
        url = pypandoc.pandoc_download._get_pandoc_urls()[0][pf]
        filename = url.split("/")[-1]
        os.remove(filename)
