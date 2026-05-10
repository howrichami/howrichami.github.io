async function calculatePercentile() {
    const input = document.getElementById('networth');
    const btn = document.getElementById('calculate-btn');
    const resultContainer = document.getElementById('result-container');
    const resultValue = document.getElementById('percentile-value');
    const resultText = document.getElementById('result-text');

    const netWorth = parseFloat(input.value);

    if (isNaN(netWorth) || netWorth < 0) {
        alert('Please enter a valid net worth amount.');
        return;
    }

    btn.disabled = true;
    btn.textContent = 'Calculating...';

    try {
        const response = await fetch('data.json');
        const data = await response.json();
        const percentiles = data.percentiles;

        // Find the highest percentile threshold that the user's net worth exceeds
        let userPercentile = 0;
        let thresholdCrossover = 0;

        for (const entry of percentiles) {
            if (netWorth >= entry.threshold) {
                userPercentile = entry.percentile;
                thresholdCrossover = entry.threshold;
                break; // Since percentiles are sorted descending (99, 95, 90...)
            }
        }

        // If net worth is lower than the lowest threshold, it's < 10%
        if (userPercentile === 0 && netWorth >= 0) {
             // In a real app, you'd have a more granular floor.
             // Here we'll just say < 10% if below the lowest threshold.
             userPercentile = 5;
        }

        resultValue.textContent = `${userPercentile}%`;
        resultText.textContent = userPercentile >= 90
            ? `You are among the wealthiest in Singapore!`
            : `Your net worth puts you in the top ${100 - userPercentile}% of the population.`;

        resultContainer.classList.remove('hidden');
    } catch (error) {
        console.error('Error loading wealth data:', error);
        alert('Failed to load wealth data. Please try again later.');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Check Percentile';
    }
}

document.getElementById('calculate-btn').addEventListener('click', calculatePercentile);
