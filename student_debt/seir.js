"use strict";

const DEFAULTS = Object.freeze({ beta: 1, sigma: 1, gamma: 0.1, days: 60 });
const PRESETS = Object.freeze({
    baseline: { ...DEFAULTS, label: "Baseline" },
    pressure: { beta: 1.45, sigma: 1, gamma: 0.1, days: 60, label: "Higher entry" },
    recovery: { beta: 1, sigma: 1, gamma: 0.35, days: 60, label: "Faster recovery" }
});

const COLORS = Object.freeze({
    susceptible: "#32b5ff",
    exposed: "#ff6f91",
    infected: "#ff9f43",
    recovered: "#62f5d0"
});

let chart = null;

function derivatives([S, E, I, R], beta, sigma, gamma) {
    return [
        -beta * S * I,
        beta * S * I - sigma * E,
        sigma * E - gamma * I,
        gamma * I
    ];
}

function addScaled(state, delta, scale) {
    return state.map((value, index) => value + delta[index] * scale);
}

function rk4Step(state, dt, beta, sigma, gamma) {
    const k1 = derivatives(state, beta, sigma, gamma);
    const k2 = derivatives(addScaled(state, k1, dt / 2), beta, sigma, gamma);
    const k3 = derivatives(addScaled(state, k2, dt / 2), beta, sigma, gamma);
    const k4 = derivatives(addScaled(state, k3, dt), beta, sigma, gamma);

    const next = state.map((value, index) => value + (dt / 6) * (
        k1[index] + 2 * k2[index] + 2 * k3[index] + k4[index]
    ));

    const bounded = next.map(value => Math.max(0, value));
    const total = bounded.reduce((sum, value) => sum + value, 0);
    return bounded.map(value => value / total);
}

function runSEIR(beta, sigma, gamma, days, dt = 0.1) {
    const steps = Math.ceil(days / dt);
    let state = [0.99, 0.01, 0, 0];
    const result = { time: [], susceptible: [], exposed: [], infected: [], recovered: [] };
    let peakRisk = state[1] + state[2];
    let peakTime = 0;

    for (let step = 0; step <= steps; step += 1) {
        const time = Math.min(step * dt, days);
        const [S, E, I, R] = state;

        result.time.push(Number(time.toFixed(1)));
        result.susceptible.push(S);
        result.exposed.push(E);
        result.infected.push(I);
        result.recovered.push(R);

        const risk = E + I;
        if (risk > peakRisk) {
            peakRisk = risk;
            peakTime = time;
        }

        if (step < steps) {
            state = rk4Step(state, Math.min(dt, days - time), beta, sigma, gamma);
        }
    }

    return { ...result, peakRisk, peakTime, finalRecovered: state[3] };
}

function readParameters() {
    return {
        beta: Number(document.querySelector("#beta").value),
        sigma: Number(document.querySelector("#sigma").value),
        gamma: Number(document.querySelector("#gamma").value),
        days: Number(document.querySelector("#days").value)
    };
}

function validateParameters({ beta, sigma, gamma, days }) {
    if (![beta, sigma, gamma, days].every(Number.isFinite)) return "Enter a valid number for every parameter.";
    if (beta < 0.05 || beta > 2) return "Entry pressure must be between 0.05 and 2.00.";
    if (sigma < 0.05 || sigma > 2) return "Debt progression must be between 0.05 and 2.00.";
    if (gamma < 0.05 || gamma > 1) return "Recovery must be between 0.05 and 1.00.";
    if (!Number.isInteger(days) || days < 1 || days > 365) return "The simulation horizon must be a whole number from 1 to 365.";
    return "";
}

function percent(value) {
    return `${(value * 100).toFixed(1)}%`;
}

function updateOutputs() {
    ["beta", "sigma", "gamma"].forEach(id => {
        document.querySelector(`#${id}-output`).value = Number(document.querySelector(`#${id}`).value).toFixed(2);
    });
}

function updateInsight(data, params) {
    const recoveryMessage = params.gamma >= 0.3
        ? "The stronger recovery rate reduces the time borrowers remain in the excessive-debt state."
        : "The lower recovery rate keeps borrowers in the excessive-debt state longer.";
    document.querySelector("#model-insight").innerHTML = `
        <span aria-hidden="true">↗</span>
        <p><strong>What this run suggests</strong>${percent(data.peakRisk)} of the modeled population is simultaneously exposed or in excessive debt at the peak. ${recoveryMessage}</p>
    `;
}

function renderChart(data) {
    const fallback = document.querySelector("#chart-fallback");
    const canvas = document.querySelector("#seir-chart");

    if (typeof Chart === "undefined") {
        canvas.hidden = true;
        fallback.hidden = false;
        return;
    }

    canvas.hidden = false;
    fallback.hidden = true;
    if (chart) chart.destroy();

    const commonDataset = { borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 4, tension: 0.18 };
    chart = new Chart(canvas, {
        type: "line",
        data: {
            labels: data.time,
            datasets: [
                { ...commonDataset, label: "Susceptible", data: data.susceptible, borderColor: COLORS.susceptible },
                { ...commonDataset, label: "Exposed", data: data.exposed, borderColor: COLORS.exposed },
                { ...commonDataset, label: "Excessive debt", data: data.infected, borderColor: COLORS.infected },
                { ...commonDataset, label: "Recovered", data: data.recovered, borderColor: COLORS.recovered }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            animation: { duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 500 },
            plugins: {
                legend: { position: "top", labels: { color: "#b9cfde", usePointStyle: true, boxWidth: 8, padding: 18 } },
                tooltip: {
                    callbacks: { label: context => `${context.dataset.label}: ${percent(context.parsed.y)}` }
                }
            },
            scales: {
                x: {
                    grid: { color: "rgba(151, 193, 219, 0.06)" },
                    ticks: { color: "#7894a8", maxTicksLimit: 8 },
                    title: { display: true, text: "Time", color: "#7894a8" }
                },
                y: {
                    min: 0,
                    max: 1,
                    grid: { color: "rgba(151, 193, 219, 0.09)" },
                    ticks: { color: "#7894a8", callback: value => `${Math.round(value * 100)}%` },
                    title: { display: true, text: "Population proportion", color: "#7894a8" }
                }
            }
        }
    });
}

function simulate(label = "Custom run") {
    const params = readParameters();
    const error = validateParameters(params);
    const errorElement = document.querySelector("#form-error");

    errorElement.textContent = error;
    errorElement.hidden = !error;
    if (error) return;

    const data = runSEIR(params.beta, params.sigma, params.gamma, params.days);
    document.querySelector("#peak-value").textContent = percent(data.peakRisk);
    document.querySelector("#peak-day").textContent = `${data.peakTime.toFixed(1)} units`;
    document.querySelector("#recovered-value").textContent = percent(data.finalRecovered);
    document.querySelector("#simulation-status").textContent = label;
    updateInsight(data, params);
    renderChart(data);
}

function applyPreset(name) {
    const preset = PRESETS[name];
    if (!preset) return;

    ["beta", "sigma", "gamma", "days"].forEach(key => {
        document.querySelector(`#${key}`).value = preset[key];
    });
    document.querySelectorAll(".preset").forEach(button => {
        button.classList.toggle("is-active", button.dataset.preset === name);
    });
    updateOutputs();
    simulate(preset.label);
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('input[type="range"]').forEach(input => {
        input.addEventListener("input", () => {
            updateOutputs();
            document.querySelectorAll(".preset").forEach(button => button.classList.remove("is-active"));
        });
    });

    document.querySelector("#days").addEventListener("input", () => {
        document.querySelectorAll(".preset").forEach(button => button.classList.remove("is-active"));
    });

    document.querySelector("#simulation-form").addEventListener("submit", event => {
        event.preventDefault();
        simulate();
    });

    document.querySelector("#reset-button").addEventListener("click", () => applyPreset("baseline"));
    document.querySelectorAll(".preset").forEach(button => {
        button.addEventListener("click", () => applyPreset(button.dataset.preset));
    });

    updateOutputs();
    simulate("Baseline");
});
