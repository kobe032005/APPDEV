const API_URL = 'http://localhost:5000/api/students';

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
const totalStat = document.getElementById('total-stat');
const activeStat = document.getElementById('active-stat');
const leaveStat = document.getElementById('leave-stat');
const graduatedStat = document.getElementById('graduated-stat');
const activePercent = document.getElementById('active-percent');
const leavePercent = document.getElementById('leave-percent');
const graduatedPercent = document.getElementById('graduated-percent');
const activeBar = document.getElementById('active-bar');
const leaveBar = document.getElementById('leave-bar');
const graduatedBar = document.getElementById('graduated-bar');
const courseSummary = document.getElementById('course-summary');
const dashboardVisible = document.getElementById('dashboard-visible');
const latestEnrollment = document.getElementById('latest-enrollment');
const completionRate = document.getElementById('completion-rate');
const formPanel = document.getElementById('student-form-panel');
const toggleFormButton = document.getElementById('toggle-form-button');
const closeFormButton = document.getElementById('close-form-button');
const notificationButton = document.getElementById('notification-button');
const notificationPopover = document.getElementById('notification-popover');
const profileButton = document.getElementById('profile-button');
const helpButton = document.getElementById('help-button');
const studentsNavButton = document.querySelector('.nav-item');

let records = [];

async function loadRecords() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Unable to load students from the API.');
  records = await response.json();
  renderRecords();
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
  totalStat.textContent = records.length;
  activeStat.textContent = records.filter((record) => record.status === 'Active').length;
  leaveStat.textContent = records.filter((record) => record.status === 'On Leave').length;
  graduatedStat.textContent = records.filter((record) => record.status === 'Graduated').length;
  const total = records.length || 1;
  const statusCounts = {
    active: records.filter((record) => record.status === 'Active').length,
    leave: records.filter((record) => record.status === 'On Leave').length,
    graduated: records.filter((record) => record.status === 'Graduated').length,
  };
  const percentages = Object.fromEntries(Object.entries(statusCounts).map(([key, value]) => [key, Math.round((value / total) * 100)]));
  activePercent.textContent = `${percentages.active}%`;
  leavePercent.textContent = `${percentages.leave}%`;
  graduatedPercent.textContent = `${percentages.graduated}%`;
  activeBar.style.width = `${percentages.active}%`;
  leaveBar.style.width = `${percentages.leave}%`;
  graduatedBar.style.width = `${percentages.graduated}%`;
  dashboardVisible.textContent = visibleRecords.length;
  completionRate.textContent = `${percentages.graduated}%`;
  const latest = [...records].sort((a, b) => String(b.enrollmentDate).localeCompare(String(a.enrollmentDate)))[0];
  latestEnrollment.textContent = latest?.enrollmentDate || 'None';
  const courses = Object.entries(records.reduce((summary, record) => ({ ...summary, [record.course]: (summary[record.course] || 0) + 1 }), {})).sort((a, b) => b[1] - a[1]).slice(0, 3);
  courseSummary.innerHTML = courses.length ? courses.map(([course, count]) => `<div class="course-row"><span>${course}</span><strong>${count}</strong></div>`).join('') : '<p class="empty-insight">Add students to see course distribution.</p>';
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

async function createRecord(recordData) {
  const response = await fetch(API_URL, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(recordData),
  });
  if (!response.ok) throw new Error(await response.text());
  await loadRecords();
  showMessage('Student added successfully.');
}

async function updateRecord(recordId, recordData) {
  const response = await fetch(`${API_URL}/${recordId}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: Number(recordId), ...recordData }),
  });
  if (!response.ok) throw new Error(await response.text());
  await loadRecords();
  showMessage('Student updated successfully.');
}

async function deleteRecord(recordId) {
  const record = records.find((item) => item.id === recordId);
  if (!record) {
    showMessage('Record not found.', 'error');
    return;
  }

  const confirmed = window.confirm(`Delete student "${record.name}"?`);
  if (!confirmed) {
    return;
  }

  const response = await fetch(`${API_URL}/${recordId}`, { method: 'DELETE' });
  if (!response.ok) {
    showMessage('Unable to delete record.', 'error');
    return;
  }
  await loadRecords();
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

async function handleSubmit(event) {
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
  try {
    if (existingId) await updateRecord(existingId, recordData);
    else await createRecord(recordData);
  } catch (error) {
    showMessage(error.message, 'error');
    return;
  }

  resetForm();
}

function init() {
  loadRecords().catch((error) => showMessage(error.message, 'error'));
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
