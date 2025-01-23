function csvToArray(csvContent) {
    const lines = csvContent.split('\n'); // Split the content into lines
    const headers = lines[0].split(','); // First line contains headers
    const data = lines.slice(1); // Remaining lines contain data

    return data.map(line => {
        const values = line.split(',');
        const obj = {};

        headers.forEach((header, index) => {
            obj[header.trim()] = values[index].trim(); // Trim whitespace
        });

        return obj;
    });
}