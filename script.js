const STORAGE_KEY = 'studentRecords';

const form = document.getElementById('record-form');
const recordIdInput = document.getElementById('record-id');
const studentIdInput = document.getElementById('student-id');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const courseInput = document.getElementById('course');
const customCourseInput = document.getElementById('custom-course');
const courseCodeInput = document.getElementById('course-code');
const yearLevelInput = document.getElementById('year-level');
const sectionInput = document.getElementById('section');
const enrollmentDateInput = document.getElementById('enrollment-date');
const statusInput = document.getElementById('status');
const addressInput = document.getElementById('address');
const saveButton = document.getElementById('save-button');
const cancelButton = document.getElementById('cancel-button');
const messageElement = document.getElementById('message');
const recordsBody = document.getElementById('records-body');
const searchInput = document.getElementById('student-search');
const statusFilter = document.getElementById('status-filter');
const studentCount = document.getElementById('student-count');
const visibleCount = document.getElementById('visible-count');
const formPanel = document.getElementById('student-form-panel');
const toggleFormButton = document.getElementById('toggle-form-button');
const closeFormButton = document.getElementById('close-form-button');
const notificationButton = document.getElementById('notification-button');
const notificationPopover = document.getElementById('notification-popover');
const profileButton = document.getElementById('profile-button');
const helpButton = document.getElementById('help-button');
const studentsNavButton = document.querySelector('.nav-item');

let records = [];

function getRecordsFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading storage:', error);
    return [];
  }
}
function saveRecordsToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function showMessage(text, type = 'success') {
  messageElement.textContent = text;
  messageElement.classList.toggle('error', type === 'error');
  if (text) {
    setTimeout(() => {
      if (messageElement.textContent === text) {
        messageElement.textContent = '';
        messageElement.classList.remove('error');
      }
    }, 3500);
  }
}

function resetForm() {
  form.reset();
  recordIdInput.value = '';
  saveButton.textContent = 'Save Student';
  statusInput.value = 'Active';
  customCourseInput.value = '';
  customCourseInput.classList.add('hidden');
  showMessage('');
}

function showForm() {
  formPanel.classList.remove('hidden');
  studentIdInput.focus();
}

function hideForm() {
  formPanel.classList.add('hidden');
  resetForm();
}

function showPopover(text) {
  notificationPopover.textContent = text;
  notificationPopover.classList.remove('hidden');
}

function buildRecordRow(record) {
  const row = document.createElement('tr');

  [record.studentId, record.course, record.courseCode || 'Not provided', record.phone, `${record.yearLevel} / ${record.section}`].forEach((value) => {
    const cell = document.createElement('td');
    cell.textContent = value;
    row.appendChild(cell);
  });

  const studentCell = row.insertCell(1);
  studentCell.className = 'student-cell';
  const studentName = document.createElement('strong');
  studentName.textContent = record.name;
  const studentEmail = document.createElement('small');
  studentEmail.textContent = record.email;
  studentCell.append(studentName, studentEmail);

  const statusCell = document.createElement('td');
  const statusBadge = document.createElement('span');
  statusBadge.className = `status-badge ${record.status.toLowerCase().replaceAll(' ', '-')}`;
  statusBadge.textContent = record.status;
  statusCell.appendChild(statusBadge);
  row.appendChild(statusCell);

  const actionsCell = document.createElement('td');
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'action-buttons';

  const editButton = document.createElement('button');
  editButton.type = 'button';
  editButton.className = 'action edit';
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => fillFormForEdit(record.id));

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'action delete';
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => deleteRecord(record.id));

  buttonContainer.appendChild(editButton);
  buttonContainer.appendChild(deleteButton);
  actionsCell.appendChild(buttonContainer);
  row.appendChild(actionsCell);

  return row;
}

function renderRecords() {
  recordsBody.innerHTML = '';
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedStatus = statusFilter.value;
  const visibleRecords = records.filter((record) => {
    const matchesSearch = [record.studentId, record.name, record.email, record.course, record.courseCode].some((value) => String(value || '').toLowerCase().includes(searchTerm));
    return matchesSearch && (selectedStatus === 'All' || record.status === selectedStatus);
  });
  studentCount.textContent = records.length;
  visibleCount.textContent = `${visibleRecords.length} ${visibleRecords.length === 1 ? 'student' : 'students'}`;

  if (visibleRecords.length === 0) {
    const emptyRow = document.createElement('tr');
    const emptyMessageCell = document.createElement('td');
    emptyMessageCell.colSpan = 8;
    emptyMessageCell.className = 'empty-state';
    emptyMessageCell.textContent = records.length === 0 ? 'No students yet. Add a student to see them here.' : 'No students match your search.';
    emptyRow.appendChild(emptyMessageCell);
    recordsBody.appendChild(emptyRow);
    return;
  }

  visibleRecords.forEach((record) => {
    recordsBody.appendChild(buildRecordRow(record));
  });
}

function validateForm() {
  const trimmedName = nameInput.value.trim();
  const studentId = studentIdInput.value.trim();
  const trimmedEmail = emailInput.value.trim();
  const trimmedPhone = phoneInput.value.trim();
  const trimmedCourse = courseInput.value === 'Others' ? customCourseInput.value.trim() : courseInput.value;
  const trimmedCourseCode = courseCodeInput.value.trim();
  const trimmedSection = sectionInput.value.trim();
  const trimmedAddress = addressInput.value.trim();

  if (!studentId || !trimmedName || !trimmedEmail || !trimmedPhone || !trimmedCourse || !trimmedCourseCode || !trimmedSection || !trimmedAddress || !yearLevelInput.value || !enrollmentDateInput.value) {
    showMessage('Please complete all student fields.', 'error');
    return false;
  }

  if (records.some((record) => record.studentId.toLowerCase() === studentId.toLowerCase() && record.id !== recordIdInput.value)) {
    showMessage('Student ID must be unique.', 'error');
    return false;
  }

  return true;
}

function createRecord(recordData) {
  records.push(recordData);
  saveRecordsToStorage();
  renderRecords();
  showMessage('Student added successfully.');
}

function updateRecord(recordId, recordData) {
  const index = records.findIndex((record) => record.id === recordId);
  if (index === -1) {
    showMessage('Record not found.', 'error');
    return;
  }

  records[index] = { ...records[index], ...recordData };
  saveRecordsToStorage();
  renderRecords();
  showMessage('Student updated successfully.');
}

function deleteRecord(recordId) {
  const record = records.find((item) => item.id === recordId);
  if (!record) {
    showMessage('Record not found.', 'error');
    return;
  }

  const confirmed = window.confirm(`Delete student "${record.name}"?`);
  if (!confirmed) {
    return;
  }

  records = records.filter((item) => item.id !== recordId);
  saveRecordsToStorage();
  renderRecords();
  showMessage('Student deleted successfully.');
  if (recordIdInput.value === recordId) {
    resetForm();
  }
}

function fillFormForEdit(recordId) {
  const record = records.find((item) => item.id === recordId);
  if (!record) {
    showMessage('Unable to find record for editing.', 'error');
    return;
  }

  showForm();
  recordIdInput.value = record.id;
  studentIdInput.value = record.studentId;
  nameInput.value = record.name;
  emailInput.value = record.email;
  phoneInput.value = record.phone;
  const standardCourses = ['BSCS', 'BSIS', 'BLIS'];
  if (standardCourses.includes(record.course)) {
    courseInput.value = record.course;
    customCourseInput.value = '';
    customCourseInput.classList.add('hidden');
  } else {
    courseInput.value = 'Others';
    customCourseInput.value = record.course || '';
    customCourseInput.classList.remove('hidden');
  }
  courseCodeInput.value = record.courseCode || '';
  yearLevelInput.value = record.yearLevel;
  sectionInput.value = record.section;
  enrollmentDateInput.value = record.enrollmentDate;
  statusInput.value = record.status;
  addressInput.value = record.address;
  saveButton.textContent = 'Update Student';
  showMessage('You are editing an existing student.');
}

function handleSubmit(event) {
  event.preventDefault();
  if (!validateForm()) {
    return;
  }

  const recordData = {
    studentId: studentIdInput.value.trim(),
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
    course: courseInput.value === 'Others' ? customCourseInput.value.trim() : courseInput.value,
    courseCode: courseCodeInput.value.trim(),
    yearLevel: yearLevelInput.value,
    section: sectionInput.value.trim(),
    enrollmentDate: enrollmentDateInput.value,
    status: statusInput.value,
    address: addressInput.value.trim(),
  };

  const existingId = recordIdInput.value;
  if (existingId) {
    updateRecord(existingId, recordData);
  } else {
    createRecord({ id: Date.now().toString(), ...recordData });
  }

  resetForm();
}

function init() {
  records = getRecordsFromStorage();
  renderRecords();
  form.addEventListener('submit', handleSubmit);
  cancelButton.addEventListener('click', resetForm);
  cancelButton.addEventListener('click', hideForm);
  toggleFormButton.addEventListener('click', showForm);
  closeFormButton.addEventListener('click', hideForm);
  searchInput.addEventListener('input', renderRecords);
  statusFilter.addEventListener('change', renderRecords);
  courseInput.addEventListener('change', () => {
    const usesCustomCourse = courseInput.value === 'Others';
    customCourseInput.classList.toggle('hidden', !usesCustomCourse);
    if (usesCustomCourse) {
      customCourseInput.focus();
    } else {
      customCourseInput.value = '';
    }
  });
  notificationButton.addEventListener('click', () => showPopover('No new notifications'));
  profileButton.addEventListener('click', () => showPopover('Administrator profile'));
  helpButton.addEventListener('click', () => showPopover('Use Add a student to create a college record.'));
  studentsNavButton.addEventListener('click', () => {
    hideForm();
    document.getElementById('directory').scrollIntoView({ behavior: 'smooth' });
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.topbar-actions') && !event.target.closest('#help-button')) {
      notificationPopover.classList.add('hidden');
    }
  });
}

init();
