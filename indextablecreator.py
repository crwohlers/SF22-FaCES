import os
source = open ("index.html", "r")
dest = open("index.html.new", "w")
dsource = open("data.csv", "r", encoding='utf-8-sig')

replacing = False

for line in source:
    dest.write(line)

source.close()
dest.close()
dsource.close()

os.remove("index.html")
os.rename("index.html.new", "index.html")
    