from langchain_text_splitters import MarkdownHeaderTextSplitter

with open("test_data.txt", 'r', encoding="UTF-8") as file:
    markdown_document = file.read()

    headers_to_split_on = [
        ("#", "Country"),
    ]

    markdown_splitter = MarkdownHeaderTextSplitter(headers_to_split_on=headers_to_split_on)
    md_header_splits = markdown_splitter.split_text(markdown_document)
    print(md_header_splits[0].metadata)