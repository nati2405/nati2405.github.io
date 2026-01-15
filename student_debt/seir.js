// SEIR model simulation (Euler integration)

function runSEIR(beta, sigma, gamma, days, dt = 0.1) {
    let steps = Math.floor(days / dt);

    let S = 0.99;
    let E = 0.01;
    let I = 0.0;
    let R = 0.0;

    let t = [];
    let S_arr = [];
    let E_arr = [];
    let I_arr = [];
    let R_arr = [];

    let maxRisk = 0;
    let peakDay = 0;

    for (let i = 0; i <= steps; i++) {
        let time = i * dt;

        t.push(time);
        S_arr.push(S);
        E_arr.push(E);
        I_arr.push(I);
        R_arr.push(R);

        let risk = E + I;
        if (risk > maxRisk) {
            maxRisk = risk;
            peakDay = time;
        }

        let dS = -beta * S * I;
        let dE = beta * S * I - sigma * E;
        let dI = sigma * E - gamma * I;
        let dR = gamma * I;

        S += dS * dt;
        E += dE * dt;
        I += dI * dt;
        R += dR * dt;
    }

    return {
        t, S_arr, E_arr, I_arr, R_arr,
        maxRisk, peakDay
    };
}
