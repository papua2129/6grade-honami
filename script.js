(function () {
  const data = window.LEARNING_DATA;
  const questions = data.questions;
  const subjectById = Object.fromEntries(data.subjects.map((subject) => [subject.id, subject]));
  const state = {
    subject: localStorage.getItem("grade6-subject") || "civics",
    unit: "all",
    index: 0,
    answerVisible: false,
    selectedChoice: null
  };

  const els = {
    subjectTabs: document.getElementById("subjectTabs"),
    unitSelect: document.getElementById("unitSelect"),
    subjectStats: document.getElementById("subjectStats"),
    currentSubjectLabel: document.getElementById("currentSubjectLabel"),
    currentUnitTitle: document.getElementById("currentUnitTitle"),
    printLink: document.getElementById("printLink"),
    answersLink: document.getElementById("answersLink"),
    questionCategory: document.getElementById("questionCategory"),
    questionProgress: document.getElementById("questionProgress"),
    questionText: document.getElementById("questionText"),
    choiceList: document.getElementById("choiceList"),
    writeBox: document.getElementById("writeBox"),
    studentAnswer: document.getElementById("studentAnswer"),
    answerBox: document.getElementById("answerBox"),
    answerText: document.getElementById("answerText"),
    answerExplanation: document.getElementById("answerExplanation"),
    prevQuestion: document.getElementById("prevQuestion"),
    toggleAnswer: document.getElementById("toggleAnswer"),
    randomQuestion: document.getElementById("randomQuestion"),
    nextQuestion: document.getElementById("nextQuestion"),
    mapSummary: document.getElementById("mapSummary"),
    unitMap: document.getElementById("unitMap")
  };

  function getSubjectQuestions(subjectId = state.subject) {
    return questions.filter((question) => question.subject === subjectId);
  }

  function getUnits(subjectId = state.subject) {
    return [...new Set(getSubjectQuestions(subjectId).map((question) => question.unit))];
  }

  function getVisibleQuestions() {
    return getSubjectQuestions().filter((question) => state.unit === "all" || question.unit === state.unit);
  }

  function clampIndex() {
    const visible = getVisibleQuestions();
    if (state.index >= visible.length) state.index = 0;
    if (state.index < 0) state.index = Math.max(visible.length - 1, 0);
  }

  function resetQuestionState() {
    state.answerVisible = false;
    state.selectedChoice = null;
    if (els.studentAnswer) els.studentAnswer.value = "";
  }

  function renderSubjectTabs() {
    els.subjectTabs.innerHTML = "";
    data.subjects.forEach((subject) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "subject-tab";
      button.dataset.active = String(subject.id === state.subject);
      button.style.setProperty("--subject-color", subject.accent);
      button.innerHTML = `<span>${subject.shortName}</span><small>${getSubjectQuestions(subject.id).length}問</small>`;
      button.addEventListener("click", () => {
        state.subject = subject.id;
        state.unit = "all";
        state.index = 0;
        localStorage.setItem("grade6-subject", subject.id);
        resetQuestionState();
        renderAll();
      });
      els.subjectTabs.appendChild(button);
    });
  }

  function renderUnitSelect() {
    const units = getUnits();
    els.unitSelect.innerHTML = "";
    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "すべての単元";
    els.unitSelect.appendChild(allOption);
    units.forEach((unit) => {
      const option = document.createElement("option");
      option.value = unit;
      option.textContent = unit;
      els.unitSelect.appendChild(option);
    });
    els.unitSelect.value = state.unit;
  }

  function renderStats() {
    const subject = subjectById[state.subject];
    const subjectQuestions = getSubjectQuestions();
    const units = getUnits();
    const categories = new Set(subjectQuestions.map((question) => question.category));
    els.subjectStats.innerHTML = `
      <div><strong>${subjectQuestions.length}</strong><span>問題</span></div>
      <div><strong>${units.length}</strong><span>単元</span></div>
      <div><strong>${categories.size}</strong><span>観点</span></div>
    `;
    document.documentElement.style.setProperty("--active-color", subject.accent);
  }

  function renderLearningMap() {
    const subject = subjectById[state.subject];
    const units = getUnits();
    els.mapSummary.textContent = subject.summary;
    els.unitMap.innerHTML = "";

    units.forEach((unit) => {
      const unitQuestions = getSubjectQuestions().filter((question) => question.unit === unit);
      const categories = [...new Set(unitQuestions.map((question) => question.category))];
      const button = document.createElement("button");
      button.type = "button";
      button.className = "map-item";
      button.dataset.active = String(state.unit === unit);
      button.innerHTML = `
        <span class="map-unit">${unit}</span>
        <span class="map-count">${unitQuestions.length}問</span>
        <span class="map-tags">${categories.slice(0, 4).join(" / ")}</span>
      `;
      button.addEventListener("click", () => {
        state.unit = unit;
        state.index = 0;
        resetQuestionState();
        renderAll();
      });
      els.unitMap.appendChild(button);
    });
  }

  function renderChoices(question) {
    els.choiceList.innerHTML = "";
    if (!question.choices) {
      els.choiceList.hidden = true;
      els.writeBox.hidden = false;
      return;
    }

    els.choiceList.hidden = false;
    els.writeBox.hidden = true;
    question.choices.forEach((choice) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice-button";
      button.textContent = choice;
      const isSelected = state.selectedChoice === choice;
      const isCorrect = choice === question.answer;
      if (state.answerVisible && isCorrect) button.dataset.result = "correct";
      if (state.answerVisible && isSelected && !isCorrect) button.dataset.result = "wrong";
      button.dataset.selected = String(isSelected);
      button.addEventListener("click", () => {
        state.selectedChoice = choice;
        state.answerVisible = true;
        renderQuestion();
      });
      els.choiceList.appendChild(button);
    });
  }

  function renderQuestion() {
    clampIndex();
    const visible = getVisibleQuestions();
    const question = visible[state.index];
    const subject = subjectById[state.subject];

    if (!question) {
      els.questionText.textContent = "この条件の問題はありません。";
      els.choiceList.innerHTML = "";
      els.writeBox.hidden = true;
      els.answerBox.hidden = true;
      return;
    }

    els.currentSubjectLabel.textContent = subject.name;
    els.currentUnitTitle.textContent = state.unit === "all" ? "すべての単元" : state.unit;
    els.questionCategory.textContent = `${question.unit} / ${question.category}`;
    els.questionProgress.textContent = `${state.index + 1} / ${visible.length}`;
    els.questionText.textContent = question.prompt;
    els.printLink.href = `print.html?subject=${encodeURIComponent(state.subject)}&mode=questions`;
    els.answersLink.href = `answers.html?subject=${encodeURIComponent(state.subject)}`;

    renderChoices(question);

    els.answerBox.hidden = !state.answerVisible;
    els.answerText.textContent = question.answer;
    els.answerExplanation.textContent = question.explanation;
    els.toggleAnswer.textContent = state.answerVisible ? "答えをかくす" : "答えを見る";
  }

  function renderAll() {
    renderSubjectTabs();
    renderUnitSelect();
    renderStats();
    renderLearningMap();
    renderQuestion();
  }

  els.unitSelect.addEventListener("change", () => {
    state.unit = els.unitSelect.value;
    state.index = 0;
    resetQuestionState();
    renderAll();
  });

  els.prevQuestion.addEventListener("click", () => {
    state.index -= 1;
    resetQuestionState();
    renderQuestion();
  });

  els.nextQuestion.addEventListener("click", () => {
    state.index += 1;
    resetQuestionState();
    renderQuestion();
  });

  els.randomQuestion.addEventListener("click", () => {
    const visible = getVisibleQuestions();
    if (visible.length <= 1) return;
    let nextIndex = state.index;
    while (nextIndex === state.index) {
      nextIndex = Math.floor(Math.random() * visible.length);
    }
    state.index = nextIndex;
    resetQuestionState();
    renderQuestion();
  });

  els.toggleAnswer.addEventListener("click", () => {
    state.answerVisible = !state.answerVisible;
    renderQuestion();
  });

  renderAll();
})();
