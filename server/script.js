const dataContainer = document.getElementById('data-container');
const insertForm = document.getElementById('insert-form');

async function fetchData() {
    try {
        const response = await fetch('http://localhost:3000/api/data'); // Adjust the URL if your backend is running elsewhere
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayData(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        dataContainer.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
    }
}

function displayData(data) {
    dataContainer.innerHTML = ''; // Clear previous data
    if (data && data.length > 0) {
        const ul = document.createElement('ul');
        data.forEach(user => {
            const li = document.createElement('li');
            li.textContent = `ID: ${user.userID}, Username: ${user.userName}, Name: ${user.Name}, Email: ${user.Email}, `; // Adjust based on your table structure
            ul.appendChild(li);
        });
        dataContainer.appendChild(ul);
    } else {
        dataContainer.innerHTML = '<p>No data found.</p>';
    }
}

insertForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const nameInput = document.getElementById('name');
    const valueInput = document.getElementById('value');

    const newData = {
        name: nameInput.value,
        value: valueInput.value
    };

    try {
        const response = await fetch('http://localhost:3000/api/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Data inserted:', result);
        fetchData(); // Refresh the displayed data after successful insertion
        nameInput.value = '';
        valueInput.value = '';
    } catch (error) {
        console.error('Error inserting data:', error);
        // Optionally display an error message to the user
    }
});

// Call fetchData when the script loads
fetchData();