import { defineStore } from 'pinia';

export const useSidemenuStore = defineStore('sidemenuProperties', {
    state: () => ({
        expanded: false
    }),
    actions: {
        toggleSidebar(): void {
            this.expanded = !this.expanded;
        }
    }
});
