const api = '/api/students';
const $ = (id) => document.getElementById(id);
const form = $('student-form');
let students = [];

function setMessage(text, error = false) {
  const message = $('message');
  message.textContent = text;
  message.classList.toggle('error', error);
}

function filteredStudents() {
  const term = $('search').value.trim().toLowerCase();
  const status = $('filter').value;
  return students.filter((student) => {
    const searchable = `${student.name} ${student.studentId} ${student.email} ${student.course}`.toLowerCase();
    return searchable.includes(term) && (status === 'All' || student.status === status);
  });
}

function render() {
  $('total').textContent = students.length;
  $('active').textContent = students.filter((student) => student.status === 'Active').length;
  $('leave').textContent = students.filter((student) => student.status === 'On Leave').length;
  $('graduated').textContent = students.filter((student) => student.status === 'Graduated').length;
  const visible = filteredStudents();
  $('record-count').textContent = `${visible.length} ${visible.length === 1 ? 'student' : 'students'}`;
  $('records').innerHTML = visible.length ? visible.map((student) => `
    <tr><td><strong>${escapeHtml(student.name)}</strong><small>${escapeHtml(student.email)}</small></td>
    <td>${escapeHtml(student.course)}<small>${escapeHtml(student.studentId)}</small></td>
    <td>${escapeHtml(student.yearLevel)} / ${escapeHtml(student.section)}</td>
    <td><span class="status ${student.status.toLowerCase().replaceAll(' ', '-')}">${escapeHtml(student.status)}</span></td>
    <td><button class="edit" data-edit="${student.id}">Edit</button><button class="delete" data-delete="${student.id}">Delete</button></td></tr>`).join('') : '<tr><td class="empty" colspan="5">No students found. Add a student to begin.</td></tr>';
}

function escapeHtml(value) { return String(value ?? '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' })[character]); }
function showForm(student = null) {
  form.reset();
  $('record-id').value = student?.id || '';
  $('form-title').textContent = student ? 'Edit student' : 'Add student';
  $('enrollment-date').value = student?.enrollmentDate || new Date().toISOString().slice(0, 10);
  $('status').value = student?.status || 'Active';
  ['student-id', 'name', 'email', 'phone', 'course', 'course-code', 'year-level', 'section', 'address'].forEach((field) => { if (student) $(field).value = student[{ 'student-id': 'studentId', name: 'name', email: 'email', phone: 'phone', course: 'course', 'course-code': 'courseCode', 'year-level': 'yearLevel', section: 'section', address: 'address' }[field]] || ''; });
  $('form-panel').classList.remove('hidden');
  $('student-id').focus();
}
async function load() { try { const response = await fetch(api); if (!response.ok) throw new Error('API request failed.'); students = await response.json(); render(); } catch (error) { setMessage('Start the backend with run-backend.cmd, then refresh this page.', true); } }
async function save(event) { event.preventDefault(); const payload = { studentId: $('student-id').value.trim(), name: $('name').value.trim(), email: $('email').value.trim(), phone: $('phone').value.trim(), course: $('course').value.trim(), courseCode: $('course-code').value.trim(), yearLevel: $('year-level').value, section: $('section').value.trim(), enrollmentDate: $('enrollment-date').value, status: $('status').value, address: $('address').value.trim() }; const id = $('record-id').value; try { const response = await fetch(id ? `${api}/${id}` : api, { method: id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(id ? { id: Number(id), ...payload } : payload) }); if (!response.ok) throw new Error(await response.text()); $('form-panel').classList.add('hidden'); await load(); } catch (error) { setMessage(error.message || 'Unable to save student.', true); } }
form.addEventListener('submit', save);
$('add-button').addEventListener('click', () => showForm());
$('close-button').addEventListener('click', () => $('form-panel').classList.add('hidden'));
$('cancel-button').addEventListener('click', () => $('form-panel').classList.add('hidden'));
$('search').addEventListener('input', render);
$('filter').addEventListener('change', render);
$('records').addEventListener('click', async (event) => { const editId = event.target.dataset.edit; const deleteId = event.target.dataset.delete; if (editId) showForm(students.find((student) => student.id === Number(editId))); if (deleteId && confirm('Delete this student record?')) { await fetch(`${api}/${deleteId}`, { method: 'DELETE' }); await load(); } });
load();
