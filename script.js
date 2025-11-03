class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
        this.history = [];
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
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
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
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                computation = current !== 0 ? prev / current : 'Error';
                break;
            case '^':
                computation = Math.pow(prev, current);
                break;
            default:
                return;
        }

        const expression = `${this.previousOperand} ${this.operation} ${this.currentOperand}`;
        this.addToHistory(expression, computation);

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
    }

    performScientificOperation(operation) {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;

        let result;
        let expression;

        switch (operation) {
            case 'sqrt':
                result = Math.sqrt(current);
                expression = `√${current}`;
                break;
            case 'square':
                result = Math.pow(current, 2);
                expression = `${current}²`;
                break;
            case 'cube':
                result = Math.pow(current, 3);
                expression = `${current}³`;
                break;
            case 'sin':
                result = Math.sin(current);
                expression = `sin(${current})`;
                break;
            case 'cos':
                result = Math.cos(current);
                expression = `cos(${current})`;
                break;
            case 'tan':
                result = Math.tan(current);
                expression = `tan(${current})`;
                break;
            case 'log':
                result = current > 0 ? Math.log10(current) : 'Error';
                expression = `log(${current})`;
                break;
            case 'ln':
                result = current > 0 ? Math.log(current) : 'Error';
                expression = `ln(${current})`;
                break;
            case 'percent':
                result = current / 100;
                expression = `${current}%`;
                break;
            default:
                return;
        }

        this.addToHistory(expression, result);
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
            case 'pi':
                value = Math.PI.toString();
                break;
            case 'e':
                value = Math.E.toString();
                break;
            default:
                return;
        }

        if (this.currentOperand === '0') {
            this.currentOperand = value;
        } else {
            this.currentOperand += value;
        }
    }

    addToHistory(expression, result) {
        const historyItem = {
            expression: expression,
            result: result
        };
        this.history.unshift(historyItem);
        if (this.history.length > 50) {
            this.history.pop();
        }
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        const historyList = document.getElementById('historyList');
        
        if (this.history.length === 0) {
            historyList.innerHTML = '<p class="no-history">No calculations yet</p>';
            return;
        }

        historyList.innerHTML = '';
        this.history.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.classList.add('history-item');
            historyItem.innerHTML = `
                <div class="calculation">${item.expression}</div>
                <div class="result">= ${this.formatNumber(item.result)}</div>
            `;
            historyItem.addEventListener('click', () => {
                this.currentOperand = item.result.toString();
                this.updateDisplay();
            });
            historyList.appendChild(historyItem);
        });
    }

    clearHistory() {
        this.history = [];
        this.updateHistoryDisplay();
    }

    formatNumber(number) {
        if (number === 'Error') return number;
        const num = parseFloat(number);
        if (isNaN(num)) return number;
        
        // Handle very large or very small numbers
        if (Math.abs(num) > 1e10 || (Math.abs(num) < 1e-6 && num !== 0)) {
            return num.toExponential(6);
        }
        
        // Round to avoid floating point errors
        return Math.round(num * 1e10) / 1e10;
    }

    updateDisplay() {
        this.currentOperandElement.textContent = this.formatNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandElement.textContent = 
                `${this.formatNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }
}

// Initialize calculator
const previousOperandElement = document.getElementById('previousOperand');
const currentOperandElement = document.getElementById('currentOperand');
const calculator = new Calculator(previousOperandElement, currentOperandElement);

// Number buttons
document.querySelectorAll('[data-number]').forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.dataset.number);
        calculator.updateDisplay();
    });
});

// Operation buttons
document.querySelectorAll('[data-action]').forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.action;
        
        switch (action) {
            case 'clear':
                calculator.clear();
                break;
            case 'delete':
                calculator.delete();
                break;
            case 'equals':
                calculator.compute();
                break;
            case 'add':
                calculator.chooseOperation('+');
                break;
            case 'subtract':
                calculator.chooseOperation('-');
                break;
            case 'multiply':
                calculator.chooseOperation('×');
                break;
            case 'divide':
                calculator.chooseOperation('÷');
                break;
            case 'power':
                calculator.chooseOperation('^');
                break;
            case 'sqrt':
            case 'square':
            case 'cube':
            case 'sin':
            case 'cos':
            case 'tan':
            case 'log':
            case 'ln':
            case 'percent':
                calculator.performScientificOperation(action);
                break;
            case 'pi':
            case 'e':
                calculator.insertConstant(action);
                break;
        }
        
        calculator.updateDisplay();
    });
});

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const icon = themeToggle.querySelector('.icon');

// Check for saved theme preference or default to dark mode
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

// Clear history button
document.getElementById('clearHistory').addEventListener('click', () => {
    calculator.clearHistory();
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    // Numbers and decimal point
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        calculator.appendNumber(e.key);
        calculator.updateDisplay();
    }
    
    // Operations
    if (e.key === '+') {
        calculator.chooseOperation('+');
        calculator.updateDisplay();
    }
    if (e.key === '-') {
        calculator.chooseOperation('-');
        calculator.updateDisplay();
    }
    if (e.key === '*') {
        calculator.chooseOperation('×');
        calculator.updateDisplay();
    }
    if (e.key === '/') {
        e.preventDefault();
        calculator.chooseOperation('÷');
        calculator.updateDisplay();
    }
    
    // Enter or equals
    if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculator.compute();
        calculator.updateDisplay();
    }
    
    // Backspace
    if (e.key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
    }
    
    // Escape to clear
    if (e.key === 'Escape') {
        calculator.clear();
        calculator.updateDisplay();
    }
});

// Initial display update
calculator.updateDisplay();