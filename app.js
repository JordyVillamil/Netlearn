document.addEventListener('DOMContentLoaded', function() {
    // =================================================================
    // CONFIGURACIÓN Y SELECTORES DE ELEMENTOS
    // =================================================================
    const API_BASE_URL = 'http://192.168.2.14:8000';

    // Pantallas principales
    const authScreen = document.getElementById('auth-screen');
    const appContainer = document.getElementById('app-container');
    const notificationBanner = document.getElementById('notification-banner');

    // Elementos de autenticación
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutButton = document.getElementById('logout-button');

    // Vistas de la aplicación
    const views = {
        dashboard: document.getElementById('dashboard-view'),
        learningPath: document.getElementById('learning-path-view'),
        lesson: document.getElementById('lesson-view'),
        profile: document.getElementById('profile-view'),
        admin: document.getElementById('admin-view')
    };

    // Navegación
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-navbar a');

    // =================================================================
    // FUNCIONES DE UTILIDAD
    // =================================================================

    function showNotification(message, isError = false) {
        if (!notificationBanner) return;
        notificationBanner.textContent = message;
        notificationBanner.className = 'fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white z-50';
        notificationBanner.classList.add(isError ? 'bg-red-500' : 'bg-green-500');
        notificationBanner.classList.remove('hidden');
        setTimeout(() => notificationBanner.classList.add('hidden'), 3000);
    }

    async function fetchWithAuth(url, options = {}) {
        const token = localStorage.getItem('token');
        const headers = { 'Content-Type': 'application/json', ...options.headers };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });
        if (response.status === 401) {
            handleLogout();
            throw new Error('Unauthorized');
        }
        return response;
    }


    // =================================================================
    // CARGA Y RENDERIZADO DE DATOS (LA PARTE CLAVE)
    // =================================================================

    async function loadUserPoints() {
        try {
            const response = await fetchWithAuth('/gamification/points/me');
            if (!response.ok) throw new Error('Could not fetch points.');
            const data = await response.json();
            const userPointsEl = document.getElementById('user-points');
            if (userPointsEl) userPointsEl.textContent = `Puntos: ${data.total}`;
        } catch (error) {
            console.error("Error loading points:", error);
        }
    }

    /**
     * Carga los cursos y los renderiza en el contenedor.
     */
    async function loadCourses() {
        try {
            const response = await fetchWithAuth('/courses/');
            if (!response.ok) throw new Error('Could not fetch courses.');
            const courses = await response.json();
            const coursesContainer = document.getElementById('courses-container');
            if (!coursesContainer) return;

            coursesContainer.innerHTML = ''; // Limpiar contenido anterior

            if (courses.length === 0) {
                coursesContainer.innerHTML = '<p class="text-gray-500">No hay cursos disponibles en este momento.</p>';
                return;
            }

            // --- ESTA ES LA LÓGICA DE RENDERIZADO ---
            courses.forEach(course => {
                const courseCard = document.createElement('div');
                courseCard.className = 'module-card bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition';
                
                courseCard.innerHTML = `
                    <div class="flex items-center mb-4">
                        <div class="p-3 rounded-full netlearn-bg-primary text-white mr-4">
                            <i class="fas fa-network-wired"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-lg text-gray-800">${course.title}</h3>
                            <p class="text-sm text-gray-500">Módulo</p>
                        </div>
                    </div>
                    <p class="text-gray-600 mb-4">${course.description}</p>
                    <button class="w-full netlearn-bg-primary text-white py-2 rounded-lg font-semibold hover:opacity-90">
                        Empezar Curso
                    </button>
                `;
                coursesContainer.appendChild(courseCard);
            });
            // --- FIN DE LA LÓGICA DE RENDERIZADO ---

        } catch (error) {
            console.error("Error loading courses:", error);
            showNotification('No se pudieron cargar los cursos.', true);
        }
    }
    
    async function loadUserProfile() {
        try {
            const response = await fetchWithAuth('/users/me');
            if (!response.ok) throw new Error('Could not fetch profile.');
            const user = await response.json();
            
            const profileName = document.getElementById('profile-name');
            const profileEmail = document.getElementById('profile-email');

            if(profileName) profileName.textContent = `Bienvenido, ${user.email}`;
            if(profileEmail) profileEmail.textContent = `Email: ${user.email}`;

        } catch (error) {
            console.error("Error loading profile:", error);
        }
    }

    // =================================================================
    // LÓGICA DE LA INTERFAZ DE USUARIO (UI)
    // =================================================================

    function switchAuthTab(target) {
        const isLogin = target === 'login';
        loginTab.classList.toggle('netlearn-border-primary', isLogin);
        loginTab.classList.toggle('netlearn-text-primary', isLogin);
        registerTab.classList.toggle('netlearn-border-primary', !isLogin);
        registerTab.classList.toggle('netlearn-text-primary', !isLogin);
        loginForm.classList.toggle('hidden', !isLogin);
        registerForm.classList.toggle('hidden', isLogin);
    }

    function switchView(viewName) {
        Object.values(views).forEach(view => view && view.classList.add('hidden'));
        sidebarLinks.forEach(link => link.classList.remove('netlearn-bg-primary', 'text-white'));
        
        const viewToShow = views[viewName];
        if (viewToShow) {
            viewToShow.classList.remove('hidden');
            // Cargar datos dinámicos para la vista
            switch (viewName) {
                case 'dashboard':
                    loadCourses();
                    loadUserPoints();
                    break;
                case 'learning-path':
                    // Aquí podrías cargar la ruta de aprendizaje específica del usuario
                    break;
                case 'profile':
                    loadUserProfile();
                    break;
            }
        }

        const linkToActivate = document.querySelector(`.sidebar-link[data-view="${viewName}"]`);
        if(linkToActivate) {
             linkToActivate.classList.add('netlearn-bg-primary', 'text-white');
        }
    }


    // =================================================================
    // LÓGICA DE AUTENTICACIÓN
    // =================================================================

    async function handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ username: email, password: password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.access_token);
                showNotification('Inicio de sesión exitoso.');
                authScreen.classList.add('hidden');
                appContainer.classList.remove('hidden');
                switchView('dashboard');
            } else {
                showNotification('Email o contraseña incorrectos.', true);
            }
        } catch (error) {
            console.error("Login error:", error);
            showNotification('Ocurrió un error al intentar iniciar sesión.', true);
        }
    }

    async function handleRegister(e) {
        e.preventDefault();
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                showNotification('Registro exitoso. Ahora puedes iniciar sesión.');
                switchAuthTab('login');
            } else {
                const errorData = await response.json();
                showNotification(`Error en el registro: ${errorData.detail}`, true);
            }
        } catch (error) {
            console.error("Register error:", error);
            showNotification('Ocurrió un error al intentar registrarse.', true);
        }
    }

    function handleLogout() {
        localStorage.removeItem('token');
        authScreen.classList.remove('hidden');
        appContainer.classList.add('hidden');
        showNotification('Has cerrado sesión.');
    }


    // =================================================================
    // INICIALIZACIÓN DE LA APLICACIÓN
    // =================================================================

    function initializeAppState() {
        const token = localStorage.getItem('token');
        if (token) {
            authScreen.classList.add('hidden');
            appContainer.classList.remove('hidden');
            switchView('dashboard');
        } else {
            authScreen.classList.remove('hidden');
            appContainer.classList.add('hidden');
        }
    }

    // Asignación de todos los Event Listeners
    if (loginTab) loginTab.addEventListener('click', () => switchAuthTab('login'));
    if (registerTab) registerTab.addEventListener('click', () => switchAuthTab('register'));
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    if (logoutButton) logoutButton.addEventListener('click', handleLogout);

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const view = link.getAttribute('data-view');
            if(view) switchView(view);
        });
    });
    
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const view = link.getAttribute('data-view');
            if(view) switchView(view);
        });
    });

    initializeAppState();
});
