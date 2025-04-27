
const incidentList = document.getElementById('incidentList');
const incidentForm = document.getElementById('incidentForm');
const searchBar = document.getElementById('searchBar');
const filterButtons = document.querySelectorAll('.filter-btn');
const sortDate = document.getElementById('sortDate');
const totalCount = document.getElementById('totalCount');
const toggleDarkModeBtn = document.getElementById('toggleDarkMode');


const predefinedIncidents = [
{
title: "AI Drone Misfires",
description: "An autonomous drone mistakenly targeted a civilian vehicle.",
severity: "High",
timestamp: new Date().toISOString()
},
{
title: "Chatbot Spreads Misinformation",
description: "A chatbot provided incorrect medical advice.",
severity: "Medium",
timestamp: new Date().toISOString()
},
{
title: "Minor Data Leak",
description: "Low-risk personal data leak in recommendation engine.",
severity: "Low",
timestamp: new Date().toISOString()
}
];


let incidents = JSON.parse(localStorage.getItem('incidents')) || predefinedIncidents;


function saveIncidents() {
localStorage.setItem('incidents', JSON.stringify(incidents));
}

function renderIncidents() {
incidentList.innerHTML = '';
let filteredIncidents = filterAndSearchIncidents();

if (sortDate.value === 'oldest') {
filteredIncidents.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
} else {
filteredIncidents.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

filteredIncidents.forEach((incident, index) => {
const incidentCard = document.createElement('div');
incidentCard.className = 'incident';
incidentCard.innerHTML = `
    <div class="incident-title">${incident.title} 
    <span class="badge ${incident.severity}">${incident.severity}</span>
    </div>
    <div class="incident-meta">Reported: ${timeAgo(new Date(incident.timestamp))}</div>
    <div class="details">${incident.description}</div>
    <button class="view-details" data-index="${index}">View Details</button>
`;
incidentList.appendChild(incidentCard);
});

totalCount.textContent = filteredIncidents.length;
}

function filterAndSearchIncidents() {
const selectedSeverity = document.querySelector('.filter-btn.active')?.dataset.severity || 'All';
const searchText = searchBar.value.toLowerCase();

return incidents.filter(incident => {
const matchesSeverity = selectedSeverity === 'All' || incident.severity === selectedSeverity;
const matchesSearch = incident.title.toLowerCase().includes(searchText);
return matchesSeverity && matchesSearch;
});
}

incidentForm.addEventListener('submit', (e) => {
e.preventDefault();
const title = document.getElementById('title').value.trim();
const description = document.getElementById('description').value.trim();
const severity = document.getElementById('severity').value;

if (!title || !description || !severity) return;

incidents.push({
title,
description,
severity,
timestamp: new Date().toISOString()
});

saveIncidents();
incidentForm.reset();
renderIncidents();
});

searchBar.addEventListener('input', renderIncidents);

filterButtons.forEach(button => {
button.addEventListener('click', () => {
filterButtons.forEach(btn => btn.classList.remove('active'));
button.classList.add('active');
renderIncidents();
});
});

sortDate.addEventListener('change', renderIncidents);

incidentList.addEventListener('click', (e) => {
if (e.target.classList.contains('view-details')) {
const details = e.target.previousElementSibling;
if (details.style.display === 'block') {
    details.style.display = 'none';
    e.target.textContent = 'View Details';
} else {
    details.style.display = 'block';
    e.target.textContent = 'Hide Details';
}
}
});


toggleDarkModeBtn.addEventListener('click', () => {
document.body.classList.toggle('dark');
if (document.body.classList.contains('dark')) {
toggleDarkModeBtn.textContent = "☀️ Light Mode";
} else {
toggleDarkModeBtn.textContent = "🌙 Dark Mode";
}
});


function timeAgo(date) {
const seconds = Math.floor((new Date() - date) / 1000);
let interval = Math.floor(seconds / 31536000);

if (interval >= 1) return interval + " year(s) ago";
interval = Math.floor(seconds / 2592000);
if (interval >= 1) return interval + " month(s) ago";
interval = Math.floor(seconds / 86400);
if (interval >= 1) return interval + " day(s) ago";
interval = Math.floor(seconds / 3600);
if (interval >= 1) return interval + " hour(s) ago";
interval = Math.floor(seconds / 60);
if (interval >= 1) return interval + " minute(s) ago";
return "just now";
}


renderIncidents();
