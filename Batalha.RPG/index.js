const { createApp } = Vue;

createApp({
    data() {
        return {
            hero: { 
                life: 100, 
                name: "Jubileu", 
                potions: 3, 
                isDefending: false, 
                isAttacking: false,
                isHealing: false,
                isFleeing: false,
                action: 'idle' // Gerencia a ação atual
            },
            villain: { 
                life: 100, 
                name: "Craudio", 
                isDefending: false, 
                isAttacking: false, 
                potions: 2,
                isHealing: false,
                action: 'idle' // Gerencia a ação atual
            },
            log: [],
            isGameOver: false,
        }
    },
    computed: {
        heroEmoji() {
            switch(this.hero.action) {
                case 'attack':
                    return '🗡️';
                case 'defend':
                    return '🛡️';
                case 'heal':
                    return '🍵';
                case 'flee':
                    return '🏃‍♂️';
                default:
                    return '😀';
            }
        },
        villainEmoji() {
            switch(this.villain.action) {
                case 'attack':
                    return '⚔️';
                case 'defend':
                    return '🛡️';
                case 'heal':
                    return '💉';
                default:
                    return '😈';
            }
        }
    },
    methods: {
        updateAction(character, action) {
            if(character === 'hero') {
                this.hero.action = action;
            } else if(character === 'villain') {
                this.villain.action = action;
            }
        },
        attack(isHero) {
            if (this.isGameOver) return;

            if (isHero) {
                this.hero.isAttacking = true;
                this.updateAction('hero', 'attack');
                const damage = this.calculateDamage(15, 25);
                setTimeout(() => {
                    if (this.villain.isDefending) {
                        this.addLog(`${this.hero.name} ataca ${this.villain.name} com ${damage} de dano (defesa do vilão ativa).`);
                        this.villain.life -= Math.max(damage - 10, 0);
                    } else {
                        this.addLog(`${this.hero.name} ataca ${this.villain.name} causando ${damage} de dano.`);
                        this.villain.life -= damage;
                    }
                    this.checkGameOver();
                    this.hero.isAttacking = false;
                    this.updateAction('hero', 'idle');
                    if (!this.isGameOver) {
                        this.villainAction();
                    }
                }, 500); // Tempo da animação de ataque
            } else {
                this.villain.isAttacking = true;
                this.updateAction('villain', 'attack');
                const damage = this.calculateDamage(10, 20);
                setTimeout(() => {
                    if (this.hero.isDefending) {
                        this.addLog(`${this.villain.name} ataca ${this.hero.name} com ${damage} de dano (defesa do herói ativa).`);
                        this.hero.life -= Math.max(damage - 10, 0);
                    } else {
                        this.addLog(`${this.villain.name} ataca ${this.hero.name} causando ${damage} de dano.`);
                        this.hero.life -= damage;
                    }
                    this.checkGameOver();
                    this.villain.isAttacking = false;
                    this.updateAction('villain', 'idle');
                }, 500); // Tempo da animação de ataque
            }
        },
        defense(isHero) {
            if (this.isGameOver) return;

            if (isHero) {
                this.hero.isDefending = true;
                this.updateAction('hero', 'defend');
                this.addLog(`${this.hero.name} está defendendo.`);
                setTimeout(() => {
                    this.hero.isDefending = false;
                    this.updateAction('hero', 'idle');
                    this.villainAction();
                }, 1000); // Tempo da animação de defesa
            } else {
                this.villain.isDefending = true;
                this.updateAction('villain', 'defend');
                this.addLog(`${this.villain.name} está defendendo.`);
                setTimeout(() => {
                    this.villain.isDefending = false;
                    this.updateAction('villain', 'idle');
                }, 1000); // Tempo da animação de defesa
            }
        },
        usePotion(isHero) {
            if (this.isGameOver) return;

            if (isHero) {
                if (this.hero.potions > 0 && this.hero.life < 100) {
                    this.addLog(`${this.hero.name} está usando uma poção...`);
                    this.hero.isHealing = true; // Novo estado para animação
                    this.updateAction('hero', 'heal');
                    setTimeout(() => {
                        const heal = this.calculateDamage(20, 30);
                        this.hero.life = Math.min(this.hero.life + heal, 100);
                        this.hero.potions -= 1;
                        this.addLog(`${this.hero.name} usa uma poção e recupera ${heal} de vida.`);
                        this.checkGameOver();
                        this.hero.isHealing = false; // Remove a classe após a animação
                        this.updateAction('hero', 'idle');
                        this.villainAction();
                    }, 1000); // Tempo da animação de uso de poção
                } else {
                    this.addLog(`${this.hero.name} não pode usar uma poção.`);
                }
            } else {
                if (this.villain.potions > 0 && this.villain.life < 100) {
                    this.addLog(`${this.villain.name} está usando uma poção...`);
                    this.villain.isHealing = true; // Novo estado para animação
                    this.updateAction('villain', 'heal');
                    setTimeout(() => {
                        const heal = this.calculateDamage(15, 25);
                        this.villain.life = Math.min(this.villain.life + heal, 100);
                        this.villain.potions -= 1;
                        this.addLog(`${this.villain.name} usa uma poção e recupera ${heal} de vida.`);
                        this.villain.isHealing = false; // Remove a classe após a animação
                        this.updateAction('villain', 'idle');
                    }, 1000); // Tempo da animação de uso de poção
                } else {
                    this.addLog(`${this.villain.name} não pode usar uma poção.`);
                }
            }
        },
        flee() {
            if (this.isGameOver) return;

            this.addLog(`${this.hero.name} está tentando fugir...`);
            this.hero.isFleeing = true; // Novo estado para animação
            this.updateAction('hero', 'flee');
            setTimeout(() => {
                const success = Math.random() < 0.5;
                if (success) {
                    this.addLog(`${this.hero.name} conseguiu fugir!`);
                    this.isGameOver = true;
                } else {
                    this.addLog(`${this.hero.name} tentou fugir, mas falhou!`);
                    this.villainAction();
                }
                this.hero.isFleeing = false; // Remove a classe após a animação
                this.updateAction('hero', 'idle');
            }, 1000); // Tempo da animação de fuga
        },
        villainAction() {
            if (this.isGameOver) return;

            const actions = ['attack', 'defense', 'usePotion'];
            const randomAction = actions[Math.floor(Math.random() * actions.length)];
            this[randomAction](false);
        },
        calculateDamage(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        addLog(message) {
            this.log.unshift(message);
            if (this.log.length > 10) {
                this.log.pop();
            }
        },
        checkGameOver() {
            if (this.villain.life <= 0 && this.hero.life > 0) {
                this.addLog(`${this.hero.name} venceu o combate!`);
                this.isGameOver = true;
            } else if (this.hero.life <= 0 && this.villain.life > 0) {
                this.addLog(`${this.villain.name} venceu o combate!`);
                this.isGameOver = true;
            } else if (this.hero.life <= 0 && this.villain.life <= 0) {
                this.addLog(`O combate terminou empatado!`);
                this.isGameOver = true;
            }
        }
    }
}).mount("#app");
