let chart;

// SEIR simulation
function simulateSEIR(beta, sigma, gamma) {
  const S = [0.99], E = [0.01], I = [0], R = [0];
  const dt = 1;
  const steps = 60;

  for (let t = 1; t < steps; t++) {
    const dS = -beta * S[t-1] * I[t-1];
    const dE = beta * S[t-1] * I[t-1] - sigma * E[t-1];
    const dI = sigma * E[t-1] - gamma * I[t-1];
    const dR = gamma * I[t-1];

    S.push(S[t-1] + dS * dt);
    E.push(E[t-1] + dE * dt);
    I.push(I[t-1] + dI * dt);
    R.push(R[t-1] + dR * dt);
  }

  return { S, E, I, R };
}

// Render chart
function runSimulation() {
  const beta = parseFloat(document.getElementById("beta").value);
  const sigma = parseFloat(document.getElementById("sigma").value);
  const gamma = parseFloat(document.getElementById("gamma").value);

  const data = simulateSEIR(beta, sigma, gamma);
  const peakRisk = Math.max(...data.E.map((v, i) => v + data.I[i]));

  document.getElementById("interpretText").innerText =
    `Peak financial stress occurs when Exposed + Infected reaches ${(peakRisk*100).toFixed(1)}%.
     Higher β increases accumulation risk, while higher γ accelerates resolution.`;

  const ctx = document.getElementById("seirChart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.S.map((_, i) => i),
      datasets: [
        { label: "Susceptible", data: data.S },
        { label: "Exposed", data: data.E },
        { label: "Infected", data: data.I },
        { label: "Recovered", data: data.R }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: "#e6edf3" } } },
      scales: {
        x: { ticks: { color: "#9bb4c8" } },
        y: { ticks: { color: "#9bb4c8" } }
      }
    }
  });
}

// Initial render (IMPORTANT)
runSimulation();
