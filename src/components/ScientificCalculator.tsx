import React, { useState, useEffect, useRef } from 'react';
import { 
  Calculator, 
  X, 
  RotateCcw, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Maximize2, 
  Minimize2,
  Sparkles
} from 'lucide-react';

interface ScientificCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const ScientificCalculator: React.FC<ScientificCalculatorProps> = ({
  isOpen,
  onClose,
  className = '',
}) => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [isRadian, setIsRadian] = useState(false); // DEG vs RAD
  const [memory, setMemory] = useState<number>(0);
  const [history, setHistory] = useState<{ expr: string; result: string }[]>([]);
  const [copied, setCopied] = useState(false);
  const [isScientificExpanded, setIsScientificExpanded] = useState(true);
  const [hasEvaluated, setHasEvaluated] = useState(false);

  // Keyboard shortcut listener when calculator is open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture keyboard if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        handleDigit(e.key);
      } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        const opMap: Record<string, string> = { '+': '+', '-': '−', '*': '×', '/': '÷' };
        handleOperator(opMap[e.key] || e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleDelete();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, display, expression, hasEvaluated, isRadian]);

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    if (hasEvaluated) {
      setDisplay(digit === '.' ? '0.' : digit);
      setExpression('');
      setHasEvaluated(false);
      return;
    }

    if (digit === '.') {
      if (display.includes('.')) return;
      setDisplay(display + '.');
      return;
    }

    if (display === '0') {
      setDisplay(digit);
    } else {
      setDisplay(display + digit);
    }
  };

  const handleOperator = (op: string) => {
    setHasEvaluated(false);
    setExpression(`${display} ${op} `);
    setDisplay('0');
  };

  const handleDelete = () => {
    if (hasEvaluated) {
      handleClear();
      return;
    }
    if (display.length <= 1) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
    setHasEvaluated(false);
  };

  const handleToggleSign = () => {
    if (display === '0') return;
    if (display.startsWith('-')) {
      setDisplay(display.slice(1));
    } else {
      setDisplay('-' + display);
    }
  };

  const handlePercent = () => {
    const val = parseFloat(display);
    if (!isNaN(val)) {
      setDisplay(String(val / 100));
    }
  };

  const calculateScientificFunction = (funcName: string) => {
    const val = parseFloat(display);
    if (isNaN(val)) return;

    let res = 0;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const toDeg = (rad: number) => (rad * 180) / Math.PI;

    try {
      switch (funcName) {
        case 'sin':
          res = Math.sin(isRadian ? val : toRad(val));
          break;
        case 'cos':
          res = Math.cos(isRadian ? val : toRad(val));
          break;
        case 'tan':
          res = Math.tan(isRadian ? val : toRad(val));
          break;
        case 'asin':
          res = isRadian ? Math.asin(val) : toDeg(Math.asin(val));
          break;
        case 'acos':
          res = isRadian ? Math.acos(val) : toDeg(Math.acos(val));
          break;
        case 'atan':
          res = isRadian ? Math.atan(val) : toDeg(Math.atan(val));
          break;
        case 'ln':
          if (val <= 0) throw new Error('Domain Error');
          res = Math.log(val);
          break;
        case 'log10':
          if (val <= 0) throw new Error('Domain Error');
          res = Math.log10(val);
          break;
        case 'sqrt':
          if (val < 0) throw new Error('Domain Error');
          res = Math.sqrt(val);
          break;
        case 'square':
          res = Math.pow(val, 2);
          break;
        case 'exp':
          res = Math.exp(val);
          break;
        case 'inv':
          if (val === 0) throw new Error('Divide by zero');
          res = 1 / val;
          break;
        case 'abs':
          res = Math.abs(val);
          break;
        case 'factorial':
          if (val < 0 || !Number.isInteger(val)) throw new Error('Domain Error');
          let f = 1;
          for (let i = 2; i <= Math.min(val, 100); i++) f *= i;
          res = f;
          break;
        case 'pi':
          res = Math.PI;
          break;
        case 'e':
          res = Math.E;
          break;
        default:
          return;
      }

      // Format round precision
      const formatted = Number.isInteger(res) ? String(res) : Number(res.toFixed(8)).toString();
      setDisplay(formatted);
      setExpression(`${funcName}(${val}) =`);
      setHasEvaluated(true);
      setHistory((prev) => [{ expr: `${funcName}(${val})`, result: formatted }, ...prev.slice(0, 5)]);
    } catch {
      setDisplay('Error');
      setHasEvaluated(true);
    }
  };

  const handleEquals = () => {
    if (!expression) return;

    try {
      const parts = expression.trim().split(' ');
      if (parts.length < 2) return;

      const firstOperand = parseFloat(parts[0]);
      const op = parts[1];
      const secondOperand = parseFloat(display);

      if (isNaN(firstOperand) || isNaN(secondOperand)) return;

      let result = 0;
      if (op === '+') result = firstOperand + secondOperand;
      else if (op === '−' || op === '-') result = firstOperand - secondOperand;
      else if (op === '×' || op === '*') result = firstOperand * secondOperand;
      else if (op === '÷' || op === '/') {
        if (secondOperand === 0) throw new Error('Divide by zero');
        result = firstOperand / secondOperand;
      } else if (op === '^') {
        result = Math.pow(firstOperand, secondOperand);
      }

      const formatted = Number.isInteger(result) ? String(result) : Number(result.toFixed(8)).toString();
      const fullExpr = `${expression} ${display}`;
      setDisplay(formatted);
      setExpression(`${fullExpr} =`);
      setHasEvaluated(true);
      setHistory((prev) => [{ expr: fullExpr, result: formatted }, ...prev.slice(0, 5)]);
    } catch {
      setDisplay('Error');
      setHasEvaluated(true);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(display);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 w-full max-w-sm sm:max-w-md bg-white border-2 border-[#1B1B19] shadow-2xl text-[#1B1B19] font-['Inter'] animate-fade-in ${className}`}>
      {/* Top Title Bar with Draggable Aesthetic */}
      <div className="flex items-center justify-between p-3.5 bg-[#F8F7F4] border-b-2 border-[#1B1B19]">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-[#E15B44]" />
          <span className="font-['Space_Mono'] text-xs uppercase font-bold tracking-wider text-[#1B1B19]">
            Collegiate Scientific Engine
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Deg/Rad Toggle */}
          <button
            type="button"
            onClick={() => setIsRadian(!isRadian)}
            className="font-['Space_Mono'] text-[9px] uppercase px-2 py-0.5 border border-[#1B1B19] bg-white font-bold text-[#1B1B19] hover:bg-[#EFECE6] cursor-pointer"
          >
            {isRadian ? 'RAD' : 'DEG'}
          </button>

          {/* Scientific Keypad Expand Toggle */}
          <button
            type="button"
            onClick={() => setIsScientificExpanded(!isScientificExpanded)}
            className="p-1 border border-[rgba(27,27,25,0.2)] hover:border-[#1B1B19] text-[#1B1B19] bg-white hover:bg-[#EFECE6] cursor-pointer"
            title={isScientificExpanded ? 'Compact Keypad' : 'Expand Scientific Keys'}
          >
            {isScientificExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Close Calculator */}
          <button
            type="button"
            onClick={onClose}
            className="p-1 border border-[#1B1B19] text-[#1B1B19] hover:bg-[#EFECE6] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Screen Display Area */}
      <div className="p-4 bg-white border-b border-[rgba(27,27,25,0.15)] text-right">
        {/* Expression Tape */}
        <div className="font-['Space_Mono'] text-[11px] text-[#1B1B19]/50 h-5 truncate tracking-wider">
          {expression || '\u00A0'}
        </div>

        {/* Big Number Output */}
        <div className="flex items-baseline justify-between mt-1">
          <button
            type="button"
            onClick={handleCopy}
            className="font-['Space_Mono'] text-[10px] uppercase text-[#1B1B19]/40 hover:text-[#1B1B19] flex items-center gap-1 cursor-pointer"
            title="Copy current value"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <div className="font-['Space_Mono'] text-2xl sm:text-3xl font-bold tracking-tight text-[#1B1B19] tabular-nums truncate max-w-[280px]">
            {display}
          </div>
        </div>
      </div>

      {/* History Ribbon (Collapsible preview of recent operations) */}
      {history.length > 0 && (
        <div className="px-3.5 py-1.5 bg-[#F8F7F4] border-b border-[rgba(27,27,25,0.1)] flex items-center justify-between font-['Space_Mono'] text-[10px] text-[#1B1B19]/60">
          <span>Tape: {history[0].expr} = <strong>{history[0].result}</strong></span>
          <button
            type="button"
            onClick={() => setDisplay(history[0].result)}
            className="uppercase underline text-[#E15B44] hover:text-[#1B1B19] cursor-pointer font-bold"
          >
            ANS
          </button>
        </div>
      )}

      {/* Calculator Buttons Grid */}
      <div className="p-3 bg-[#F8F7F4] space-y-2">
        {/* Scientific Functions Rows (Collapsible) */}
        {isScientificExpanded && (
          <div className="space-y-1.5 pb-2 border-b border-[rgba(27,27,25,0.12)]">
            {/* Trig & Constants */}
            <div className="grid grid-cols-6 gap-1 font-['Space_Mono'] text-[10px]">
              <button
                type="button"
                onClick={() => calculateScientificFunction('sin')}
                className="py-1.5 border border-[rgba(27,27,25,0.15)] bg-white hover:bg-[#EFECE6] font-bold text-[#1B1B19] cursor-pointer"
              >
                sin
              </button>
              <button
                type="button"
                onClick={() => calculateScientificFunction('cos')}
                className="py-1.5 border border-[rgba(27,27,25,0.15)] bg-white hover:bg-[#EFECE6] font-bold text-[#1B1B19] cursor-pointer"
              >
                cos
              </button>
              <button
                type="button"
                onClick={() => calculateScientificFunction('tan')}
                className="py-1.5 border border-[rgba(27,27,25,0.15)] bg-white hover:bg-[#EFECE6] font-bold text-[#1B1B19] cursor-pointer"
              >
                tan
              </button>
              <button
                type="button"
                onClick={() => calculateScientificFunction('sqrt')}
                className="py-1.5 border border-[rgba(27,27,25,0.15)] bg-white hover:bg-[#EFECE6] font-bold text-[#1B1B19] cursor-pointer"
              >
                √x
              </button>
              <button
                type="button"
                onClick={() => calculateScientificFunction('pi')}
                className="py-1.5 border border-[rgba(27,27,25,0.15)] bg-white hover:bg-[#EFECE6] font-bold text-[#1B1B19] cursor-pointer"
              >
                π
              </button>
              <button
                type="button"
                onClick={() => calculateScientificFunction('e')}
                className="py-1.5 border border-[rgba(27,27,25,0.15)] bg-white hover:bg-[#EFECE6] font-bold text-[#1B1B19] cursor-pointer"
              >
                e
              </button>
            </div>

            {/* Log, Powers, and Inverses */}
            <div className="grid grid-cols-6 gap-1 font-['Space_Mono'] text-[10px]">
              <button
                type="button"
                onClick={() => calculateScientificFunction('ln')}
                className="py-1.5 border border-[rgba(27,27,25,0.15)] bg-white hover:bg-[#EFECE6] font-bold text-[#1B1B19] cursor-pointer"
              >
                ln
              </button>
              <button
                type="button"
                onClick={() => calculateScientificFunction('log10')}
                className="py-1.5 border border-[rgba(27,27,25,0.15)] bg-white hover:bg-[#EFECE6] font-bold text-[#1B1B19] cursor-pointer"
              >
                log
              </button>
              <button
                type="button"
                onClick={() => calculateScientificFunction('square')}
                className="py-1.5 border border-[rgba(27,27,25,0.15)] bg-white hover:bg-[#EFECE6] font-bold text-[#1B1B19] cursor-pointer"
              >
                x²
              </button>
              <button
                type="button"
                onClick={() => handleOperator('^')}
                className="py-1.5 border border-[rgba(27,27,25,0.15)] bg-white hover:bg-[#EFECE6] font-bold text-[#1B1B19] cursor-pointer"
              >
                xʸ
              </button>
              <button
                type="button"
                onClick={() => calculateScientificFunction('inv')}
                className="py-1.5 border border-[rgba(27,27,25,0.15)] bg-white hover:bg-[#EFECE6] font-bold text-[#1B1B19] cursor-pointer"
              >
                1/x
              </button>
              <button
                type="button"
                onClick={() => calculateScientificFunction('factorial')}
                className="py-1.5 border border-[rgba(27,27,25,0.15)] bg-white hover:bg-[#EFECE6] font-bold text-[#1B1B19] cursor-pointer"
              >
                n!
              </button>
            </div>
          </div>
        )}

        {/* Standard Keypad (4 columns) */}
        <div className="grid grid-cols-4 gap-1.5 font-['Space_Mono'] text-sm">
          {/* Row 1: Clear, Delete, %, / */}
          <button
            type="button"
            onClick={handleClear}
            className="py-2.5 border border-[#1B1B19] bg-white hover:bg-rose-50 font-bold text-[#E15B44] cursor-pointer"
          >
            AC
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="py-2.5 border border-[rgba(27,27,25,0.2)] bg-white hover:bg-[#EFECE6] font-bold text-[#1B1B19] cursor-pointer"
          >
            DEL
          </button>
          <button
            type="button"
            onClick={handlePercent}
            className="py-2.5 border border-[rgba(27,27,25,0.2)] bg-white hover:bg-[#EFECE6] font-bold text-[#1B1B19] cursor-pointer"
          >
            %
          </button>
          <button
            type="button"
            onClick={() => handleOperator('÷')}
            className="py-2.5 border border-[#1B1B19] bg-white hover:bg-[#1B1B19] hover:text-white font-bold text-base cursor-pointer"
          >
            ÷
          </button>

          {/* Row 2: 7, 8, 9, * */}
          <button
            type="button"
            onClick={() => handleDigit('7')}
            className="py-2.5 border border-[rgba(27,27,25,0.2)] bg-white hover:bg-[#EFECE6] font-semibold text-[#1B1B19] cursor-pointer text-base"
          >
            7
          </button>
          <button
            type="button"
            onClick={() => handleDigit('8')}
            className="py-2.5 border border-[rgba(27,27,25,0.2)] bg-white hover:bg-[#EFECE6] font-semibold text-[#1B1B19] cursor-pointer text-base"
          >
            8
          </button>
          <button
            type="button"
            onClick={() => handleDigit('9')}
            className="py-2.5 border border-[rgba(27,27,25,0.2)] bg-white hover:bg-[#EFECE6] font-semibold text-[#1B1B19] cursor-pointer text-base"
          >
            9
          </button>
          <button
            type="button"
            onClick={() => handleOperator('×')}
            className="py-2.5 border border-[#1B1B19] bg-white hover:bg-[#1B1B19] hover:text-white font-bold text-base cursor-pointer"
          >
            ×
          </button>

          {/* Row 3: 4, 5, 6, - */}
          <button
            type="button"
            onClick={() => handleDigit('4')}
            className="py-2.5 border border-[rgba(27,27,25,0.2)] bg-white hover:bg-[#EFECE6] font-semibold text-[#1B1B19] cursor-pointer text-base"
          >
            4
          </button>
          <button
            type="button"
            onClick={() => handleDigit('5')}
            className="py-2.5 border border-[rgba(27,27,25,0.2)] bg-white hover:bg-[#EFECE6] font-semibold text-[#1B1B19] cursor-pointer text-base"
          >
            5
          </button>
          <button
            type="button"
            onClick={() => handleDigit('6')}
            className="py-2.5 border border-[rgba(27,27,25,0.2)] bg-white hover:bg-[#EFECE6] font-semibold text-[#1B1B19] cursor-pointer text-base"
          >
            6
          </button>
          <button
            type="button"
            onClick={() => handleOperator('−')}
            className="py-2.5 border border-[#1B1B19] bg-white hover:bg-[#1B1B19] hover:text-white font-bold text-base cursor-pointer"
          >
            −
          </button>

          {/* Row 4: 1, 2, 3, + */}
          <button
            type="button"
            onClick={() => handleDigit('1')}
            className="py-2.5 border border-[rgba(27,27,25,0.2)] bg-white hover:bg-[#EFECE6] font-semibold text-[#1B1B19] cursor-pointer text-base"
          >
            1
          </button>
          <button
            type="button"
            onClick={() => handleDigit('2')}
            className="py-2.5 border border-[rgba(27,27,25,0.2)] bg-white hover:bg-[#EFECE6] font-semibold text-[#1B1B19] cursor-pointer text-base"
          >
            2
          </button>
          <button
            type="button"
            onClick={() => handleDigit('3')}
            className="py-2.5 border border-[rgba(27,27,25,0.2)] bg-white hover:bg-[#EFECE6] font-semibold text-[#1B1B19] cursor-pointer text-base"
          >
            3
          </button>
          <button
            type="button"
            onClick={() => handleOperator('+')}
            className="py-2.5 border border-[#1B1B19] bg-white hover:bg-[#1B1B19] hover:text-white font-bold text-base cursor-pointer"
          >
            +
          </button>

          {/* Row 5: +/-, 0, ., = */}
          <button
            type="button"
            onClick={handleToggleSign}
            className="py-2.5 border border-[rgba(27,27,25,0.2)] bg-white hover:bg-[#EFECE6] font-bold text-[#1B1B19] cursor-pointer"
          >
            ±
          </button>
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="py-2.5 border border-[rgba(27,27,25,0.2)] bg-white hover:bg-[#EFECE6] font-semibold text-[#1B1B19] cursor-pointer text-base"
          >
            0
          </button>
          <button
            type="button"
            onClick={() => handleDigit('.')}
            className="py-2.5 border border-[rgba(27,27,25,0.2)] bg-white hover:bg-[#EFECE6] font-bold text-[#1B1B19] cursor-pointer text-base"
          >
            .
          </button>
          <button
            type="button"
            onClick={handleEquals}
            className="py-2.5 bg-[#1B1B19] hover:bg-[#E15B44] text-white border border-[#1B1B19] hover:border-[#E15B44] font-bold text-lg cursor-pointer transition-colors"
          >
            =
          </button>
        </div>
      </div>

      {/* Footer Info & Keyboard Hints */}
      <div className="p-2.5 bg-white border-t border-[rgba(27,27,25,0.1)] flex items-center justify-between font-['Space_Mono'] text-[9px] uppercase tracking-wider text-[#1B1B19]/50">
        <span>Keyboard: 0-9, +, -, *, /, Enter</span>
        <span>CLEP Math Standard</span>
      </div>
    </div>
  );
};
