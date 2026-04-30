import items from './data.js';
import { greedyOptimize } from './greedy.js';

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const itemTableBody = document.getElementById('item-table-body');
    const budgetInput = document.getElementById('budget-input');
    const optimizeBtn = document.getElementById('optimize-btn');
    const inputSection = document.getElementById('input-section');
    const resultsSection = document.getElementById('results-section');
    const resetBtn = document.getElementById('reset-btn');
    
    // Result Display Elements
    const stepsContainer = document.getElementById('steps-container');
    const finalCartBody = document.getElementById('final-cart-body');
    const totalSpentEl = document.getElementById('total-spent');
    const totalUtilityEl = document.getElementById('total-utility');
    const remainingBudgetEl = document.getElementById('remaining-budget');
    const budgetProgress = document.getElementById('budget-progress');
    const spentPercentageEl = document.getElementById('spent-percentage');

    /**
     * Initial Render of the Item Table
     */
    function renderItemTable() {
        // Calculate ratio for sorting
        const itemsWithRatio = items.map(item => ({
            ...item,
            ratio: (item.utility / item.price).toFixed(4)
        }));

        // Sort by ratio descending
        itemsWithRatio.sort((a, b) => b.ratio - a.ratio);

        itemTableBody.innerHTML = itemsWithRatio.map((item, index) => `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${item.name}</strong></td>
                <td>${item.category}</td>
                <td>₹${item.price}</td>
                <td>${item.utility}/10</td>
                <td><code>${item.ratio}</code></td>
            </tr>
        `).join('');
    }

    /**
     * Render the Optimization Results
     */
    function renderResults(results, originalBudget) {
        // 1. Render Steps
        stepsContainer.innerHTML = results.steps.map(step => `
            <div class="step-card ${step.action.toLowerCase()}">
                <div class="step-info">
                    <h4>${step.item.name}</h4>
                    <p>Price: ₹${step.item.price} | Utility: ${step.item.utility}</p>
                    <p><em>${step.reason}</em></p>
                </div>
                <div class="step-action">
                    <span class="step-badge">${step.action}</span>
                </div>
            </div>
        `).join('');

        // 2. Render Final Cart Table
        finalCartBody.innerHTML = results.selected.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>₹${item.price}</td>
                <td>${item.utility}</td>
            </tr>
        `).join('');

        // 3. Update Summary Totals
        totalSpentEl.textContent = `₹${results.totalSpent}`;
        totalUtilityEl.textContent = results.totalUtility;
        remainingBudgetEl.textContent = `₹${results.remainingBudget}`;

        // 4. Update Progress Bar
        const percentage = Math.min(100, (results.totalSpent / originalBudget) * 100);
        budgetProgress.style.width = `${percentage}%`;
        spentPercentageEl.textContent = Math.round(percentage);

        // Switch Views
        inputSection.classList.add('hidden');
        resultsSection.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Handle Optimization Click
     */
    optimizeBtn.addEventListener('click', () => {
        const budget = parseFloat(budgetInput.value);

        if (isNaN(budget) || budget <= 0) {
            alert('Please enter a valid budget greater than 0.');
            return;
        }

        const results = greedyOptimize(items, budget);
        renderResults(results, budget);
    });

    /**
     * Handle Reset Click
     */
    resetBtn.addEventListener('click', () => {
        resultsSection.classList.add('hidden');
        inputSection.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Initialize the app
    renderItemTable();
});
