# crime_index
# download_speed
# mobile_download_speed
# tap_water_index

file = open("country_metadata.txt", "r")

new_country = True

crime_index = []
download_speed = []
mobile_download_speed = []
tap_water_index = []
lgbtq_rank = []

for line in file:
    if line.strip() == "":
        new_country = True
        continue
    if new_country:
        new_country = False
        continue
    else:
        key, value = line.strip().split(": ")

        if key == "Continent":
            continue

        value = float(value)
        if key == "Crime_Index":
            crime_index.append(value)
        elif key == "Download_Speed":
            download_speed.append(value)
        elif key == "Mobile_Download_Speed":
            mobile_download_speed.append(value)
        elif key == "Tap_Water_Index":
            tap_water_index.append(value)
        elif key == "LGBTQ_Rank":
            lgbtq_rank.append(value)

file.close()

# Calculate median
def median(data):
    data.sort()
    n = len(data)
    if n % 2 == 0:
        return (data[n // 2 - 1] + data[n // 2]) / 2
    else:
        return data[n // 2]

# Calculate 75th percentile
def percentile_75(data):
    data.sort()
    n = len(data)
    index = 0.75 * (n - 1)
    lower = int(index)
    upper = lower + 1
    if upper >= n:
        return data[lower]
    return data[lower] + (data[upper] - data[lower]) * (index - lower)

# Calculate 25th percentile
def percentile_25(data):
    data.sort()
    n = len(data)
    index = 0.25 * (n - 1)
    lower = int(index)
    upper = lower + 1
    if upper >= n:
        return data[lower]
    return data[lower] + (data[upper] - data[lower]) * (index - lower)

# Calculate thresholds
crime_index_threshold = median(crime_index)
download_speed_threshold = median(download_speed)
mobile_download_speed_threshold = median(mobile_download_speed)
tap_water_index_threshold = median(tap_water_index)
lgbtq_rank_threshold = median(lgbtq_rank)

# Calculate 75th percentile thresholds
crime_index_75th = percentile_75(crime_index)
download_speed_75th = percentile_75(download_speed)
mobile_download_speed_75th = percentile_75(mobile_download_speed)
tap_water_index_75th = percentile_75(tap_water_index)
lgbtq_rank_75th = percentile_75(lgbtq_rank)

# Calculate 25th percentile thresholds
crime_index_25th = percentile_25(crime_index)
download_speed_25th = percentile_25(download_speed)
mobile_download_speed_25th = percentile_25(mobile_download_speed)
tap_water_index_25th = percentile_25(tap_water_index)
lgbtq_rank_25th = percentile_25(lgbtq_rank)

# Print 50% thresholds
print("Crime Index Threshold:", crime_index_threshold)
print("Download Speed Threshold:", download_speed_threshold)
print("Mobile Download Speed Threshold:", mobile_download_speed_threshold)
print("Tap Water Index Threshold:", tap_water_index_threshold)
print("LGBTQ Rank Threshold:", lgbtq_rank_threshold)

print()

# Print 75% thresholds
print("Crime Index 75th Percentile:", crime_index_75th)
print("Download Speed 75th Percentile:", download_speed_75th)
print("Mobile Download Speed 75th Percentile:", mobile_download_speed_75th)
print("Tap Water Index 75th Percentile:", tap_water_index_75th)
print("LGBTQ Rank 75th Percentile:", lgbtq_rank_75th)

print()

# Print 25% thresholds
print("Crime Index 25th Percentile:", crime_index_25th)
print("Download Speed 25th Percentile:", download_speed_25th)
print("Mobile Download Speed 25th Percentile:", mobile_download_speed_25th)
print("Tap Water Index 25th Percentile:", tap_water_index_25th)
print("LGBTQ Rank 25th Percentile:", lgbtq_rank_25th)