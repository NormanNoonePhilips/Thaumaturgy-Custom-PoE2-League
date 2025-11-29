/* ===================================
   POE2 STYLE TOOLTIP SYSTEM
   =================================== */

class PoeTooltipSystem {
    constructor() {
        this.organsData = null;
        this.atlasPassivesData = null;
        this.tooltip = null;
        this.currentItem = null;
        this.hideTimeout = null;

        this.init();
    }

    async init() {
        // Load data files
        await this.loadData();

        // Create tooltip element
        this.createTooltip();

        // Initialize all item references on page
        this.initializeItems();

        console.log('PoE2 Tooltip System initialized');
    }

    // Resolve asset paths so JSON data can use paths relative to assets/
    resolveAssetPath(path) {
        if (!path) return path;
        if (path.startsWith('http') || path.startsWith('/') || path.startsWith('assets/')) return path;
        return 'assets/' + path;
    }

    async loadData() {
        try {
            // Load organs data
            const organsResponse = await fetch('assets/data/organs.json');
            this.organsData = await organsResponse.json();

            // Load atlas passives data
            const passivesResponse = await fetch('assets/data/atlas_passives.json');
            this.atlasPassivesData = await passivesResponse.json();

        } catch (error) {
            console.error('Error loading tooltip data:', error);
        }
    }

    createTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'poe-tooltip';
        this.tooltip.innerHTML = '<div class="poe-tooltip-content"></div>';
        document.body.appendChild(this.tooltip);
    }

    initializeItems() {
        // Find all elements with data-poe-item attribute
        const items = document.querySelectorAll('[data-poe-item]');

        items.forEach(element => {
            const itemId = element.dataset.poeItem;
            const itemType = element.dataset.poeType || 'organ';
            const tier = element.dataset.poeTier || 'purified';

            // Add hover events
            element.addEventListener('mouseenter', (e) => this.showTooltip(e, itemId, itemType, tier));
            element.addEventListener('mousemove', (e) => this.updateTooltipPosition(e));
            element.addEventListener('mouseleave', () => this.hideTooltip());
        });
    }

    showTooltip(event, itemId, itemType, tier) {
        clearTimeout(this.hideTimeout);

        let itemData;

        // Get item data based on type
        if (itemType === 'organ') {
            itemData = this.organsData?.organs?.[itemId];
        } else if (itemType === 'passive') {
            itemData = this.atlasPassivesData?.atlasPassives?.[itemId];
        } else if (itemType === 'currency') {
            itemData = this.organsData?.caged_trophy;
        }

        if (!itemData) {
            console.warn(`Item data not found: ${itemId}`);
            return;
        }

        // Build tooltip content
        const content = this.buildTooltipContent(itemData, itemType, tier);
        this.tooltip.querySelector('.poe-tooltip-content').innerHTML = content;

        // Add keystone class if applicable
        if (itemData.isKeystone) {
            this.tooltip.querySelector('.poe-tooltip-content').classList.add('poe-tooltip-keystone');
        } else {
            this.tooltip.querySelector('.poe-tooltip-content').classList.remove('poe-tooltip-keystone');
        }

        // Position and show tooltip
        this.updateTooltipPosition(event);
        this.tooltip.classList.add('show');

        this.currentItem = { itemId, itemType, tier };
    }

    buildTooltipContent(itemData, itemType, tier) {
        if (itemType === 'organ') {
            return this.buildOrganTooltip(itemData, tier);
        } else if (itemType === 'passive') {
            return this.buildPassiveTooltip(itemData);
        } else if (itemType === 'currency') {
            return this.buildCurrencyTooltip(itemData);
        }
    }

    buildOrganTooltip(organ, tier) {
        const tierData = organ.tiers[tier] || organ.tiers.purified || organ.tiers.unique;
        const rarity = tierData.rarity || 'common';

        let html = `
            <div class="poe-tooltip-header">
                <img src="${this.resolveAssetPath(organ.icon)}" alt="${organ.name}" class="poe-tooltip-icon">
                <div class="poe-tooltip-title">
                    <div class="poe-tooltip-name ${rarity}">${tierData.name}</div>
                    <div class="poe-tooltip-type">${organ.type} - ${organ.slot}</div>
                </div>
            </div>
        `;

        // Item level
        if (tierData.itemLevel) {
            html += `
                <div class="poe-tooltip-section">
                    <span class="poe-tooltip-ilvl">Item Level: ${tierData.itemLevel}</span>
                </div>
            `;
        }

        // Description
        if (organ.description) {
            html += `
                <div class="poe-tooltip-section">
                    <div class="poe-tooltip-value">${organ.description}</div>
                </div>
            `;
        }

        // Effect
        if (tierData.effect) {
            html += `
                <div class="poe-tooltip-section">
                    <div class="poe-tooltip-label">Effect:</div>
                    <div class="poe-tooltip-effect">${tierData.effect}</div>
                </div>
            `;
        }

        // Drop source
        if (tierData.dropSource) {
            html += `
                <div class="poe-tooltip-section">
                    <div class="poe-tooltip-source">Dropped by: ${tierData.dropSource}</div>
                </div>
            `;
        }

        // Tier selector for multi-tier organs
        if (organ.tiers && Object.keys(organ.tiers).length > 1 && !organ.tiers.unique) {
            html += `
                <div class="poe-tooltip-section">
                    <div class="poe-tooltip-tiers">
                        ${Object.keys(organ.tiers).map(t => `
                            <button class="poe-tooltip-tier-btn ${t === tier ? 'active' : ''}" 
                                    data-tier="${t}">
                                ${t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Flavor text
        if (organ.flavorText) {
            html += `
                <div class="poe-tooltip-flavor">${organ.flavorText}</div>
            `;
        }

        return html;
    }

    buildPassiveTooltip(passive) {
        const isKeystone = passive.isKeystone;

        let html = `
            <div class="poe-tooltip-header">
                <img src="${this.resolveAssetPath(passive.icon)}" alt="${passive.name}" class="poe-tooltip-icon">
                <div class="poe-tooltip-title">
                    <div class="poe-tooltip-name ${isKeystone ? 'unique' : 'rare'}">${passive.name}</div>
                    <div class="poe-tooltip-type">${passive.type}</div>
                </div>
            </div>
        `;

        // Effect
        html += `
            <div class="poe-tooltip-section">
                <div class="poe-tooltip-effect">${passive.effect}</div>
            </div>
        `;

        // Description
        if (passive.description) {
            html += `
                <div class="poe-tooltip-section">
                    <div class="poe-tooltip-value">${passive.description}</div>
                </div>
            `;
        }

        // Choices (for keystones with options)
        if (passive.choices && passive.choices.length > 0) {
            html += `
                <div class="poe-tooltip-section">
                    <div class="poe-tooltip-label">Choose one:</div>
                    <ul class="poe-tooltip-choices">
                        ${passive.choices.map(choice => `<li>${choice}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        // Warning
        if (passive.warning) {
            html += `
                <div class="poe-tooltip-warning">
                    ⚠ ${passive.warning}
                </div>
            `;
        }

        // Flavor text
        if (passive.flavorText) {
            html += `
                <div class="poe-tooltip-flavor">${passive.flavorText}</div>
            `;
        }

        return html;
    }

    buildCurrencyTooltip(currency) {
        let html = `
            <div class="poe-tooltip-header">
                <img src="${this.resolveAssetPath(currency.icon)}" alt="${currency.name}" class="poe-tooltip-icon">
                <div class="poe-tooltip-title">
                    <div class="poe-tooltip-name rare">${currency.name}</div>
                    <div class="poe-tooltip-type">${currency.type}</div>
                </div>
            </div>
        `;

        // Description
        html += `
            <div class="poe-tooltip-section">
                <div class="poe-tooltip-value">${currency.description}</div>
            </div>
        `;

        // Effect
        html += `
            <div class="poe-tooltip-section">
                <div class="poe-tooltip-label">Use:</div>
                <div class="poe-tooltip-effect">${currency.effect}</div>
            </div>
        `;

        // Scaling
        if (currency.scaling) {
            html += `
                <div class="poe-tooltip-section">
                    <div class="poe-tooltip-label">Scaling per Trophy:</div>
                    <div class="poe-tooltip-scaling">
                        ${Object.entries(currency.scaling.perTrophy).map(([key, value]) => `
                            <div class="poe-tooltip-scaling-row">
                                <span class="poe-tooltip-scaling-label">${key}:</span>
                                <span class="poe-tooltip-scaling-value">${value}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Drop source
        if (currency.dropSource) {
            html += `
                <div class="poe-tooltip-section">
                    <div class="poe-tooltip-source">Dropped by: ${currency.dropSource}</div>
                </div>
            `;
        }

        // Stack size
        if (currency.stackSize) {
            html += `
                <div class="poe-tooltip-section">
                    <div class="poe-tooltip-value">Stack Size: ${currency.stackSize}</div>
                </div>
            `;
        }

        // Flavor text
        if (currency.flavorText) {
            html += `
                <div class="poe-tooltip-flavor">${currency.flavorText}</div>
            `;
        }

        return html;
    }

    updateTooltipPosition(event) {
        const padding = 20;
        const tooltipRect = this.tooltip.getBoundingClientRect();

        let x = event.clientX + padding;
        let y = event.clientY + padding;

        // Check right edge
        if (x + tooltipRect.width > window.innerWidth) {
            x = event.clientX - tooltipRect.width - padding;
        }

        // Check bottom edge
        if (y + tooltipRect.height > window.innerHeight) {
            y = event.clientY - tooltipRect.height - padding;
        }

        // Ensure tooltip stays on screen
        x = Math.max(padding, Math.min(x, window.innerWidth - tooltipRect.width - padding));
        y = Math.max(padding, Math.min(y, window.innerHeight - tooltipRect.height - padding));

        this.tooltip.style.left = x + 'px';
        this.tooltip.style.top = y + 'px';
    }

    hideTooltip() {
        this.hideTimeout = setTimeout(() => {
            this.tooltip.classList.remove('show');
            this.currentItem = null;
        }, 100);
    }
}

// Initialize tooltip system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.poeTooltips = new PoeTooltipSystem();
});

// Helper function to create item references in HTML
function createPoeItem(itemId, itemType = 'organ', tier = 'purified', displayName = null) {
    return `<span class="poe-item" data-poe-item="${itemId}" data-poe-type="${itemType}" data-poe-tier="${tier}">
        <img src="assets/images/${itemType === 'passive' ? 'passives' : itemType === 'currency' ? 'items' : 'organs'}/${itemId}.png" 
            class="poe-item-icon" alt="${displayName || itemId}">
        <span class="poe-item-name ${tier === 'unique' ? 'unique' : tier === 'purified' ? 'rare' : tier === 'refined' ? 'uncommon' : 'common'}">
            ${displayName || itemId.replace(/_/g, ' ')}
        </span>
    </span>`;
}