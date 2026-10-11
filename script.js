const currentPage = document.body.dataset.page;

if (currentPage === 'login') {
  const loginForm = document.getElementById('loginForm');
  const formMessage = document.getElementById('formMessage');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = `form-message ${type}`;
  }

  function validateLoginForm(email, password) {
    if (!email || !password) {
      return 'Please enter both email and password.';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return 'Please enter a valid email address.';
    }

    if (password.length < 6) {
      return 'Password must contain at least 6 characters.';
    }

    return '';
  }

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const errorMessage = validateLoginForm(email, password);

    if (errorMessage) {
      showMessage(errorMessage, 'error');
      return;
    }

    localStorage.removeItem('fpolyCourseRegistration');
    localStorage.setItem('studentEmail', email);
    showMessage('Login successful! Welcome back.', 'success');

    setTimeout(() => {
      window.location.href = 'home.html';
    }, 800);
  });
}

if (currentPage === 'home') {
  const maxCredits = Number.POSITIVE_INFINITY;
  const courses = [
    { code: 'SWD 311', name: 'Frontend Development', department: 'Software and Web Development', credits: 3, description: 'Build interactive and responsive user interfaces using modern front-end technologies.' },
    { code: 'SWD 312', name: 'Backend Development', department: 'Software and Web Development', credits: 4, description: 'Create server-side logic, APIs, and application workflows for web systems.' },
    { code: 'SWD 313', name: 'Database Management', department: 'Software and Web Development', credits: 3, description: 'Design, query, and manage databases for efficient data storage and retrieval.' },
    { code: 'SWD 314', name: 'Operation Research', department: 'Software and Web Development', credits: 3, description: 'Apply analytical methods to optimize decision-making and resource allocation.' },
    { code: 'SWD 315', name: 'Research Method', department: 'Software and Web Development', credits: 2, description: 'Learn structured approaches for planning, conducting, and reporting academic research.' },
    { code: 'AIT 311', name: 'AI Development', department: 'Software and Web Development', credits: 4, description: 'Study intelligent systems, machine learning concepts, and practical AI applications.' },
    { code: 'SWD 316', name: 'Python Language', department: 'Software and Web Development', credits: 3, description: 'Develop programming logic using Python for software solutions and automation.' },
    { code: 'SWD 317', name: 'C++ Language', department: 'Software and Web Development', credits: 3, description: 'Explore object-oriented programming and performance-oriented software design.' }
  ];

  const defaultState = {
    selectedCourseCodes: [],
    student: {
      name: '',
      studentId: '',
      email: ''
    },
    search: '',
    department: 'Software and Web Development'
  };

  const stateKey = 'fpolyCourseRegistration';

  const welcomeName = document.getElementById('studentName');
  const studentEmail = document.getElementById('studentEmail');
  const logoutBtn = document.getElementById('logoutBtn');
  const searchInput = document.getElementById('searchInput');
  const departmentFilter = document.getElementById('departmentFilter');
  const courseGrid = document.getElementById('courseGrid');
  const courseCatalogPanel = document.getElementById('courseCatalogPanel');
  const emptyState = document.getElementById('emptyState');
  const registrationForm = document.getElementById('registrationForm');
  const submitRegistrationBtn = registrationForm.querySelector('.submit-btn');
  const printRegistrationBtn = registrationForm.querySelector('.print-btn');
  const printRegistrationSummary = document.getElementById('printRegistrationSummary');
  const printStudentName = document.getElementById('printStudentName');
  const printStudentId = document.getElementById('printStudentId');
  const printStudentEmail = document.getElementById('printStudentEmail');
  const printCourseList = document.getElementById('printCourseList');
  const showCoursesBtn = document.getElementById('showCoursesBtn');
  const totalCreditsEl = document.getElementById('totalCredits');
  const remainingCreditsEl = document.getElementById('remainingCredits');
  const selectedCoursesList = document.getElementById('selectedCoursesList');
  const summaryMessage = document.getElementById('summaryMessage');
  const registrationMessage = document.getElementById('registrationMessage');

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(stateKey));
      return {
        ...defaultState,
        ...saved,
        student: { ...defaultState.student, ...(saved?.student || {}) }
      };
    } catch {
      return { ...defaultState };
    }
  }

  const appState = loadState();

  function saveState() {
    localStorage.setItem(stateKey, JSON.stringify(appState));
  }

  if (!localStorage.getItem('studentEmail')) {
    window.location.href = 'index.html';
  }

  const savedEmail = localStorage.getItem('studentEmail') || 'student@federalpolyede.edu.ng';
  const displayName = savedEmail.split('@')[0].replace(/[._-]/g, ' ');

  if (welcomeName) {
    welcomeName.textContent = displayName.charAt(0).toUpperCase() + displayName.slice(1);
  }

  if (studentEmail) {
    studentEmail.textContent = savedEmail;
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('studentEmail');
      localStorage.removeItem(stateKey);
      window.location.href = 'index.html';
    });
  }

  const navToggle = document.getElementById('navToggle');
  const coursesNavBtn = document.getElementById('coursesNavBtn');
  const selectedCoursesNav = document.getElementById('selectedCoursesNav');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const navMenu = document.querySelector('.nav-menu');
      if (!navMenu) return;

      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.textContent = isOpen ? 'Close' : 'Menu';
    });
  }

  if (coursesNavBtn && selectedCoursesNav) {
    coursesNavBtn.addEventListener('click', () => {
      const isOpen = !selectedCoursesNav.classList.contains('hidden');
      selectedCoursesNav.classList.toggle('hidden', isOpen);
      coursesNavBtn.setAttribute('aria-expanded', String(!isOpen));
    });
  }

  function renderCoursesInNav() {
    if (!selectedCoursesNav) return;

    const selected = getSelectedCourses();

    if (!selected.length) {
      selectedCoursesNav.innerHTML = '<span class="dropdown-empty">No registered courses yet</span>';
      return;
    }

    selectedCoursesNav.innerHTML = selected.map((course) => `
      <span class="nav-course-item">${course.name}</span>
    `).join('');
  }

  function populateStudentDetails() {
    document.getElementById('studentNameInput').value = appState.student.name;
    document.getElementById('studentIdInput').value = appState.student.studentId;
    document.getElementById('studentEmailInput').value = appState.student.email || savedEmail;
  }

  function populateDepartmentFilter() {
    const departmentName = 'Software and Web Development';
    departmentFilter.innerHTML = `<option value="${departmentName}">${departmentName}</option>`;
    departmentFilter.value = appState.department || departmentName;
  }

  function getSelectedCourses() {
    return courses.filter((course) => appState.selectedCourseCodes.includes(course.code));
  }

  function getFilteredCourses() {
    const query = appState.search.trim().toLowerCase();
    const department = appState.department;

    return courses.filter((course) => {
      const departmentName = 'Software and Web Development';
      const matchesDepartment = department === 'all' || department === departmentName
        ? course.department === departmentName
        : course.department === department;
      const matchesSearch =
        query === '' ||
        course.name.toLowerCase().includes(query) ||
        course.code.toLowerCase().includes(query) ||
        course.department.toLowerCase().includes(query);

      return matchesDepartment && matchesSearch;
    });
  }

  function updateSummary() {
    const selectedCourses = getSelectedCourses();
    const totalCredits = selectedCourses.reduce((sum, course) => sum + course.credits, 0);
    const remaining = Number.isFinite(maxCredits) ? maxCredits - totalCredits : 'No limit';

    totalCreditsEl.textContent = totalCredits;
    remainingCreditsEl.textContent = remaining;

    if (!selectedCourses.length) {
      selectedCoursesList.innerHTML = '';
      summaryMessage.textContent = 'No courses selected yet.';
      renderCoursesInNav();
      return;
    }

    renderCoursesInNav();

    selectedCoursesList.innerHTML = selectedCourses.map((course) => `
      <li>
        <div>
          <strong>${course.code}</strong>
          <span>${course.name}</span>
        </div>
        <em>${course.credits} units</em>
      </li>
    `).join('');

    summaryMessage.textContent = 'All selected courses are ready for registration.';
  }

  function renderCourses() {
    const filteredCourses = getFilteredCourses();

    if (!filteredCourses.length) {
      courseGrid.innerHTML = '';
      emptyState.classList.remove('hidden');
      return;
    }

    emptyState.classList.add('hidden');

    const currentTotal = getSelectedCourses().reduce((sum, course) => sum + course.credits, 0);

    courseGrid.innerHTML = filteredCourses.map((course) => {
      const isSelected = appState.selectedCourseCodes.includes(course.code);
      const wouldExceed = false;

      return `
        <article class="course-card ${isSelected ? 'selected' : ''}">
          <div class="course-card-head">
            <div>
              <span class="course-code">${course.code}</span>
              <h3>${course.name}</h3>
            </div>
            <span class="course-badge">${course.credits} Unit</span>
          </div>

          <p class="course-dept">${course.department}</p>
          <p class="course-description">${course.description}</p>

          <div class="course-meta">
            <span>Open</span>
          </div>

          <button
            type="button"
            class="course-action ${isSelected ? 'remove' : ''}"
            data-course-code="${course.code}"
            ${wouldExceed ? 'disabled' : ''}
            aria-label="${isSelected ? 'Remove' : 'Add'} ${course.name}"
          >
            ${isSelected ? 'Remove' : 'Add course'}
          </button>
        </article>
      `;
    }).join('');
  }

  function setRegistrationMessage(message, type = 'error') {
    registrationMessage.textContent = message;
    registrationMessage.className = `form-message ${type}`;
  }

  function validateRegistrationForm() {
    const name = document.getElementById('studentNameInput').value.trim();
    const studentId = document.getElementById('studentIdInput').value.trim();
    const email = document.getElementById('studentEmailInput').value.trim();

    if (!name || !studentId || !email) {
      return 'Please complete all student details before registration.';
    }

    if (name.length < 3) {
      return 'Student name must be at least 3 characters long.';
    }

    if (!/^[A-Za-z0-9/-]+$/.test(studentId)) {
      return 'Student ID format is invalid. Use letters, numbers, slash, or hyphen.';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return 'Please enter a valid email address.';
    }

    if (!appState.selectedCourseCodes.length) {
      return 'Please select at least one course.';
    }

    return '';
  }

  function saveStudentDetails() {
    appState.student.name = document.getElementById('studentNameInput').value.trim();
    appState.student.studentId = document.getElementById('studentIdInput').value.trim();
    appState.student.email = document.getElementById('studentEmailInput').value.trim();
    saveState();
  }

  function canShowCourses() {
    const name = document.getElementById('studentNameInput').value.trim();
    const studentId = document.getElementById('studentIdInput').value.trim();
    const email = document.getElementById('studentEmailInput').value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return name.length >= 3 && /^[A-Za-z0-9/-]+$/.test(studentId) && emailPattern.test(email);
  }

  function updateRegisterButtonState() {
    if (!showCoursesBtn) return;
    showCoursesBtn.disabled = !canShowCourses();
  }

  function updateSubmitButtonState() {
    if (!submitRegistrationBtn) return;

    if (appState.selectedCourseCodes.length > 0) {
      submitRegistrationBtn.classList.remove('hidden');
      return;
    }

    submitRegistrationBtn.classList.add('hidden');
  }

  function updatePrintSummary() {
    if (!printRegistrationSummary || !printStudentName || !printStudentId || !printStudentEmail || !printCourseList) return;

    const selectedCourses = getSelectedCourses();
    printStudentName.textContent = appState.student.name || 'N/A';
    printStudentId.textContent = appState.student.studentId || 'N/A';
    printStudentEmail.textContent = appState.student.email || savedEmail;

    if (!selectedCourses.length) {
      printCourseList.innerHTML = '<li>No registered courses</li>';
      return;
    }

    printCourseList.innerHTML = selectedCourses.map((course) => `
      <li>
        <span>${course.name}</span>
        <strong>${course.credits} units</strong>
      </li>
    `).join('');
  }

  function updatePrintButtonState() {
    if (!printRegistrationBtn || !printRegistrationSummary) return;

    const isSuccess = registrationMessage.textContent.includes('Registration successful');

    if (appState.selectedCourseCodes.length > 0 && isSuccess) {
      printRegistrationBtn.classList.remove('hidden');
      printRegistrationSummary.classList.remove('hidden');
      updatePrintSummary();
      return;
    }

    printRegistrationBtn.classList.add('hidden');
    printRegistrationSummary.classList.add('hidden');
  }

  if (showCoursesBtn && courseCatalogPanel) {
    showCoursesBtn.addEventListener('click', () => {
      if (showCoursesBtn.disabled) return;
      courseCatalogPanel.classList.remove('hidden');
      showCoursesBtn.classList.add('hidden');
      renderCourses();
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
  }

  document.getElementById('studentNameInput').addEventListener('input', () => {
    saveStudentDetails();
    updateRegisterButtonState();
  });
  document.getElementById('studentIdInput').addEventListener('input', () => {
    saveStudentDetails();
    updateRegisterButtonState();
  });
  document.getElementById('studentEmailInput').addEventListener('input', () => {
    saveStudentDetails();
    updateRegisterButtonState();
  });

  searchInput.addEventListener('input', (event) => {
    appState.search = event.target.value;
    saveState();
    renderCourses();
  });

  departmentFilter.addEventListener('change', (event) => {
    appState.department = event.target.value;
    saveState();
    renderCourses();
  });

  courseGrid.addEventListener('click', (event) => {
    const button = event.target.closest('.course-action');
    if (!button) return;

    const code = button.dataset.courseCode;
    const selectedIndex = appState.selectedCourseCodes.indexOf(code);
    const targetCourse = courses.find((course) => course.code === code);

    if (!targetCourse) return;

    if (selectedIndex >= 0) {
      appState.selectedCourseCodes.splice(selectedIndex, 1);
      saveState();
      renderCourses();
      updateSummary();
      updateSubmitButtonState();
      setRegistrationMessage('Course removed successfully.', 'success');
      return;
    }

    appState.selectedCourseCodes.push(code);
    saveState();
    renderCourses();
    updateSummary();
    updateSubmitButtonState();
    setRegistrationMessage('Course added successfully.', 'success');
  });

  registrationForm.addEventListener('submit', (event) => {
    event.preventDefault();
    saveStudentDetails();

    const error = validateRegistrationForm();
    if (error) {
      setRegistrationMessage(error, 'error');
      updatePrintButtonState();
      return;
    }

    const totalCredits = getSelectedCourses().reduce((sum, course) => sum + course.credits, 0);
    setRegistrationMessage(
      `Registration successful for ${appState.student.name}. You registered for ${appState.selectedCourseCodes.length} courses totaling ${totalCredits} units.`,
      'success'
    );
    updatePrintButtonState();
  });

  if (printRegistrationBtn) {
    printRegistrationBtn.addEventListener('click', () => {
      updatePrintSummary();
      window.print();
    });
  }

  populateDepartmentFilter();
  populateStudentDetails();
  searchInput.value = appState.search;
  updateRegisterButtonState();
  updateSubmitButtonState();
  updatePrintButtonState();
  renderCoursesInNav();
  renderCourses();
  updateSummary();
}
