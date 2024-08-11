import requests
import json

join_with_spaces = lambda list: ', '.join(list)

reqUrl = "https://countrywise.p.rapidapi.com?country=all"

headersList = {
 "x-rapidapi-key": "76ef446443msh822d07de2344303p111462jsna7f9ba4abf7f",
 "x-rapidapi-host": "countrywise.p.rapidapi.com" 
}

payload = "countries=us"

response = requests.request("GET", reqUrl, data=payload,  headers=headersList)

output_file = open("country_data.txt", "w", encoding="utf-8")

for country in response.json():
    string = ""

    # Continent
    countryName = country.get('name')
    string += f"{countryName} is located in {join_with_spaces(country.get('continent'))}. " 

    # Language
    string += f"Speaks {join_with_spaces(country.get('languages').get('official'))} officially"
    if (len(country.get('languages').get('widely_spoken')) > 0):
        string += f" and speaks {join_with_spaces(country.get('languages').get('widely_spoken'))} widely"
    string += ". "

    # Has Landmarks
    string += f"{country.get('textual').get('intro')[0]} "

    # Climate/Temperature
    string += f"{country.get('textual').get('climate')[0]} "
    
    # Food
    string += f"{country.get('textual').get('cuisine')[0]} "

    # Religion
    string += f"{countryName} believes in {join_with_spaces(country.get('religions').get('labels'))}. "

    # Crime Index
    if len(country.get('crime_index').get('datasets').get('data')) == 0:
        string += f"Does not have a crime index available but is dangerous. "
    else:
        string += f"Has as crime index of {country.get('crime_index').get('datasets').get('data')[0]}. "
        
    # Download Speed
    if country.get('internet_speed').get('broadband').get('download').get('value') == "":
        string += f"Does not have a broadband download speed available. "
    else:
        string += f"Has a broadband download speed of {country.get('internet_speed').get('broadband').get('download').get('value')} Mbps. "

    # Tap Water Index
    if len(country.get('tap_water').get('datasets').get('data')) > 0:
        string += f"Has a tap water index of {country.get('tap_water').get('datasets').get('data')[0]}. "
    elif countryName == "Nauru":
        string += f"Does not have a tap water index available but is safe to drink. "
    elif countryName == "Palestine State":
        string += f"Does not have a tap water index available but is not safe to drink. "
    elif countryName == "Palau":
        string += f"Does not have a tap water index available but is not safe to drink. "
    elif countryName == "San Marino":
        string += f"Does not have a tap water index available but is safe to drink. "
    elif countryName == "Somalia":
        string += f"Does not have a tap water index available but is not safe to drink. "
    elif countryName == "South Sudan":
        string += f"Does not have a tap water index available but is not safe to drink. "
    elif countryName == "Syria":
        string += f"Does not have a tap water index available but is not safe to drink. "
    elif countryName == "Chad":
        string += f"Does not have a tap water index available but is not safe to drink. "
    elif countryName == "Tuvalu":
        string += f"Does not have a tap water index available but is not safe to drink. "
    elif countryName == "Yemen":
        string += f"Does not have a tap water index available but is not safe to drink. "

    # Govt has Voting System and conflicts
    string += f"{country.get('textual').get('politics')[0]} "
    output_file.write(string + "\n");
    # try:
    #     output_file.write(string + "\n");
    # except:
    #     print(string)
