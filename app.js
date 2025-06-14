document.addEventListener('DOMContentLoaded', function() {
    // =================================================================
    // CONFIGURACIÓN Y SELECTORES DE ELEMENTOS
    // =================================================================
    const API_BASE_URL = 'http://localhost:8000';

    // Pantallas principales
    const authScreen = document.getElementById('auth-screen');
    const appContainer = document.getElementById('app-container');
    const notificationBanner = document.getElementById('notification-banner'); // Asumiendo que tienes un div para notificaciones

    // Elementos de autenticación
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginButton = document.getElementById('login-button');
    const registerButton = document.getElementById('register-button');
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

    /**
     * Muestra una notificación en la pantalla.
     * @param {string} message El mensaje a mostrar.
     * @param {boolean} isError Si es true, la notificación será de error (roja).
     */
    function showNotification(message, isError = false) {
        if (!notificationBanner) return; // Salir si no hay banner
        notificationBanner.textContent = message;
        notificationBanner.className = 'fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white z-50'; // Estilos base
        notificationBanner.classList.add(isError ? 'bg-red-500' : 'bg-green-500');
        notificationBanner.classList.remove('hidden');

        setTimeout(() => {
            notificationBanner.classList.add('hidden');
        }, 3000);
    }

    /**
     * Realiza una petición fetch con el token de autorización.
     * @param {string} url La URL del endpoint (sin el base).
     * @param {object} options Opciones para la petición fetch.
     */
    async function fetchWithAuth(url, options = {}) {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });

        if (response.status === 401) {
            // Token inválido o expirado, forzar logout
            handleLogout();
            throw new Error('Unauthorized');
        }

        return response;
    }


    // =================================================================
    // CARGA DE DATOS DESDE LA API (Instrucciones implementadas)
    // =================================================================

    /**
     * Carga los puntos del usuario y los muestra en la UI.
     */
    async function loadUserPoints() {
        try {
            const response = await fetchWithAuth('/gamification/points/me');
            if (!response.ok) throw new Error('Could not fetch points.');
            const data = await response.json();
            // Asume que tienes un elemento con id 'user-points' para mostrar los puntos
            const userPointsEl = document.getElementById('user-points');
            if (userPointsEl) userPointsEl.textContent = data.total;
        } catch (error) {
            console.error("Error loading points:", error);
            showNotification('No se pudieron cargar tus puntos.', true);
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

            // Asume que tienes un elemento con id 'courses-container'
            const coursesContainer = document.getElementById('courses-container');
            if (!coursesContainer) return;

            coursesContainer.innerHTML = ''; // Limpiar contenido anterior
            courses.forEach(course => {
                const courseElement = document.createElement('div');
                courseElement.className = 'bg-white p-4 rounded-lg shadow'; // Añade tus clases de Tailwind
                courseElement.innerHTML = `
                    <h3 class="font-bold">${course.title}</h3>
                    <p class="text-sm text-gray-600">${course.description}</p>
                `;
                coursesContainer.appendChild(courseElement);
            });
        } catch (error) {
            console.error("Error loading courses:", error);
            showNotification('No se pudieron cargar los cursos.', true);
        }
    }
    
    /**
     * Carga los datos del perfil del usuario.
     */
    async function loadUserProfile() {
        try {
            const response = await fetchWithAuth('/users/me');
            if (!response.ok) throw new Error('Could not fetch profile.');
            const user = await response.json();
            
            // Asume elementos para mostrar los datos del perfil
            const profileName = document.getElementById('profile-name');
            const profileEmail = document.getElementById('profile-email');
            if(profileName) profileName.textContent = user.email; // O user.full_name si lo tienes
            if(profileEmail) profileEmail.textContent = user.email;

        } catch (error) {
            console.error("Error loading profile:", error);
        }
    }


    // =================================================================
    // LÓGICA DE LA INTERFAZ DE USUARIO (UI)
    // =================================================================

    /**
     * Cambia entre la vista de Login y Registro.
     * @param {'login' | 'register'} target
     */
    function switchAuthTab(target) {
        const isLogin = target === 'login';
        loginTab.classList.toggle('netlearn-border-primary', isLogin);
        loginTab.classList.toggle('netlearn-text-primary', isLogin);
        registerTab.classList.toggle('netlearn-border-primary', !isLogin);
        registerTab.classList.toggle('netlearn-text-primary', !isLogin);
        loginForm.classList.toggle('hidden', !isLogin);
        registerForm.classList.toggle('hidden', isLogin);
    }

    /**
     * Cambia la vista principal de la aplicación.
     * @param {string} viewName El nombre de la vista a mostrar.
     */
    function switchView(viewName) {
        // Ocultar todas las vistas
        Object.values(views).forEach(view => view && view.classList.add('hidden'));

        // Resetear estilos de los links
        sidebarLinks.forEach(link => link.classList.remove('netlearn-bg-primary', 'text-white'));
        mobileNavLinks.forEach(link => link.classList.remove('text-blue-600'));

        // Mostrar la vista seleccionada y activar el link correspondiente
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
                    loadCourses();
                    break;
                case 'profile':
                    loadUserProfile();
                    break;
            }
        }

        // Activar el estilo del link (simplificado para mayor claridad)
        const linkIndex = ['dashboard', 'learning-path', 'profile', 'admin'].indexOf(viewName);
        if (linkIndex > -1 && sidebarLinks[linkIndex]) {
            sidebarLinks[linkIndex].classList.add('netlearn-bg-primary', 'text-white');
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
                initializeAppState(); // Inicializar la app
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
                switchAuthTab('login'); // Cambiar a la pestaña de login
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

    /**
     * Comprueba el estado de la app al cargar: si hay token, muestra la app; si no, la pantalla de auth.
     */
    function initializeAppState() {
        const token = localStorage.getItem('token');
        if (token) {
            authScreen.classList.add('hidden');
            appContainer.classList.remove('hidden');
            switchView('dashboard'); // Carga la vista por defecto
        } else {
            authScreen.classList.remove('hidden');
            appContainer.classList.add('hidden');
        }
    }

    // Asignación de todos los Event Listeners
    loginTab.addEventListener('click', () => switchAuthTab('login'));
    registerTab.addEventListener('click', () => switchAuthTab('register'));
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    logoutButton.addEventListener('click', handleLogout);

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


    // Ejecutar la inicialización al cargar la página
    initializeAppState();
});
