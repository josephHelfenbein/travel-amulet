from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import TiDBVectorStore
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import CharacterTextSplitter
from langchain_text_splitters import MarkdownHeaderTextSplitter

import getpass
import os

tidb_connection_string = getpass.getpass("TiDB Connection String:")
os.environ["OPENAI_API_KEY"] = getpass.getpass("OpenAI API Key:")

embeddings = OpenAIEmbeddings()

# Query the Vector Store
vector_store = TiDBVectorStore.from_existing_vector_table(
    embedding=embeddings,
    connection_string=tidb_connection_string,
    table_name="vectors",
    distance_strategy="cosine",
)

# Finds the most similar document to the query
query = "Find a country with people that speak English and Spanish, with warm weather, with extra hot spicy food, with people that follow Christianity, with a crime index of under 6, with landmarks, with many places for hiking, with broadband download speed of over 50 Mbps, with a tap water index of over 60, with no ongoing conflicts or regional tensions, with political stability and no political tensions, with a government that has a voting system, not in the continents of North America, and specifically not Bangladesh, Libya, Lebanon, Afghanistan, Somalia, Iran, Yemen, Syria, Russia, Myanmar, Venezuela, Iraq, South Sudan, Mali, Central African Republic, Burkina Faso, Haiti, Belarus, North Korea, Ukraine, Sudan, Mexico, Israel, or Palestine State."
filters = {
    "Crime_Index":{"$lt": 4.5},
    "Download_Speed":{"$gt": 100},
    "Tap_Water_Index":{"$gt": 80},
}

docs_with_score = vector_store.similarity_search_with_relevance_scores(query, filter=filters, k=20)
# docs_with_score = vector_store.similarity_search_with_relevance_scores(query, k=20)
for doc, score in docs_with_score:
    print("-" * 80)
    print("Score: ", score)
    print(doc.page_content)
    # print(doc.metadata)
    print("-" * 80)