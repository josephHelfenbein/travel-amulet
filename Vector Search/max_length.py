# Step 1: Open the file in read mode
file_path = 'country_data.txt'

# Using 'with' statement to ensure the file is properly closed
with open(file_path, 'r', encoding="utf-8") as file:
    # Step 2: Read all lines from the file
    lines = file.readlines()

# Step 3: Calculate the length of each line
line_lengths = [len(line) for line in lines]

# Step 4: Find the maximum length among all lines
max_length = max(line_lengths)

# Step 5: Print the maximum length
print("The maximum number of characters in a line is:", max_length)