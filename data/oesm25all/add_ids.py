import csv

rows_to_write = []
with open('data/oesm25all/trimmed.csv', newline='') as csvfile:
    reader = csv.reader(csvfile, delimiter=',')
    for idx, row in enumerate(reader):
        if idx > 0:
            row[0] = idx
        rows_to_write.append(row)

with open('data/oesm25all/trimmed_withIds.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile, delimiter=',')
    writer.writerows(rows_to_write)    