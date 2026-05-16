(function () {
  const data = window.LEARNING_DATA;
  const params = new URLSearchParams(window.location.search);
  const kana = ["ア", "イ", "ウ", "エ", "オ"];

  function subjectOptions(includeAll) {
    const options = includeAll ? [{ id: "all", name: "すべての教科" }] : [];
    return options.concat(data.subjects.map((subject) => ({ id: subject.id, name: subject.name })));
  }

  function getSubjectName(subjectId) {
    if (subjectId === "all") return "すべての教科";
    return data.subjects.find((subject) => subject.id === subjectId)?.name || "教科";
  }

  function getQuestions(subjectId) {
    return data.questions.filter((question) => subjectId === "all" || question.subject === subjectId);
  }

  function groupByUnit(questions) {
    return questions.reduce((groups, question) => {
      if (!groups[question.unit]) groups[question.unit] = [];
      groups[question.unit].push(question);
      return groups;
    }, {});
  }

  function fillSubjectSelect(select, includeAll, fallback) {
    const requested = params.get("subject") || fallback;
    select.innerHTML = "";
    subjectOptions(includeAll).forEach((subject) => {
      const option = document.createElement("option");
      option.value = subject.id;
      option.textContent = subject.name;
      select.appendChild(option);
    });
    select.value = subjectOptions(includeAll).some((subject) => subject.id === requested) ? requested : fallback;
  }

  function choicesMarkup(question) {
    if (!question.choices) return '<div class="answer-lines" aria-hidden="true"></div>';
    return `
      <ol class="print-choices">
        ${question.choices.map((choice, index) => `<li><span>${kana[index]}</span>${choice}</li>`).join("")}
      </ol>
    `;
  }

  function renderAnswerList() {
    const select = document.getElementById("answerSubject");
    const list = document.getElementById("answerList");
    const printLink = document.getElementById("answerPrintLink");
    if (!select || !list) return;

    fillSubjectSelect(select, true, "all");

    function render() {
      const subjectId = select.value;
      const questions = getQuestions(subjectId);
      const grouped = groupByUnit(questions);
      printLink.href = `print.html?subject=${encodeURIComponent(subjectId)}&mode=answers`;
      list.innerHTML = Object.entries(grouped).map(([unit, unitQuestions]) => `
        <article class="answer-section">
          <h2>${unit}</h2>
          ${unitQuestions.map((question, index) => `
            <div class="answer-row">
              <div class="answer-number">${index + 1}</div>
              <div>
                <p class="answer-question">${question.prompt}</p>
                <p><strong>答え:</strong> ${question.answer}</p>
                <p class="explanation">${question.explanation}</p>
              </div>
            </div>
          `).join("")}
        </article>
      `).join("");
    }

    select.addEventListener("change", render);
    render();
  }

  function chunk(items, size) {
    const chunks = [];
    for (let index = 0; index < items.length; index += size) {
      chunks.push(items.slice(index, index + size));
    }
    return chunks;
  }

  function renderPrintPages() {
    const subjectSelect = document.getElementById("printSubject");
    const modeSelect = document.getElementById("printMode");
    const pages = document.getElementById("printPages");
    const printButton = document.getElementById("printButton");
    if (!subjectSelect || !modeSelect || !pages) return;

    fillSubjectSelect(subjectSelect, true, params.get("subject") || "civics");
    modeSelect.value = params.get("mode") === "answers" ? "answers" : "questions";

    function questionMarkup(question, index, mode) {
      if (mode === "answers") {
        return `
          <p class="print-question"><span>${index + 1}.</span>${question.prompt}</p>
          <p class="print-answer"><strong>答え:</strong> ${question.answer}</p>
          <p class="print-explanation">${question.explanation}</p>
        `;
      }

      return `
        <p class="print-question"><span>${index + 1}.</span>${question.prompt}</p>
        ${choicesMarkup(question)}
      `;
    }

    function render() {
      const subjectId = subjectSelect.value;
      const mode = modeSelect.value;
      const questions = getQuestions(subjectId);
      const groupedEntries = Object.entries(groupByUnit(questions));
      const flatSections = groupedEntries.flatMap(([unit, unitQuestions]) =>
        unitQuestions.map((question) => ({ unit, question }))
      );
      const pageChunks = chunk(flatSections, mode === "answers" ? 7 : 8);

      pages.innerHTML = pageChunks.map((pageItems, pageIndex) => `
        <article class="print-sheet">
          <header class="print-sheet-header">
            <div>
              <p>${getSubjectName(subjectId)} ${mode === "answers" ? "模範回答" : "練習プリント"}</p>
              <h2>${data.meta.grade}</h2>
            </div>
            <div class="print-name">名前</div>
          </header>
          <ol class="print-list">
            ${pageItems.map(({ unit, question }, index) => `
              <li class="print-item">
                <p class="print-meta">${unit} / ${question.category}</p>
                ${questionMarkup(question, pageIndex * (mode === "answers" ? 7 : 8) + index, mode)}
              </li>
            `).join("")}
          </ol>
          <footer class="print-footer">ページ ${pageIndex + 1} / ${pageChunks.length}</footer>
        </article>
      `).join("");
    }

    subjectSelect.addEventListener("change", render);
    modeSelect.addEventListener("change", render);
    printButton.addEventListener("click", () => window.print());
    render();
  }

  renderAnswerList();
  renderPrintPages();
})();
