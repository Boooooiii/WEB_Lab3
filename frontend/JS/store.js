import { reactive } from 'vue';
import axios from 'axios';
import { calcService } from './api.js';

export const store = reactive({
    state: {
        currentValue: "0",
        previousValue: null,
        operator: null,
        waitingForNewNumber: false
    },

    async fetchState(userId) {
        const data = await calcService.getState(userId);
        if (data) Object.assign(this.state, data);
    },

    async saveState(userId) {
        try {
            await calcService.saveState(userId, this.state);
        } catch (e) {
            console.error("Ďîěčëęŕ çáĺđĺćĺíí˙", e);
        }
    },

    dispatch(actionType, payload) {
        const newState = this.reducer(this.state, actionType, payload);
        Object.assign(this.state, newState);
    },

    reducer(state, type, payload) {
        switch (type) {
            case 'DIGIT':
                if (state.waitingForNewNumber) {
                    return { ...state, currentValue: payload, waitingForNewNumber: false };
                }
                if (payload === '.') {
                    return {
                        ...state,
                        currentValue: state.currentValue.includes('.')
                            ? state.currentValue
                            : state.currentValue + payload
                    };
                }
                return {
                    ...state,
                    currentValue: state.currentValue === "0" ? payload : state.currentValue + payload
                };

            case 'OP':
                return {
                    ...state,
                    previousValue: state.currentValue,
                    operator: payload,
                    waitingForNewNumber: true
                };

            case 'FAST OP':
                const tempState = { ...state, operator: payload };
                const resultF = this.calculate(tempState);
                return { ...state, currentValue: String(resultF) };

            case 'EQUALS':
                if (!state.operator || state.previousValue === null) return state;
                const res = this.calculate(state);
                return {
                    currentValue: String(res),
                    previousValue: null,
                    operator: null,
                    waitingForNewNumber: true
                };

            case 'CLEAR':
                return { currentValue: "0", previousValue: null, operator: null, waitingForNewNumber: false };

            case 'CLEAR CURRENT':
                return { ...state, currentValue: "0" };

            case 'DELETE':
                return {
                    ...state,
                    currentValue: state.currentValue.length > 1 ? state.currentValue.slice(0, -1) : "0"
                };

            default:
                return state;
        }
    },

    calculate({ previousValue, currentValue, operator }) {
        const a = parseFloat(previousValue);
        const b = parseFloat(currentValue);
        switch (operator) {
            case '+': return a + b;
            case '*': return a * b;
            case '/': return b !== 0 ? a / b : "Error";
            case '-': return a - b;
            case '^2': return b * b;
            case '1/': return b !== 0 ? 1 / b : "Error";
            case '2sqrt': return Math.sqrt(b);
            case '%': return a % b;
            case '+/-': return b * -1;
            default: return b;
        }
    }
});
