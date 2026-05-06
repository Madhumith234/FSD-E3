// js/script.js
// This script handles the interactive preview using localStorage.
// In the actual PHP project, this logic is handled by the server.

document.addEventListener('DOMContentLoaded', () => {
    initData();
    renderNav();
    if (document.getElementById('event-grid')) renderEvents();
    if (document.getElementById('login-form')) initLogin();
    if (document.getElementById('register-form')) initRegister();
    if (document.getElementById('bookings-table')) renderBookings();
    if (document.getElementById('admin-stats')) renderAdminStats();
    if (document.getElementById('manage-events-table')) renderManageEvents();
});

function initData() {
    if (!localStorage.getItem('events')) {
        const initialEvents = [
            { id: 1, name: 'Tech Conference 2026', date: '2026-05-15', location: 'San Francisco, CA', price: 299, available_tickets: 50, description: 'Learn the latest in AI and Web Development.' },
            { id: 2, name: 'Music Festival', date: '2026-06-20', location: 'Austin, TX', price: 150, available_tickets: 100, description: 'A weekend of live music and food.' },
            { id: 3, name: 'Startup Pitch Night', date: '2026-04-10', location: 'New York, NY', price: 50, available_tickets: 30, description: 'Watch the next big things pitch their ideas.' }
        ];
        localStorage.setItem('events', JSON.stringify(initialEvents));
    }
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([
            { id: 1, name: 'Admin', email: 'admin@eventflow.com', password: 'admin123', role: 'admin' }
        ]));
    }
    if (!localStorage.getItem('bookings')) {
        localStorage.setItem('bookings', JSON.stringify([]));
    }
}

function renderNav() {
    const navLinks = document.getElementById('nav-links');
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    let html = '<a href="index.html">Home</a>';
    if (user) {
        if (user.role === 'user') {
            html += '<a href="my_bookings.html">My Bookings</a>';
        } else {
            html += '<a href="admin_dashboard.html">Admin Dashboard</a>';
            html += '<a href="manage_events.html">Manage Events</a>';
        }
        html += `<span class="user-name">Hi, ${user.name}</span>`;
        html += '<a href="#" onclick="logout()" class="btn-logout">Logout</a>';
    } else {
        html += '<a href="login.html">Login</a>';
        html += '<a href="register.html" class="btn-register">Register</a>';
    }
    navLinks.innerHTML = html;
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function renderEvents() {
    const grid = document.getElementById('event-grid');
    const events = JSON.parse(localStorage.getItem('events'));
    
    grid.innerHTML = events.map(event => `
        <div class="event-card">
            <div class="event-info">
                <h3>${event.name}</h3>
                <div class="event-meta">
                    <p>📍 ${event.location}</p>
                    <p>📅 ${new Date(event.date).toLocaleDateString()}</p>
                    <p>🎟️ ${event.available_tickets} Tickets Left</p>
                </div>
                <p style="margin-bottom: 20px; font-size: 14px; color: #555;">${event.description}</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 20px; font-weight: bold; color: #27ae60;">$${event.price}</span>
                    <a href="book_ticket.html?id=${event.id}" class="btn-book" style="width: auto; padding: 8px 20px;">Book Now</a>
                </div>
            </div>
        </div>
    `).join('');
}

function initLogin() {
    const form = document.getElementById('login-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.email.value;
        const password = form.password.value;
        const users = JSON.parse(localStorage.getItem('users'));
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'index.html';
        } else {
            alert('Invalid credentials');
        }
    });
}

function initRegister() {
    const form = document.getElementById('register-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem('users'));
        const newUser = {
            id: Date.now(),
            name: form.name.value,
            email: form.email.value,
            password: form.password.value,
            role: 'user'
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        alert('Registration successful! Please login.');
        window.location.href = 'login.html';
    });
}

function renderBookings() {
    const table = document.getElementById('bookings-table');
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const bookings = JSON.parse(localStorage.getItem('bookings')).filter(b => b.user_id === user.id);
    const events = JSON.parse(localStorage.getItem('events'));
    
    if (bookings.length === 0) {
        table.innerHTML = '<tr><td colspan="4" style="text-align: center;">No bookings found.</td></tr>';
        return;
    }

    table.innerHTML = bookings.map(b => {
        const event = events.find(e => e.id === b.event_id);
        return `
            <tr>
                <td style="font-weight: bold;">${event.name}</td>
                <td>
                    <div style="font-size: 14px;">${new Date(event.date).toLocaleDateString()}</div>
                    <div style="font-size: 12px; color: #777;">${event.location}</div>
                </td>
                <td>${b.tickets}</td>
                <td>${new Date(b.booking_date).toLocaleString()}</td>
            </tr>
        `;
    }).join('');
}

function renderAdminStats() {
    const events = JSON.parse(localStorage.getItem('events'));
    const bookings = JSON.parse(localStorage.getItem('bookings'));
    const users = JSON.parse(localStorage.getItem('users')).filter(u => u.role === 'user');
    
    document.getElementById('total-events').innerText = events.length;
    document.getElementById('total-bookings').innerText = bookings.length;
    document.getElementById('total-users').innerText = users.length;
}

function renderManageEvents() {
    const table = document.getElementById('manage-events-table');
    const events = JSON.parse(localStorage.getItem('events'));
    
    table.innerHTML = events.map(event => `
        <tr>
            <td style="font-weight: bold;">${event.name}</td>
            <td>
                <div style="font-size: 14px;">${new Date(event.date).toLocaleDateString()}</div>
                <div style="font-size: 12px; color: #777;">${event.location}</div>
            </td>
            <td>$${event.price}</td>
            <td>${event.available_tickets}</td>
            <td>
                <button onclick="deleteEvent(${event.id})" style="color: #e74c3c; background: none; border: none; font-weight: bold; cursor: pointer;">Delete</button>
            </td>
        </tr>
    `).join('');
}

window.deleteEvent = (id) => {
    if (!confirm('Are you sure?')) return;
    let events = JSON.parse(localStorage.getItem('events'));
    events = events.filter(e => e.id !== id);
    localStorage.setItem('events', JSON.stringify(events));
    renderManageEvents();
    renderAdminStats();
};

window.addEvent = (e) => {
    e.preventDefault();
    const events = JSON.parse(localStorage.getItem('events'));
    const newEvent = {
        id: Date.now(),
        name: e.target.name.value,
        date: e.target.date.value,
        location: e.target.location.value,
        price: parseFloat(e.target.price.value),
        available_tickets: parseInt(e.target.available_tickets.value),
        description: e.target.description.value
    };
    events.push(newEvent);
    localStorage.setItem('events', JSON.stringify(events));
    alert('Event added!');
    e.target.reset();
    renderManageEvents();
    renderAdminStats();
};

window.bookTickets = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        alert('Please login first');
        window.location.href = 'login.html';
        return;
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = parseInt(urlParams.get('id'));
    const tickets = parseInt(e.target.tickets.value);
    
    let events = JSON.parse(localStorage.getItem('events'));
    const eventIndex = events.findIndex(e => e.id === eventId);
    
    if (events[eventIndex].available_tickets < tickets) {
        alert('Not enough tickets!');
        return;
    }
    
    events[eventIndex].available_tickets -= tickets;
    localStorage.setItem('events', JSON.stringify(events));
    
    const bookings = JSON.parse(localStorage.getItem('bookings'));
    bookings.push({
        id: Date.now(),
        user_id: user.id,
        event_id: eventId,
        tickets: tickets,
        booking_date: new Date().toISOString()
    });
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    alert('Booking successful!');
    window.location.href = 'my_bookings.html';
};
