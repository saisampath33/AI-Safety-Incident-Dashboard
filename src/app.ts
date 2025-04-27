interface Incident {
  id: number;
  title: string;
  description: string;
  severity: "Low" | "Medium" | "High";
  reported_at: string;
}

let incidents: Incident[] = [
  {
    id: 1,
    title: "Biased Recommendation Algorithm",
    description: "Algorithm consistently favored certain demographics...",
    severity: "Medium",
    reported_at: "2025-03-15T10:00:00Z",
  },
  {
    id: 2,
    title: "LLM Hallucination in Critical Info",
    description: "LLM provided incorrect safety procedure information...",
    severity: "High",
    reported_at: "2025-04-01T14:30:00Z",
  },
  {
    id: 3,
    title: "Minor Data Leak via Chatbot",
    description: "Chatbot inadvertently exposed non-sensitive user metadata...",
    severity: "Low",
    reported_at: "2025-03-20T09:15:00Z",
  },
];

const incidentList = document.getElementById('incidentList') as HTMLDivElement;
const filterSeverity = document.getElementById('filterSeverity') as HTMLSelectElement;
const sortDate = document.getElementById('sortDate') as HTMLSelectElement;
const form = document.getElementById('incidentForm') as HTMLFormElement;
const titleInput = document.getElementById('title') as HTMLInputElement;
const descriptionInput = document.getElementById('description') as HTMLTextAreaElement;
const severityInput = document.getElementById('severity') as HTMLSelectElement;

function renderIncidents(): void {
  const severityFilter = filterSeverity.value;
  const sortOption = sortDate.value;

  let filteredIncidents = incidents.slice(); // copy the array

  if (severityFilter !== "All") {
    filteredIncidents = filteredIncidents.filter(incident => incident.severity === severityFilter);
  }

  if (sortOption === "newest") {
    filteredIncidents.sort((a, b) => new Date(b.reported_at).getTime() - new Date(a.reported_at).getTime());
  } else {
    filteredIncidents.sort((a, b) => new Date(a.reported_at).getTime() - new Date(b.reported_at).getTime());
  }

  incidentList.innerHTML = '';

  filteredIncidents.forEach(incident => {
    const incidentDiv = document.createElement('div');
    incidentDiv.className = 'incident';
    incidentDiv.innerHTML = `
      <div class="incident-title">${incident.title}</div>
      <div class="incident-meta">
        Severity: <strong>${incident.severity}</strong> |
        Reported: ${new Date(incident.reported_at).toLocaleDateString()}
      </div>
      <button class="view-details">View Details</button>
      <div class="details" style="display: none;">${incident.description}</div>
    `;

    const viewDetailsBtn = incidentDiv.querySelector('.view-details') as HTMLButtonElement;
    const detailsDiv = incidentDiv.querySelector('.details') as HTMLDivElement;

    viewDetailsBtn.addEventListener('click', () => {
      const isVisible = detailsDiv.style.display === 'block';
      detailsDiv.style.display = isVisible ? 'none' : 'block';
      viewDetailsBtn.textContent = isVisible ? 'View Details' : 'Hide Details';
    });

    incidentList.appendChild(incidentDiv);
  });
}

filterSeverity.addEventListener('change', renderIncidents);
sortDate.addEventListener('change', renderIncidents);

form.addEventListener('submit', (e: Event) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const severity = severityInput.value as "Low" | "Medium" | "High";

  if (!title || !description || !severity) {
    alert("Please fill all fields.");
    return;
  }

  const newIncident: Incident = {
    id: incidents.length + 1,
    title,
    description,
    severity,
    reported_at: new Date().toISOString(),
  };

  incidents.push(newIncident);

  form.reset(); // cleaner form clearing
  renderIncidents();
});

renderIncidents();
