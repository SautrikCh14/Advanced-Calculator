class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }

    delete() {
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = (this.currentOperand === '0' && number !== '.') ? number : this.currentOperand + number;
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+': computation = prev + current; break;
            case '-': computation = prev - current; break;
            case '×': computation = prev * current; break;
            case '÷': computation = current !== 0 ? prev / current : 'Error'; break;
            case '^': computation = Math.pow(prev, current); break;
            default: return;
        }

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
    }

    performScientificOperation(operation) {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;

        let result;
        switch (operation) {
            case 'sqrt': result = Math.sqrt(current); break;
            case 'square': result = Math.pow(current, 2); break;
            case 'cube': result = Math.pow(current, 3); break;
            case 'sin': result = Math.sin(current); break;
            case 'cos': result = Math.cos(current); break;
            case 'tan': result = Math.tan(current); break;
            case 'log': result = current > 0 ? Math.log10(current) : 'Error'; break;
            case 'ln': result = current > 0 ? Math.log(current) : 'Error'; break;
            case 'percent': result = current / 100; break;
            default: return;
        }

        this.currentOperand = result.toString();
        this.shouldResetScreen = true;
    }

    insertConstant(constant) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        let value;
        switch (constant) {
            case 'pi': value = Math.PI.toString(); break;
            case 'e': value = Math.E.toString(); break;
            default: return;
        }
        this.currentOperand = this.currentOperand === '0' ? value : this.currentOperand + value;
    }

    formatNumber(number) {
        if (number === 'Error') return number;
        const num = parseFloat(number);
        if (isNaN(num)) return number;
        if (Math.abs(num) > 1e10 || (Math.abs(num) < 1e-6 && num !== 0)) {
            return num.toExponential(6);
        }
        return Math.round(num * 1e10) / 1e10;
    }

    updateDisplay() {
        this.currentOperandElement.textContent = this.formatNumber(this.currentOperand);
        this.previousOperandElement.textContent = this.operation != null
            ? `${this.formatNumber(this.previousOperand)} ${this.operation}` : '';
    }
}

const previousOperandElement = document.getElementById('previousOperand');
const currentOperandElement = document.getElementById('currentOperand');
const calculator = new Calculator(previousOperandElement, currentOperandElement);

document.querySelectorAll('[data-number]').forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.dataset.number);
        calculator.updateDisplay();
    });
});

document.querySelectorAll('[data-action]').forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.action;
        switch (action) {
            case 'clear': calculator.clear(); break;
            case 'delete': calculator.delete(); break;
            case 'equals': calculator.compute(); break;
            case 'add': calculator.chooseOperation('+'); break;
            case 'subtract': calculator.chooseOperation('-'); break;
            case 'multiply': calculator.chooseOperation('×'); break;
            case 'divide': calculator.chooseOperation('÷'); break;
            case 'power': calculator.chooseOperation('^'); break;
            case 'sqrt': case 'square': case 'cube': case 'sin': case 'cos': case 'tan': case 'log': case 'ln': case 'percent':
                calculator.performScientificOperation(action); break;
            case 'pi': case 'e': calculator.insertConstant(action); break;
        }
        calculator.updateDisplay();
    });
});

// theme toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const icon = themeToggle.querySelector('.icon');
const currentTheme = localStorage.getItem('theme') || 'dark';

if (currentTheme === 'light') {
    body.classList.add('light-mode');
    icon.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    if (body.classList.contains('light-mode')) {
        icon.textContent = '☀️';
        localStorage.setItem('theme', 'light');
    } else {
        icon.textContent = '🌙';
        localStorage.setItem('theme', 'dark');
    }
});

document.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') calculator.appendNumber(e.key);
    else if (e.key === '+') calculator.chooseOperation('+');
    else if (e.key === '-') calculator.chooseOperation('-');
    else if (e.key === '*') calculator.chooseOperation('×');
    else if (e.key === '/') { e.preventDefault(); calculator.chooseOperation('÷'); }
    else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); calculator.compute(); }
    else if (e.key === 'Backspace') calculator.delete();
    else if (e.key === 'Escape') calculator.clear();
    else return;
    calculator.updateDisplay();
});

calculator.updateDisplay();
