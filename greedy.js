/**
 * Performs a greedy optimization to select items within a budget.
 * @param {Array} items - List of items with price and utility.
 * @param {number} budget - Total available budget.
 * @returns {Object} - Result containing selected items, steps, and totals.
 */
export function greedyOptimize(items, budget) {
    // Step 1: Calculate ratio and clone items to avoid mutation
    const itemsWithRatio = items.map(item => ({
        ...item,
        ratio: item.utility / item.price
    }));

    // Step 2: Sort by ratio (DESC), then by price (ASC) as tiebreaker
    itemsWithRatio.sort((a, b) => {
        if (b.ratio !== a.ratio) {
            return b.ratio - a.ratio;
        }
        return a.price - b.price;
    });

    const selected = [];
    const steps = [];
    let remainingBudget = budget;
    let totalSpent = 0;
    let totalUtility = 0;

    // Step 3: Greedy selection
    for (const item of itemsWithRatio) {
        const canAfford = item.price <= remainingBudget;
        
        if (canAfford) {
            remainingBudget -= item.price;
            totalSpent += item.price;
            totalUtility += item.utility;
            selected.push(item);
            
            steps.push({
                item,
                action: 'PICKED',
                currentBudget: remainingBudget + item.price,
                remainingAfter: remainingBudget,
                reason: `Item price (${item.price}) is within remaining budget.`
            });
        } else {
            steps.push({
                item,
                action: 'SKIPPED',
                currentBudget: remainingBudget,
                remainingAfter: remainingBudget,
                reason: `Item price (${item.price}) exceeds remaining budget.`
            });
        }
    }

    return {
        selected,
        steps,
        totalSpent,
        totalUtility,
        remainingBudget: parseFloat(remainingBudget.toFixed(2))
    };
}
