from langchain_text_splitters import MarkdownHeaderTextSplitter

with open("country_data_markdown.txt", 'r', encoding="UTF-8") as file:
    markdown_document = file.read()

    headers_to_split_on = [
        ("#", "Country"),
    ]

    markdown_splitter = MarkdownHeaderTextSplitter(headers_to_split_on=headers_to_split_on)
    md_header_splits = markdown_splitter.split_text(markdown_document)
    print(md_header_splits)



from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import TiDBVectorStore
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import CharacterTextSplitter
from langchain_text_splitters import MarkdownHeaderTextSplitter

import getpass
import os

tidb_connection_string = getpass.getpass("TiDB Connection String:")
os.environ["OPENAI_API_KEY"] = getpass.getpass("OpenAI API Key:")

docs = None

with open ("country_data_markdown.txt", "r", encoding="UTF-8") as file:
    document = file.read()

    headers_to_split_on = [
        ('#', "Country"),
    ]

    markdown_splitter = MarkdownHeaderTextSplitter(headers_to_split_on=headers_to_split_on)
    docs = markdown_splitter.split_text(document)

embeddings = OpenAIEmbeddings()
vector_store = TiDBVectorStore.from_documents(
    documents=docs,
    embedding=embeddings,
    table_name="testing",
    connection_string=tidb_connection_string,
    distance_strategy="cosine", 
)

query = "Find a country with people that speak English and Spanish, with warm weather, with extra hot spicy food, with people that follow Christianity, with a crime index of under 6, with landmarks, with many places for hiking, with broadband download speed of over 50 Mbps, with a tap water index of over 60, with no ongoing conflicts or regional tensions, with political stability and no political tensions, with a government that has a voting system, not in the continents of North America, and specifically not Bangladesh, Libya, Lebanon, Afghanistan, Somalia, Iran, Yemen, Syria, Russia, Myanmar, Venezuela, Iraq, South Sudan, Mali, Central African Republic, Burkina Faso, Haiti, Belarus, North Korea, Ukraine, Sudan, Mexico, Israel, or Palestine State."
docs_with_score = vector_store.similarity_search_with_relevance_scores(query, k=20)
for doc, score in docs_with_score:
    print("-" * 80)
    print("Score: ", score)
    print(doc.page_content)
    print("-" * 80)
    