document.addEventListener("DOMContentLoaded", loadProfiles);

function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.toggle('hidden');
}

// Загрузка анкет с сервера
async function loadProfiles() {
    const res = await fetch('/api/profiles');
    const profiles = await res.json();
    const container = document.getElementById('profilesContainer');
    container.innerHTML = '';

    profiles.forEach(p => {
        const card = document.createElement('div');
        card.className = 'profile-card';
        card.innerHTML = `
            <div class="profile-info">
                <span class="material-symbols-outlined avatar">account_circle</span>
                <div>
                    <h3>${p.name}</h3>
                    <p class="subject"><span class="material-symbols-outlined">menu_book</span> ${p.subject}</p>
                    <p class="price">${p.price}</p>
                </div>
            </div>
            <div class="actions">
                <button class="icon-btn" title="Сохранить"><span class="material-symbols-outlined">bookmark_border</span></button>
                <button class="icon-btn danger" onclick="deleteProfile(${p.id})" title="Удалить анкету"><span class="material-symbols-outlined">delete</span></button>
            </div>
            <button class="btn orderBtn" onclick="startOrder(this)">
                <span class="btn__label">ЗАКАЗАТЬ</span>
                <div class="btn__scene" aria-hidden="true">
                    <div class="truck">
                        <svg width="74" height="36" viewBox="0 0 74 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="2" y="6" width="38" height="24" rx="2" fill="#7c3aed" />
                            <rect x="2" y="6" width="38" height="24" rx="2" stroke="#a78bfa" stroke-width="1" />
                            <line x1="28" y1="7" x2="28" y2="29" stroke="#c4b5fd" stroke-width="1" stroke-dasharray="2 2" />
                            <rect x="8" y="11" width="14" height="13" rx="1" fill="#a78bfa" opacity="0.5" />
                            <line x1="15" y1="11" x2="15" y2="24" stroke="#c4b5fd" stroke-width="0.8" />
                            <path d="M40 10 L54 10 L62 18 L62 30 L40 30 Z" fill="#9333ea" />
                            <path d="M40 10 L54 10 L62 18 L62 30 L40 30 Z" stroke="#a78bfa" stroke-width="1" />
                            <path d="M43 12 L53 12 L60 18 L43 18 Z" fill="#c4b5fd" opacity="0.4" />
                            <rect x="41" y="6" width="3" height="8" rx="1" fill="#7c3aed" />
                            <rect x="60" y="26" width="4" height="4" rx="1" fill="#7c3aed" />
                            <rect x="2" y="28" width="64" height="4" rx="1" fill="#4B0082" />
                            <g class="wheel" style="transform-box:fill-box;transform-origin:center">
                                <circle cx="16" cy="33" r="5" fill="#2d0a5e" stroke="#a78bfa" stroke-width="1.2" />
                                <line x1="16" y1="28.5" x2="16" y2="37.5" stroke="#a78bfa" stroke-width="1" />
                                <line x1="11.5" y1="33" x2="20.5" y2="33" stroke="#a78bfa" stroke-width="1" />
                                <line x1="12.5" y1="29.5" x2="19.5" y2="36.5" stroke="#a78bfa" stroke-width="0.8" />
                                <line x1="19.5" y1="29.5" x2="12.5" y2="36.5" stroke="#a78bfa" stroke-width="0.8" />
                                <circle cx="16" cy="33" r="1.5" fill="#a78bfa" />
                            </g>
                            <g class="wheel" style="transform-box:fill-box;transform-origin:center">
                                <circle cx="52" cy="33" r="5" fill="#2d0a5e" stroke="#a78bfa" stroke-width="1.2" />
                                <line x1="52" y1="28.5" x2="52" y2="37.5" stroke="#a78bfa" stroke-width="1" />
                                <line x1="47.5" y1="33" x2="56.5" y2="33" stroke="#a78bfa" stroke-width="1" />
                                <line x1="48.5" y1="29.5" x2="55.5" y2="36.5" stroke="#a78bfa" stroke-width="0.8" />
                                <line x1="55.5" y1="29.5" x2="48.5" y2="36.5" stroke="#a78bfa" stroke-width="0.8" />
                                <circle cx="52" cy="33" r="1.5" fill="#a78bfa" />
                            </g>
                            <rect x="61" y="20" width="3" height="5" rx="1" fill="#fef08a" opacity="0.9" />
                        </svg>
                    </div>
                </div>
                <div class="btn__success">
                    <div class="check-icon">
                        <svg viewBox="0 0 13 13" fill="none"><polyline points="2,7 5,10 11,3" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                    </div>ОФОРМЛЕНО!
                </div>
            </button>
        `;
        container.appendChild(card);
    });
}

// Создание анкеты
async function createProfile() {
    const name = document.getElementById('profName').value;
    const subject = document.getElementById('profSubject').value;
    const price = document.getElementById('profPrice').value;

    if(!name || !subject || !price) return alert("Заполните все поля!");

    await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, subject, price })
    });

    toggleModal('createProfileModal');
    loadProfiles(); // Обновляем список
}

// Удаление анкеты
async function deleteProfile(id) {
    if(confirm("Удалить анкету?")) {
        await fetch(`/api/profiles/${id}`, { method: 'DELETE' });
        loadProfiles();
    }
}

// Удаление аккаунта
async function deleteAccount() {
    if(confirm("Вы уверены, что хотите навсегда удалить аккаунт и все анкеты?")) {
        await fetch('/api/account', { method: 'DELETE' });
        document.body.innerHTML = "<h2 style='text-align:center; margin-top: 50px;'>Аккаунт удален. До свидания!</h2>";
    }
}

// Кнопка заказа и чат
function startOrder(btnElement) {
    if (btnElement.classList.contains('is-driving') || btnElement.classList.contains('is-success')) return;

    btnElement.classList.add('is-driving');

    setTimeout(() => {
        btnElement.classList.remove('is-driving');
        btnElement.classList.add('is-success');
        
        setTimeout(() => { toggleModal('chatModal'); }, 600);
    }, 2050);
}

// Имитация отправки сообщения в чат
function sendMessage() {
    const input = document.getElementById('chatInputMsg');
    const msg = input.value.trim();
    if(msg) {
        const chatBox = document.getElementById('chatMessages');
        chatBox.innerHTML += `<p class="user-msg">${msg}</p>`;
        input.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}
