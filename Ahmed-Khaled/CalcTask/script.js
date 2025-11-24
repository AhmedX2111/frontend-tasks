// Calculator state
let currentInput = '0';
let previousInput = '';
let operation = null;
let shouldResetInput = false;

// Create calculator container
const calculator = document.createElement('main');
calculator.className = 'calculator';
calculator.setAttribute('role', 'application');
calculator.setAttribute('aria-label', 'Calculator');

// Create display element
const display = document.createElement('output');
display.className = 'display';
display.id = 'display';
display.textContent = '0';

// Create buttons with their properties
const buttonConfigs = [
    { class: 'clear', text: 'C', gridArea: 'clear', onclick: clearCalc },
    { class: 'back', text: '⌫', gridArea: 'back', onclick: backspace },
    { class: 'operator', text: '÷', gridArea: 'divide', onclick: () => setOperation('divide') },
    { class: 'operator', text: '×', gridArea: 'multiply', onclick: () => setOperation('multiply') },
    { class: 'number', text: '7', gridArea: 'seven', onclick: () => appendNumber('7') },
    { class: 'number', text: '8', gridArea: 'eight', onclick: () => appendNumber('8') },
    { class: 'number', text: '9', gridArea: 'nine', onclick: () => appendNumber('9') },
    { class: 'operator', text: '−', gridArea: 'subtract', onclick: () => setOperation('subtract') },
    { class: 'number', text: '4', gridArea: 'four', onclick: () => appendNumber('4') },
    { class: 'number', text: '5', gridArea: 'five', onclick: () => appendNumber('5') },
    { class: 'number', text: '6', gridArea: 'six', onclick: () => appendNumber('6') },
    { class: 'operator', text: '+', gridArea: 'add', onclick: () => setOperation('add') },
    { class: 'number', text: '1', gridArea: 'one', onclick: () => appendNumber('1') },
    { class: 'number', text: '2', gridArea: 'two', onclick: () => appendNumber('2') },
    { class: 'number', text: '3', gridArea: 'three', onclick: () => appendNumber('3') },
    { class: 'equals', text: '=', gridArea: 'equals', onclick: calculate },
    { class: 'number zero', text: '0', gridArea: 'zero', onclick: () => appendNumber('0') },
    { class: 'decimal', text: '.', gridArea: 'decimal', onclick: addDecimal }
];

// Create and append buttons
const buttons = buttonConfigs.map(config => {
    const button = document.createElement('button');
    button.className = config.class;
    button.textContent = config.text;
    button.style.gridArea = config.gridArea;
    button.onclick = config.onclick;
    return button;
});

// Append display and buttons to calculator
calculator.appendChild(display);
buttons.forEach(button => calculator.appendChild(button));

// Append calculator to body
document.body.appendChild(calculator);

// Calculator functions
function updateDisplay() {
    display.textContent = formatDisplay(currentInput);
}

function formatDisplay(value) {
    if (value.includes('e')) {
        const num = parseFloat(value);
        return num.toLocaleString('fullwide', { useGrouping: false });
    }

    if (value.length > 12) {
        return parseFloat(value).toExponential(6);
    }

    return value;
}

function appendNumber(number) {
    if (shouldResetInput) {
        currentInput = number;
        shouldResetInput = false;
    } else {
        if (currentInput.replace('.', '').length >= 12) return;
        currentInput = currentInput === '0' ? number : currentInput + number;
    }
    updateDisplay();
}

function addDecimal() {
    if (shouldResetInput) {
        currentInput = '0.';
        shouldResetInput = false;
    } else if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
}

function setOperation(op) {
    if (currentInput === '0' && op !== 'subtract') return;

    if (operation !== null && !shouldResetInput) {
        calculate();
    }

    operation = op;
    previousInput = currentInput;
    shouldResetInput = true;
}

function calculate() {
    if (operation === null || shouldResetInput) return;

    try {
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);

        if (isNaN(prev) || isNaN(current)) {
            throw new Error('Invalid input');
        }

        let result;

        switch (operation) {
            case 'add':
                result = prev + current;
                break;
            case 'subtract':
                result = prev - current;
                break;
            case 'multiply':
                result = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    throw new Error('Division by zero');
                }
                result = prev / current;
                break;
            default:
                return;
        }

        if (!isFinite(result)) {
            throw new Error('Number too large');
        }

        result = Math.round(result * 100000000) / 100000000;

        currentInput = result.toString();
        operation = null;
        previousInput = '';
        shouldResetInput = true;
        updateDisplay();

    } catch (error) {
        showError(error.message);
        clearCalc();
    }
}

function clearCalc() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    shouldResetInput = false;
    updateDisplay();
}

function backspace() {
    if (shouldResetInput) {
        currentInput = '0';
        shouldResetInput = false;
    } else if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function showError(message) {
    display.textContent = message;
    setTimeout(() => {
        updateDisplay();
    }, 1500);
}

// Initialize calculator
function initCalculator() {
    updateDisplay();
    setupKeyboardSupport();
    setupButtonAnimations();
}

// Keyboard support
function setupKeyboardSupport() {
    document.addEventListener('keydown', handleKeyboardInput);
}

function handleKeyboardInput(event) {
    const key = event.key;

    if (/[0-9+\-*/.=]|Enter|Escape|Backspace/.test(key)) {
        event.preventDefault();
    }

    if (key >= '0' && key <= '9') {
        appendNumber(key);
    } else if (key === '.') {
        addDecimal();
    } else if (key === '+' || key.toLowerCase() === 'a') {
        setOperation('add');
    } else if (key === '-') {
        setOperation('subtract');
    } else if (key === '*' || key.toLowerCase() === 'x') {
        setOperation('multiply');
    } else if (key === '/') {
        setOperation('divide');
    } else if (key === '=' || key === 'Enter') {
        calculate();
    } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        clearCalc();
    } else if (key === 'Backspace') {
        backspace();
    }
}

// Button animations
function setupButtonAnimations() {
    const buttons = document.querySelectorAll('button');

    buttons.forEach(button => {
        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.95)';
        });

        button.addEventListener('mouseup', () => {
            button.style.transform = 'scale(1)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });

        button.addEventListener('touchstart', () => {
            button.style.transform = 'scale(0.95)';
        });

        button.addEventListener('touchend', () => {
            button.style.transform = 'scale(1)';
        });
    });
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initCalculator();
});
