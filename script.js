document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("surveyForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());

      try {
        const res = await fetch("/api/respuestas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (result.success) {
          alert("✅ Respuesta enviada con éxito");
          form.reset();
        }
      } catch (err) {
        alert("❌ Error al enviar la respuesta");
        console.error(err);
      }
    });
  }

  const table = document.getElementById("resultsTable");
  if (table) {
    fetch("/api/respuestas")
      .then((res) => res.json())
      .then((respuestas) => {
        const tbody = table.querySelector("tbody");
        tbody.innerHTML = "";
        const headers = [
          "Nombre",
          "Viaje",
          "Tiempo",
          "Grupo",
          "Gasto",
          "Lomas",
          "Hora Levantarse",
          "Tickets",
          "Mayoría",
          "Hora Transporte",
          "Tarde",
        ];
        respuestas.forEach((r, i) => {
          let row = document.createElement("tr");
          row.classList.add("fade-row");
          Object.values(r).forEach((value, idx) => {
            let td = document.createElement("td");
            td.textContent = value;
            td.setAttribute("data-label", headers[idx]);
            row.appendChild(td);
          });
          setTimeout(() => tbody.appendChild(row), i * 120);
        });
      });
  }
});

async function clearData() {
  if (confirm("¿Seguro que quieres borrar todas las respuestas?")) {
    await fetch("/api/respuestas", { method: "DELETE" });
    location.reload();
  }
}

function startSurvey() {
  document.getElementById("welcomeScreen").style.display = "none";
  document.getElementById("surveyContainer").classList.remove("hidden");
}

function filterTable() {
  const input = document.getElementById("searchInput");
  const filter = input.value.toLowerCase();
  const table = document.getElementById("resultsTable");
  const trs = table.getElementsByTagName("tr");
  for (let i = 1; i < trs.length; i++) {
    const tds = trs[i].getElementsByTagName("td");
    if (tds.length > 0) {
      let name = tds[0].textContent || tds[0].innerText;
      trs[i].style.display = name.toLowerCase().includes(filter) ? "" : "none";
    }
  }
}

function exportToCSV() {
  fetch("/api/respuestas")
    .then((res) => res.json())
    .then((respuestas) => {
      if (respuestas.length === 0) {
        alert("⚠️ No hay respuestas para exportar.");
        return;
      }
      let csv = Object.keys(respuestas[0]).join(",") + "\n";
      respuestas.forEach((r) => {
        csv += Object.values(r)
          .map((v) => `"${v}"`)
          .join(",") + "\n";
      });
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "respuestas_encuesta.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    });
}
