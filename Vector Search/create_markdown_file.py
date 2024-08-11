markdown_document = open("country_data_markdown.txt", "w", encoding="UTF-8")

# Read the all the words until "is" of each line and print them until it reaches the word "is"
with open("country_data.txt", "r", encoding="UTF-8") as file:
    for line in file:
        country = line.split(" is")[0]
        markdown_document.write(f"# {country}\n{line}\n")
