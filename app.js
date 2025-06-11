document.addEventListener('DOMContentLoaded', function() {
  // Login/Register tabs functionality
  const loginTab = document.getElementById('login-tab');
  const registerTab = document.getElementById('register-tab');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  
  loginTab.addEventListener('click', function() {
    loginTab.classList.add('netlearn-border-primary', 'netlearn-text-primary');
    loginTab.classList.remove('border-transparent', 'text-gray-500');
    registerTab.classList.remove('netlearn-border-primary', 'netlearn-text-primary');
    registerTab.classList.add('border-transparent', 'text-gray-500');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  });
  
  registerTab.addEventListener('click', function() {
    registerTab.classList.add('netlearn-border-primary', 'netlearn-text-primary');
    registerTab.classList.remove('border-transparent', 'text-gray-500');
    loginTab.classList.remove('netlearn-border-primary', 'netlearn-text-primary');
    loginTab.classList.add('border-transparent', 'text-gray-500');
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
  });
  
  // Login/Register button functionality
  const loginButton = document.getElementById('login-button');
  const registerButton = document.getElementById('register-button');
  const authScreen = document.getElementById('auth-screen');
  const appContainer = document.getElementById('app-container');
  
  loginButton.addEventListener('click', function() {
    // Simulate login
    authScreen.classList.add('hidden');
    appContainer.classList.remove('hidden');
  });
  
  registerButton.addEventListener('click', function() {
    // Simulate registration
    authScreen.classList.add('hidden');
    appContainer.classList.remove('hidden');
  });
  
  // Logout button functionality
  const logoutButton = document.getElementById('logout-button');
  
  logoutButton.addEventListener('click', function() {
    appContainer.classList.add('hidden');
    authScreen.classList.remove('hidden');
  });
  
  // Navigation functionality
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-navbar a');
  const dashboardView = document.getElementById('dashboard-view');
  const learningPathView = document.getElementById('learning-path-view');
  const lessonView = document.getElementById('lesson-view');
  const profileView = document.getElementById('profile-view');
  const adminView = document.getElementById('admin-view');
  
  // Function to handle view switching
  function switchView(viewName) {
    // Hide all views
    dashboardView.classList.add('hidden');
    learningPathView.classList.add('hidden');
    lessonView.classList.add('hidden');
    profileView.classList.add('hidden');
    adminView.classList.add('hidden');
    
    // Remove active class from all links
    sidebarLinks.forEach(link => {
      link.classList.remove('netlearn-bg-primary', 'text-white');
      link.classList.add('hover:bg-gray-100', 'text-gray-700');
    });
    
    mobileNavLinks.forEach(link => {
      link.classList.remove('text-blue-600');
      link.classList.add('text-gray-500');
    });
    
    // Show selected view and activate corresponding link
    switch(viewName) {
      case 'dashboard':
        dashboardView.classList.remove('hidden');
        sidebarLinks[0].classList.add('netlearn-bg-primary', 'text-white');
        sidebarLinks[0].classList.remove('hover:bg-gray-100', 'text-gray-700');
        mobileNavLinks[0].classList.add('text-blue-600');
        mobileNavLinks[0].classList.remove('text-gray-500');
        break;
      case 'learning-path':
        learningPathView.classList.remove('hidden');
        sidebarLinks[1].classList.add('netlearn-bg-primary', 'text-white');
        sidebarLinks[1].classList.remove('hover:bg-gray-100', 'text-gray-700');
        mobileNavLinks[1].classList.add('text-blue-600');
        mobileNavLinks[1].classList.remove('text-gray-500');
        break;
      case 'lesson':
        lessonView.classList.remove('hidden');
        break;
      case 'profile':
        profileView.classList.remove('hidden');
        sidebarLinks[3].classList.add('netlearn-bg-primary', 'text-white');
        sidebarLinks[3].classList.remove('hover:bg-gray-100', 'text-gray-700');
        mobileNavLinks[3].classList.add('text-blue-600');
        mobileNavLinks[3].classList.remove('text-gray-500');
        break;
      case 'admin':
        adminView.classList.remove('hidden');
        sidebarLinks[4].classList.add('netlearn-bg-primary', 'text-white');
        sidebarLinks[4].classList.remove('hover:bg-gray-100', 'text-gray-700');
        break;
    }
  }
  
  // Add click events to sidebar links
  sidebarLinks[0].addEventListener('click', () => switchView('dashboard'));
  sidebarLinks[1].addEventListener('click', () => switchView('learning-path'));
  sidebarLinks[3].addEventListener('click', () => switchView('profile'));
  if (sidebarLinks[4]) {
    sidebarLinks[4].addEventListener('click', () => switchView('admin'));
  }
  
  // Add click events to mobile nav links
  mobileNavLinks[0].addEventListener('click', () => switchView('dashboard'));
  mobileNavLinks[1].addEventListener('click', () => switchView('learning-path'));
  mobileNavLinks[3].addEventListener('click', () => switchView('profile'));
  
  // Glossary terms functionality
  const glossaryTerms = document.querySelectorAll('.glossary-term');
  
  glossaryTerms.forEach(term => {
    term.addEventListener('click', function(e) {
      e.preventDefault();
      alert(term.getAttribute('title'));
    });
  });
  
  // Quiz options functionality
  const quizOptions = document.querySelectorAll('.quiz-option');
  
  quizOptions.forEach(option => {
    option.addEventListener('click', function() {
      const radioBtn = option.querySelector('input[type="radio"]');
      if (radioBtn) {
        radioBtn.checked = true;
      }
    });
  });
  
  // Offline support functionality
  const offlineNotification = document.getElementById('offline-notification');
  const syncNotification = document.getElementById('sync-notification');
  const downloadLessonBtn = document.getElementById('download-lesson-btn');
  
  // Check for online/offline status
  window.addEventListener('online', function() {
    offlineNotification.classList.add('hidden');
    syncNotification.classList.remove('hidden');
    
    // Simulate sync completion after 2 seconds
    setTimeout(function() {
      syncNotification.classList.add('hidden');
    }, 2000);
  });
  
  window.addEventListener('offline', function() {
    offlineNotification.classList.remove('hidden');
    syncNotification.classList.add('hidden');
  });
  
  // Download lesson for offline use
  if (downloadLessonBtn) {
    downloadLessonBtn.addEventListener('click', function() {
      // Simulate download process
      this.innerHTML = '<i class="fas fa-circle-notch fa-spin mr-2"></i> Descargando...';
      setTimeout(() => {
        this.innerHTML = '<i class="fas fa-check mr-2"></i> Guardado offline';
        setTimeout(() => {
          this.innerHTML = '<i class="fas fa-download mr-2"></i> Guardar offline';
        }, 2000);
      }, 1500);
    });
  }
  
  // AI content generation
  const generateAiContentBtn = document.getElementById('generate-ai-content-btn');
  const aiGenerationLoading = document.getElementById('ai-generation-loading');
  
  if (generateAiContentBtn) {
    generateAiContentBtn.addEventListener('click', function() {
      const contentType = document.getElementById('ai-generator-type').value;
      const prompt = document.getElementById('ai-generator-prompt').value;
      
      if (!prompt.trim()) {
        alert('Por favor, ingresa instrucciones para la generación de contenido.');
        return;
      }
      
      // Show loading indicator
      aiGenerationLoading.classList.remove('hidden');
      
      // Simulate API call based on content type
      setTimeout(function() {
        aiGenerationLoading.classList.add('hidden');
        
        if (contentType === 'diagram') {
          // Use DiagramGenerator Loop
          generateDiagram(prompt);
        } else if (contentType === 'lesson') {
          // Use MicroLessonGen Loop
          generateMicroLesson(prompt);
        } else {
          alert('Contenido generado exitosamente. Revisa la sección de contenido para editarlo.');
        }
      }, 3000);
    });
  }
  
  // AI recommendation loading
  const aiRecommendationLoading = document.getElementById('ai-recommendation-loading');
  const aiRecommendationContent = document.getElementById('ai-recommendation-content');
  
  // Function to generate diagram using MagicLoops
  async function generateDiagram(prompt) {
    try {
      const stylePreferences = {
        colorScheme: "tech-blue",
        resolution: "800x600"
      };
      
      const response = await fetch('https://magicloops.dev/api/loop/5f95701c-2206-4072-9dd2-64232a91427f/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // Added header
        },
        body: JSON.stringify({ prompt, stylePreferences }),
      });
      
      const responseJson = await response.json();
      
      if (responseJson.imageUrl) {
        alert(`Diagrama generado: ${responseJson.imageUrl}`);
      } else {
        alert('Error al generar el diagrama');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar el diagrama');
    }
  }
  
  // Function to generate micro lesson using MagicLoops
  async function generateMicroLesson(prompt) {
    try {
      // Using sample data structure required by the API
      const data = {
        userId: "admin123",
        moduleId: document.getElementById('ai-generator-module').value,
        performanceMetrics: {
          correctAnswers: 8,
          incorrectAnswers: 2,
          lastActivityTimestamp: Math.floor(Date.now() / 1000)
        }
      };
      
      // Changed API endpoint URL to match the example usage
      const response = await fetch('https://magicloops.dev/api/loop/f374cb1d-1ef0-45d6-9bff-19e2b50ab37f/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // Added header
        },
        body: JSON.stringify(data),
      });
      
      const responseJson = await response.json();
      
      if (responseJson.lessonContent) {
        alert('Lección generada exitosamente. Revisa la sección de contenido para editarla.');
      } else {
        alert('Error al generar la lección');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar la lección');
    }
  }
  
  // Study Reminder Notifier configuration
  function configureStudyReminder() {
    // Configure Study Reminder Notifier to trigger at 9:00 AM daily
    const reminderConfig = {
      triggerTime: "9am daily", // Set trigger time to 9:00 AM every day
      loopId: "study-reminder-notifier",
      enabled: true
    };
    
    console.log("Study reminder configured to run at 9:00 AM daily");
    return reminderConfig;
  }
  
  // Initialize study reminder when app loads
  const studyReminderSettings = configureStudyReminder();
});