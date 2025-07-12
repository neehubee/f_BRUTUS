let loginAttempts = 0;

async function checkPassword() {
  const entered = document.getElementById("password").value;

  const res = await fetch('/check-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: entered })
  });

  const result = await res.json();

  const errorMsg = document.getElementById("loginError");

  if (result.success) {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("mainApp").style.display = "block";
    loadQuestions();
  } else {
    loginAttempts++;
    errorMsg.style.display = "block";
    if (loginAttempts === 1) {
      errorMsg.innerText = "If you don't know the password, ask Neehara nicely 😉";
    } else {
      errorMsg.innerText = "Still wrong. Please ask Neehara.";
    }
  }
}

document.getElementById("addForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const question = document.getElementById("question").value;
  const doneDate = document.getElementById("doneDate").value;

  await fetch('/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, doneDate })
  });

  document.getElementById("question").value = "";
  loadQuestions();
});

async function loadQuestions() {
  const res = await fetch('/questions');
  const data = await res.json();
  const tbody = document.querySelector("#questionTable tbody");
  tbody.innerHTML = "";

  const today = new Date().toDateString();

  data.forEach(q => {
    const tr = document.createElement("tr");
    const baseDate = new Date(q.doneDate);
    tr.innerHTML = `<td>${q.question}</td><td>${baseDate.toDateString()}</td>`;

    [0, 1, 4, 9, 14, 21].forEach(day => {
      const reviewDate = new Date(baseDate);
      reviewDate.setDate(reviewDate.getDate() + day);
      const isToday = reviewDate.toDateString() === today;
      const reviewed = q.status[day];

      const td = document.createElement("td");
      td.textContent = reviewed ? "✅" : isToday ? "🔴" : "";
      td.className = reviewed ? "done" : isToday ? "blink-red" : "";
      td.style.cursor = "pointer";

      td.addEventListener("click", async () => {
        if (!reviewed && isToday) {
          await fetch('/mark', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: q._id, day })
          });
          loadQuestions();
        }
      });

      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}
