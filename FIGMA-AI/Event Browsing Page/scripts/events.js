document.addEventListener("DOMContentLoaded", () => {
    const eventContainer = document.querySelector(".event-list");
    const keywordInput = document.getElementById("keyword-search");
    const locationDropdown = document.getElementById("location-dropdown");
    const sortDropdown = document.getElementById("sort-dropdown");
    const resultsText = document.querySelector(".results-text");

    let allEvents = [];
    let filteredEvents = [];


    // ------------------------------
    // 1️⃣ FETCH EVENTS FROM BACKEND
    // ------------------------------
    async function loadEvents() {
        try {
            const res = await fetch("http://localhost:5001/api/events");
            const data = await res.json();

            // Ensure proper formatting
            allEvents = data.map(ev => ({
                id: ev._id,
                title: ev.eventName,
                category: ev.category || "General",
                organizer: ev.organizer,
                date: new Date(ev.date),
                time: ev.time,
                volunteers: ev.volunteers || "100/250",
                location: ev.location || "Sacramento",
                description: ev.details,
                image: "img/rectangle-3.png"   // fallback default
            }));

            filteredEvents = allEvents;
            renderEvents();
        } catch (err) {
            console.error("Error loading events:", err);
        }
    }


    // ------------------------------
    // 2️⃣ RENDER EVENTS INTO CARDS
    // ------------------------------
    function renderEvents() {
        eventContainer.innerHTML = ""; 

        const rows = chunkArray(filteredEvents, 3); // 3 per row

        resultsText.textContent = `Showing ${filteredEvents.length} Results`;

        rows.forEach(row => {
            const rowDiv = document.createElement("div");
            rowDiv.classList.add("event-row");

            row.forEach(ev => {
                const card = document.createElement("article");
                card.classList.add("baseball-card");

                card.innerHTML = `
                    <div class="baseball-cards" data-id="${ev.id}">
                        <img class="event-image" src="${ev.image}" alt="${ev.title}" />
                        <h3 class="event-title">${ev.title}</h3>
                        <div class="event-card-info">
                            <p class="event-org">Org: ${ev.organizer}</p>
                            <p class="event-date">${formatDate(ev.date)} at ${ev.time}</p>
                            <p class="event-volunteers">Volunteers: ${ev.volunteers}</p>
                            <a href="/event/${ev.id}" class="view-details">View Details ></a>
                        </div>
                    </div>
                `;

                // Make entire card clickable
                card.addEventListener("click", () => {
                    window.location.href = `/event/${ev.id}`;
                });

                rowDiv.appendChild(card);
            });

            eventContainer.appendChild(rowDiv);
        });
    }


    // ------------------------------
    // 3️⃣ SEARCH FILTER
    // ------------------------------
    keywordInput.addEventListener("input", () => {
        filterData();
    });

    // ------------------------------
    // 4️⃣ LOCATION FILTER
    // ------------------------------
    locationDropdown.addEventListener("change", () => {
        filterData();
    });

    // ------------------------------
    // 5️⃣ SORT
    // ------------------------------
    sortDropdown.addEventListener("change", () => {
        filterData();
    });

    // ------------------------------
    // FILTERING LOGIC
    // ------------------------------
    function filterData() {
        const keyword = keywordInput.value.toLowerCase();
        const location = locationDropdown.value;
        const sort = sortDropdown.value;

        filteredEvents = allEvents.filter(ev => {
            const matchKeyword =
                ev.title.toLowerCase().includes(keyword) ||
                ev.organizer.toLowerCase().includes(keyword);

            const matchLocation =
                location === "" || ev.location.toLowerCase() === location.toLowerCase();

            return matchKeyword && matchLocation;
        });

        // Sorting logic
        if (sort === "date") {
            filteredEvents.sort((a, b) => a.date - b.date);
        } else if (sort === "most-recent") {
            filteredEvents.sort((a, b) => b.date - a.date);
        }

        renderEvents();
    }


    // ------------------------------
    // HELPERS
    // ------------------------------
    function formatDate(date) {
        return date.toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
            year: "numeric"
        });
    }

    function chunkArray(arr, size) {
        const result = [];
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    }

    // ------------------------------
    // START
    // ------------------------------
    loadEvents();
});
