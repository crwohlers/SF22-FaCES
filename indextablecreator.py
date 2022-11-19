import os
source = open ("index.html", "r")
dest = open("index.html.new", "w")
dsource = open("data.csv", "r", encoding='utf-8-sig')

replacing = False

for line in source:
    
    if line == "<!--MARK-->\n":
        if not replacing:
            dest.write(line)
            first = True
            for dline in dsource:
                if first:
                    x = 0
                    bld = "<tr>"
                    dline.replace("\n", "")
                    for head in dline.split(","):
                        bld += "<th onclick=\"sortTable(" + str(x) + ")\">" + head + "</th>"
                        x+=1
                    
                    dest.write(bld + "</tr>\n")
                    first = False
                else:
                    dline = "<tr><td>" + dline.replace(",", "</td><td>").replace("\n", "") + "</td></tr>\n"
                    dest.write(dline)
        replacing = not replacing

    if not replacing:
        dest.write(line)

source.close()
dest.close()
dsource.close()

os.remove("index.html")
os.rename("index.html.new", "index.html")
    