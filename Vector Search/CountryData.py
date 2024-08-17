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

output_file = open("country_data_markdown.txt", "w", encoding="utf-8")
output_file2 = open("country_metadata.txt", "w", encoding="utf-8")

for country in response.json():
    countryName = country.get('name')
    continent = join_with_spaces(country.get('continent'));
    officialLanguages = join_with_spaces(country.get('languages').get('official'))
    widelySpokenLanguages = country.get('languages').get('widely_spoken')
    countryIntro = country.get('textual').get('intro')[0]
    countryClimate = country.get('textual').get('climate')[0]
    countryCuisine = country.get('textual').get('cuisine')[0]
    countryReligions = join_with_spaces(country.get('religions').get('labels'))
    countryCrimeIndex = None
    try:
        countryCrimeIndex = country.get('crime_index').get('datasets').get('data')[0]
    except:
        countryCrimeIndex = ""
    countryInternetSpeed = country.get('internet_speed').get('broadband').get('download').get('value')
    
    countryTapWaterIndex = None
    try:
        countryTapWaterIndex = country.get('tap_water').get('datasets').get('data')[0]
    except:
        countryTapWaterIndex = "-1"

    countryPolitics = country.get('textual').get('politics')[0]
    string = ""

    # Continent
    string += f"{countryName} is located in {continent}. " 

    # Language
    string += f"Speaks {officialLanguages} officially"
    if len(widelySpokenLanguages) > 0:
        string += f" and speaks {join_with_spaces(widelySpokenLanguages)} widely"
    string += ". "

    # Has Landmarks
    string += f"{countryIntro} "

    # Climate/Temperature
    string += f"{countryClimate} "
    
    # Food
    string += f"{countryCuisine} "

    # Religion
    string += f"{countryName} believes in {countryReligions}. "

    # Crime Index
    if countryCrimeIndex == "":
        string += f"Does not have a crime index available but is dangerous. "
    else:
        string += f"Has as crime index of {countryCrimeIndex}. "
        
    # Download Speed
    if countryInternetSpeed == "":
        string += f"Does not have a broadband download speed available. "
    else:
        string += f"Has a broadband download speed of {countryInternetSpeed} Mbps. "

    # Tap Water Index
    if int(countryTapWaterIndex) > 0:
        string += f"Has a tap water index of {countryTapWaterIndex}. "
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
    string += f"{countryPolitics}"

    output_file.write(f"# {countryName}\n")
    output_file.write(string + "\n\n")
    
    output_file2.write(f"{countryName}\n")
    output_file2.write(f"Continent: {continent}\n")
    output_file2.write(f"Crime Index: {countryCrimeIndex}\n")
    if countryInternetSpeed != "":
        output_file2.write(f"Download Speed: {countryInternetSpeed}\n")
    if countryTapWaterIndex != "-1":
        output_file2.write(f"Tap Water Index: {countryTapWaterIndex}\n")
    output_file2.write("\n")
