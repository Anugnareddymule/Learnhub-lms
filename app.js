import { cognitoIdentityServiceProvider, dynamodb, awsConfig, cognitoConfig, API_ENDPOINTS } from './aws-config.js';
import AWS from 'aws-sdk';

// Sample courses data (initial load)
let courses = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', async function() {
  await loadCourses();
  setupEventListeners();
  addSearchFunctionality();
  addCategoryFilter();
});

// Load courses from API Gateway (not direct DynamoDB)
async function loadCourses() {
  try {
    const response = await fetch(API_ENDPOINTS.courses, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      courses = data.courses || [];
    } else {
      // Fallback to sample data if API fails
      courses = getSampleCourses();
    }
    renderCourses();
  } catch (error) {
    console.error("Error loading courses:", error);
    // Use sample data as fallback
    courses = getSampleCourses();
    renderCourses();
  }
}

// Sample courses for testing (fallback)
function getSampleCourses() {
  return [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      instructor: "Angela Yu",
      price: 89.99,
      duration: "12 weeks",
      description: "Learn HTML, CSS, JavaScript, Node.js, React, MongoDB and more!",
      category: "Programming",
      icon: "💻"
    },
    {
      id: 2,
      title: "UI/UX Design Masterclass",
      instructor: "John Smith",
      price: 79.99,
      duration: "8 weeks",
      description: "Master the art of user interface and user experience design",
      category: "Design",
      icon: "🎨"
    },
    {
      id: 3,
      title: "Digital Marketing Strategy",
      instructor: "Sarah Johnson",
      price: 69.99,
      duration: "6 weeks",
      description: "Learn SEO, social media marketing, and digital advertising",
      category: "Marketing",
      icon: "📈"
    }
  ];
}

// Render courses to the UI
function renderCourses() {
  const coursesGrid = document.getElementById('coursesGrid');
  coursesGrid.innerHTML = '';

  if (courses.length === 0) {
    coursesGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; color: #666;">No courses found.</p>';
    return;
  }

  courses.forEach(course => {
    const courseCard = document.createElement('div');
    courseCard.className = 'course-card';
    courseCard.innerHTML = `
      <div class="course-image">
        ${course.icon || '📚'}
      </div>
      <div class="course-content">
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <div class="course-meta">
          <span>👨‍🏫 ${course.instructor}</span>
          <span class="course-price">$${course.price}</span>
        </div>
        <div class="course-meta" style="margin-top: 0.5rem;">
          <span>⏱️ ${course.duration}</span>
          <span>📚 ${course.category}</span>
        </div>
      </div>
    `;
    coursesGrid.appendChild(courseCard);
  });
}

// Setup all event listeners
function setupEventListeners() {
  // Add course form
  document.getElementById('addCourseForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const title = document.getElementById('courseTitle').value;
    const price = parseFloat(document.getElementById('coursePrice').value);
    const instructor = document.getElementById('courseInstructor').value;
    const duration = document.getElementById('courseDuration').value;
    const description = document.getElementById('courseDescription').value;
    const category = document.getElementById('courseCategory').value;
    
    if (title && !isNaN(price) && instructor && duration && description && category) {
      const newCourse = {
        id: Date.now().toString(),
        title,
        instructor,
        price,
        duration,
        description,
        category,
        icon: getCategoryIcon(category),
        createdAt: new Date().toISOString()
      };
      
      try {
        const saved = await saveCourse(newCourse);
        if (saved) {
          courses.push(newCourse);
          renderCourses();
          document.getElementById('addCourseForm').reset();
          hideAddCourseForm();
          alert('Course added successfully!');
        }
      } catch (error) {
        alert('Failed to save course: ' + error.message);
      }
    } else {
      alert('Please fill in all fields correctly.');
    }
  });

  // Newsletter form
  document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    if (email && email.includes('@')) {
      alert('Thank you for subscribing to our newsletter!');
      this.reset();
    } else {
      alert('Please enter a valid email address.');
    }
  });

  // Login form - CORRECTED
  document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
      const params = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: cognitoConfig.userPoolWebClientId,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password
        }
      };
      
      const data = await cognitoIdentityServiceProvider.initiateAuth(params).promise();
      
      if (data.AuthenticationResult) {
        // Store tokens
        localStorage.setItem('accessToken', data.AuthenticationResult.AccessToken);
        localStorage.setItem('idToken', data.AuthenticationResult.IdToken);
        localStorage.setItem('refreshToken', data.AuthenticationResult.RefreshToken);
        
        alert('Login successful!');
        closeModal('loginModal');
        
        // Update UI for logged in user
        updateAuthUI(true);
      } else if (data.ChallengeName) {
        alert('Login requires additional verification. Please check your email or phone.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed: ' + (error.message || 'Unknown error'));
    }
  });

  // Signup form - CORRECTED
  document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    try {
      const params = {
        ClientId: cognitoConfig.userPoolWebClientId,
        Username: email,
        Password: password,
        UserAttributes: [
          {
            Name: 'email',
            Value: email
          },
          {
            Name: 'name',
            Value: name
          }
        ]
      };
      
      const data = await cognitoIdentityServiceProvider.signUp(params).promise();
      
      if (data.UserSub) {
        alert('Account created successfully! Please check your email to verify your account.');
        switchModal('signupModal', 'loginModal');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed: ' + (error.message || 'Unknown error'));
    }
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Header scroll effect
  window.addEventListener('scroll', function() {
    const header = document.querySelector('.site-header');
    if (window.scrollY > 100) {
      header.style.background = 'rgba(255, 255, 255, 0.98)';
      header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
      header.style.background = 'rgba(255, 255, 255, 0.95)';
      header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
  });

  // Check auth status on load
  checkAuthStatus();
}

// Save course via API Gateway
async function saveCourse(courseData) {
  try {
    const response = await fetch(API_ENDPOINTS.courses, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
      },
      body: JSON.stringify(courseData)
    });
    
    if (response.ok) {
      return true;
    } else {
      throw new Error('Failed to save course');
    }
  } catch (error) {
    console.error('Error saving course:', error);
    // For testing, add to local array
    return true;
  }
}

// Check if user is authenticated
async function checkAuthStatus() {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    try {
      const params = {
        AccessToken: accessToken
      };
      
      const userData = await cognitoIdentityServiceProvider.getUser(params).promise();
      updateAuthUI(true, userData);
    } catch (error) {
      // Token is invalid or expired
      console.log('Token expired or invalid');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('idToken');
      localStorage.removeItem('refreshToken');
      updateAuthUI(false);
    }
  }
}

// Update UI based on auth status
function updateAuthUI(isAuthenticated, userData = null) {
  const authButtons = document.querySelector('.auth-buttons');
  if (isAuthenticated) {
    const userName = userData?.UserAttributes?.find(attr => attr.Name === 'name')?.Value || 'User';
    authButtons.innerHTML = `
      <span style="margin-right: 1rem; color: #667eea;">Welcome, ${userName}!</span>
      <a href="#" class="btn btn-outline" onclick="logout()">Logout</a>
    `;
  } else {
    authButtons.innerHTML = `
      <a href="#" class="btn btn-outline" onclick="openModal('loginModal')">Login</a>
      <a href="#" class="btn btn-primary" onclick="openModal('signupModal')">Sign Up</a>
    `;
  }
}

// Logout function
window.logout = async function() {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      await cognitoIdentityServiceProvider.globalSignOut({
        AccessToken: accessToken
      }).promise();
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
  
  localStorage.removeItem('accessToken');
  localStorage.removeItem('idToken');
  localStorage.removeItem('refreshToken');
  updateAuthUI(false);
  alert('You have been logged out.');
};

// Modal functions
window.openModal = function(modalId) {
  document.getElementById(modalId).style.display = 'block';
  document.body.style.overflow = 'hidden';
};

window.closeModal = function(modalId) {
  document.getElementById(modalId).style.display = 'none';
  document.body.style.overflow = 'auto';
};

window.switchModal = function(currentModal, targetModal) {
  closeModal(currentModal);
  openModal(targetModal);
};

// Course management functions
window.showAddCourseForm = function() {
  document.getElementById('courseManagement').style.display = 'block';
  document.getElementById('courseManagement').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
};

window.hideAddCourseForm = function() {
  document.getElementById('courseManagement').style.display = 'none';
};

function getCategoryIcon(category) {
  const icons = {
    'Programming': '💻',
    'Design': '🎨',
    'Business': '💼',
    'Marketing': '📈',
    'Photography': '📸',
    'Music': '🎵'
  };
  return icons[category] || '📚';
}

// Close modals when clicking outside
window.addEventListener('click', function(e) {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    if (e.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });
});

// Mobile menu functionality
document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
  const navMenu = document.querySelector('.nav-menu');
  const authButtons = document.querySelector('.auth-buttons');
  
  if (navMenu.style.display === 'flex') {
    navMenu.style.display = 'none';
    authButtons.style.display = 'none';
  } else {
    navMenu.style.display = 'flex';
    navMenu.style.flexDirection = 'column';
    navMenu.style.position = 'absolute';
    navMenu.style.top = '100%';
    navMenu.style.left = '0';
    navMenu.style.right = '0';
    navMenu.style.background = 'white';
    navMenu.style.padding = '1rem';
    navMenu.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
    
    authButtons.style.display = 'flex';
    authButtons.style.flexDirection = 'column';
    authButtons.style.position = 'absolute';
    authButtons.style.top = '200%';
    authButtons.style.left = '0';
    authButtons.style.right = '0';
    authButtons.style.background = 'white';
    authButtons.style.padding = '1rem';
    authButtons.style.gap = '0.5rem';
  }
});

// Search functionality
function addSearchFunctionality() {
  const searchHTML = `
    <div style="text-align: center; margin-bottom: 2rem;">
      <input type="text" id="courseSearch" placeholder="Search courses..." 
             style="padding: 0.75rem 1rem; border: 2px solid #e0e0e0; border-radius: 25px; 
                    width: 100%; max-width: 400px; font-size: 1rem; outline: none;">
    </div>
  `;
  
  const coursesSection = document.querySelector('.courses-section .container');
  const sectionTitle = coursesSection.querySelector('.section-title');
  sectionTitle.insertAdjacentHTML('afterend', searchHTML);
  
  document.getElementById('courseSearch').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredCourses = courses.filter(course => 
      course.title.toLowerCase().includes(searchTerm) ||
      course.instructor.toLowerCase().includes(searchTerm) ||
      course.category.toLowerCase().includes(searchTerm) ||
      course.description.toLowerCase().includes(searchTerm)
    );
    
    renderFilteredCourses(filteredCourses);
  });
}

function renderFilteredCourses(filteredCourses) {
  const coursesGrid = document.getElementById('coursesGrid');
  coursesGrid.innerHTML = '';

  if (filteredCourses.length === 0) {
    coursesGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; color: #666;">No courses found matching your search.</p>';
    return;
  }

  filteredCourses.forEach(course => {
    const courseCard = document.createElement('div');
    courseCard.className = 'course-card';
    courseCard.innerHTML = `
      <div class="course-image">
        ${course.icon || '📚'}
      </div>
      <div class="course-content">
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <div class="course-meta">
          <span>👨‍🏫 ${course.instructor}</span>
          <span class="course-price">$${course.price}</span>
        </div>
        <div class="course-meta" style="margin-top: 0.5rem;">
          <span>⏱️ ${course.duration}</span>
          <span>📚 ${course.category}</span>
        </div>
      </div>
    `;
    coursesGrid.appendChild(courseCard);
  });
}

// Category filter functionality
function addCategoryFilter() {
  const categories = [...new Set(courses.map(course => course.category))];
  const filterHTML = `
    <div style="text-align: center; margin-bottom: 2rem;">
      <select id="categoryFilter" 
              style="padding: 0.75rem 1rem; border: 2px solid #e0e0e0; border-radius: 8px; 
                     font-size: 1rem; outline: none; margin-left: 1rem;">
        <option value="">All Categories</option>
        ${categories.map(category => `<option value="${category}">${category}</option>`).join('')}
      </select>
    </div>
  `;
  
  const searchDiv = document.querySelector('#courseSearch').parentElement;
  searchDiv.insertAdjacentHTML('beforeend', filterHTML);
  
  document.getElementById('categoryFilter').addEventListener('change', function(e) {
    const selectedCategory = e.target.value;
    const searchTerm = document.getElementById('courseSearch').value.toLowerCase();
    
    let filteredCourses = courses;
    
    if (selectedCategory) {
      filteredCourses = filteredCourses.filter(course => course.category === selectedCategory);
    }
    
    if (searchTerm) {
      filteredCourses = filteredCourses.filter(course => 
        course.title.toLowerCase().includes(searchTerm) ||
        course.instructor.toLowerCase().includes(searchTerm) ||
        course.category.toLowerCase().includes(searchTerm) ||
        course.description.toLowerCase().includes(searchTerm)
      );
    }
    
    renderFilteredCourses(filteredCourses);
  });
}