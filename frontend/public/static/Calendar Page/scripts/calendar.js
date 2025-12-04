document.addEventListener("DOMContentLoaded", async () => {
    const calendarEl = document.getElementById("calendar");
    const eventListEl = document.getElementById("event-list");

    // Load events from the backend
    async function loadEvents() {
        try {
            const res = await fetch("http://localhost:5001/api/events");
            const data = await res.json();

            // Convert backend date ISO format into YYYY-MM-DD
            return data.map(ev => {
                const isoDate = new Date(ev.date).toISOString().split("T")[0];

                return {
                    title: ev.eventName,
                    date: isoDate,
                    description: ev.details,
                    organizer: ev.organizer,
                    time: ev.time
                };
            });
        } catch (err) {
            console.error("Error loading events:", err);
            return [];
        }
    }

    const events = await loadEvents();

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        headerToolbar: {
            left: "prev,next",
            center: "title",
            right: ""
        },
        events: events,

        dateClick(info) {
            const clickedDate = info.dateStr;
            const todaysEvents = events.filter(ev => ev.date === clickedDate);

            if (todaysEvents.length === 0) {
                eventListEl.innerHTML =
                    "<li class='event-item'>No events for this day.</li>";
                return;
            }

            eventListEl.innerHTML = todaysEvents
                .map(ev => `
                    <li class="event-item">
                        <strong>${ev.title}</strong><br>
                        Organizer: ${ev.organizer}<br>
                        Time: ${ev.time}<br>
                        <small>${ev.description}</small><br>
                        <span>${ev.date}</span>
                    </li>
                `)
                .join("");
        }
    });

    calendar.render();
});
