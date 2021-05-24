##############################################################################
import re
import random
from requests import post
from time import sleep
from os import listdir

def replace_within(surround_string, new_value, old_string):
    return re.sub(
            f"(?<={surround_string}_1_)(.*)(?=_{surround_string}_2)",
            str(new_value),
            old_string
        )
def hashme(path):
    """
        Updates the index.html file so that the browser will always request
        the newest version of all files (css, js and so on)
    """
    with open(path, "r+", encoding="utf-8") as f:
        print(f"Reading {path}")
        data = f.read()

        print("Updating file hash")
        data2 = replace_within(
            "HASH",
            random.randint(100000,999999),
            data
        )

        data3 = replace_within(
            "image_count_string",
            len(listdir("phasmo_tools\\static\\img\\bg")),
            data2
        )

        print("Updating textfile")
        f.seek(0)
        f.write(data3)
        print("Done.")
    return 0
def scss(path, minimize=True):
    """
        Converts the scss file to a css file.
        Needs to be ran before updating the website on GitHub.
    """
    with open(f"{path}/style.scss", "r", encoding="utf-8") as in_file, \
         open(f"{path}/style.css", "w", encoding="utf-8") as out_file:
        
        print("Reading from .scss file...")
        scss_data = in_file.read()

        print("Converting scss to css...")
        css_data = post(
            url='https://jsonformatter.org/service/scssTocss',
            data={'css':scss_data}
        ).text

        if css_data.startswith("fatal error"):
            print("ERROR! Could not convert scss to css! \
                   Here is the error message:")
            print(css_data)
            return -1

        if minimize:
            print("Minimizing css...")
            minimized_css_data = post(
                url='https://cssminifier.com/raw',
                data={'input':css_data}
            ).text
        else:
            minimized_css_data = css_data
        
        print("Writing to output file...")
        out_file.write(minimized_css_data)
    return 0

scss("school\\english_website\\css")

print("\nDone. Quiting in 3 secounds.")
# sleep(3)
exit()