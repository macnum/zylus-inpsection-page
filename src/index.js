// ===== ELEMENT REFERENCES (top: grab once, use everywhere) =====
const form = document.getElementById('inspectionForm');
const successPanel = document.getElementById('successPanel');
const dateInput = document.getElementById('inspection-date');
const categorySelect = document.getElementById('category');

const SCRIPT_URL =
	'https://script.google.com/macros/s/AKfycbyc8Rw3rCAnaOPJFdMTliRWdZLigYXwL2B7nSw5HuDwzfC9PfzUt44E2BNTY9NRy6FaEQ/exec';

dateInput.min = new Date().toISOString().split('T')[0];

const ALLOWED_DAYS = [2, 4, 6];

function restrictionActive() {
	return categorySelect.value === 'Realtor Only';
}

function validateInspectionDate() {
	if (!restrictionActive() || !dateInput.value) return;

	const picked = new Date(dateInput.value + 'T00:00:00');
	const dayName = picked.toLocaleDateString('en-US', { weekday: 'long' });

	if (!ALLOWED_DAYS.includes(picked.getDay())) {
		alert(
			`${dayName} isn't available — realtor inspections hold on Tuesdays, Thursdays and Saturdays.`,
		);
		dateInput.value = '';
	}
}

dateInput.addEventListener('change', validateInspectionDate);
categorySelect.addEventListener('change', validateInspectionDate);

form.addEventListener('submit', async (ev) => {
	ev.preventDefault();
	const btn = form.querySelector('button[type=submit]');
	btn.disabled = true;
	btn.textContent = 'Booking...';

	const clientEmail = form.email.value;
	const summary = `${form.property.value} — ${form.date.value} at ${form.time.value}`;

	try {
		await fetch(SCRIPT_URL, {
			method: 'POST',
			body: new FormData(form),
		});

		document.getElementById('sentToEmail').textContent = clientEmail;
		document.getElementById('successSummary').textContent = summary;

		form.reset();
		form.hidden = true;
		successPanel.hidden = false;
	} catch (err) {
		btn.textContent = 'Something went wrong — try again';
		btn.disabled = false;
	}
});

document.getElementById('bookNewBtn').addEventListener('click', () => {
	successPanel.hidden = true;
	form.hidden = false;

	const btn = form.querySelector('button[type=submit]');
	btn.disabled = false;
	btn.textContent = 'Book Inspection';

	form.querySelector('input').focus();
});
