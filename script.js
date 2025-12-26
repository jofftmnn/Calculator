(() => {
  const screen = document.getElementById("screen");
  const buttons = document.querySelectorAll("button");

  let expr = "";
  let lastResult = false;

  const operators = /[+\-×÷%]/;

  function update() {
    screen.textContent = expr || "0";
  }

  function getLastNumber() {
    return expr.split(operators).pop();
  }

  function append(val) {
    
    if (lastResult && /[0-9.]/.test(val)) {
      expr = "";
      lastResult = false;
    }

    const lastChar = expr.slice(-1);
    const lastNumber = getLastNumber();

    if (expr === "" && val === "0") {
      expr = "0";
      update();
      return;
    }

    if (expr === "0" && val === "0") return;

    if (expr === "0" && /[1-9]/.test(val)) {
      expr = val;
      update();
      return;
    }

    
    if (val === ".") {
      
      if (expr === "" || operators.test(lastChar)) {
        expr += "0.";
        update();
        return;
      }

      
      if (lastNumber.includes(".")) return;
    }

    
    if (operators.test(val)) {
      if (expr === "" && val !== "-") return;

      if (operators.test(lastChar)) {
        expr = expr.slice(0, -1) + val;
        update();
        return;
      }
    }

    expr += val;
    update();
  }

  function clearAll() {
    expr = "";
    lastResult = false;
    update();
  }

  function back() {
    expr = expr.slice(0, -1);
    update();
  }

  function calculate() {
    if (!expr) return;

    try {
      const raw = expr.replace(/×/g, "*").replace(/÷/g, "/");

      let result = Function("return (" + raw + ")")();

     
      if (Number.isFinite(result)) {
        
        result = parseFloat(result.toFixed(10));
      }

      expr = String(result);
      lastResult = true;
    } catch {
      expr = "Error";
    }

    update();
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const val = btn.dataset.value;
      const action = btn.dataset.action;

      if (action === "clear") clearAll();
      else if (action === "back") back();
      else if (action === "equal") calculate();
      else if (val) append(val);
    });
  });

  update();
})();