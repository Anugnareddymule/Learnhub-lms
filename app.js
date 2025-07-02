
    import { dynamodb } from './aws-config.js';

async function saveCourse(courseData) {
    const params = {
        TableName: "Courses",
        Item: courseData
    };
    await dynamodb.put(params).promise();
}    // Sample courses data
        let courses = [
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
            },
            {
                id: 4,
                title: "Python for Data Science",
                instructor: "Dr. Mike Chen",
                price: 99.99,
                duration: "10 weeks",
                description: "Master Python programming for data analysis and machine learning",
                category: "Programming",
                icon: "🐍"
            },
            {
                id: 5,
                title: "Photography Fundamentals",
                instructor: "Emma Wilson",
                price: 59.99,
                duration: "4 weeks",
                description: "Learn the basics of photography composition and lighting",
                category: "Photography",
                icon: "📸"
            },
            {
                id: 6,
                title: "Business Management Essentials",
                instructor: "Robert Davis",
                price: 79.99,
                duration: "8 weeks",
                description: "Develop leadership skills and business strategy knowledge",
                category: "Business",
                icon: "💼"
            }
        ];

        // Initialize the page
        document.addEventListener('DOMContentLoaded', function() {
            renderCourses();
            setupEventListeners();
            addSearchFunctionality();
            addCategoryFilter();
        });

        // Render courses
        function renderCourses() {
            const coursesGrid = document.getElementById('coursesGrid');
            coursesGrid.innerHTML = '';

            courses.forEach(course => {
                const courseCard = document.createElement('div');
                courseCard.className = 'course-card';
                courseCard.innerHTML = `
                    <div class="course-image">
                        ${course.icon}
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

        // Setup event listeners
        function setupEventListeners() {
            // Add course form
            document.getElementById('addCourseForm').addEventListener('submit', function(e) {
                e.preventDefault();
                const title = document.getElementById('courseTitle').value;
                const price = parseFloat(document.getElementById('coursePrice').value);
                const instructor = document.getElementById('courseInstructor').value;
                const duration = document.getElementById('courseDuration').value;
                const description = document.getElementById('courseDescription').value;
                const category = document.getElementById('courseCategory').value;
                
                if (title && price && instructor && duration && description && category) {
                    const newCourse = {
                        id: courses.length + 1,
                        title: title,
                        instructor: instructor,
                        price: price,
                        duration: duration,
                        description: description,
                        category: category,
                        icon: getCategoryIcon(category)
                    };
                    
                    courses.push(newCourse);
                    renderCourses();
                    document.getElementById('addCourseForm').reset();
                    hideAddCourseForm();
                    alert('Course added successfully!');
                } else {
                    alert('Please fill in all fields.');
                }
            });

            // Newsletter form
            document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
                e.preventDefault();
                const email = this.querySelector('input[type="email"]').value;
                if (email) {
                    alert('Thank you for subscribing to our newsletter!');
                    this.reset();
                } else {
                    alert('Please enter a valid email address.');
                }
            });

            // Login form
            document.getElementById('loginForm').addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                
                // Simple validation (in a real app, this would be server-side)
                if (email && password) {
                    alert('Login successful! Welcome back to LearnHub.');
                    closeModal('loginModal');
                } else {
                    alert('Please fill in all fields.');
                }
            });

            // Signup form
            document.getElementById('signupForm').addEventListener('submit', function(e) {
                e.preventDefault();
                const name = document.getElementById('signupName').value;
                const email = document.getElementById('signupEmail').value;
                const password = document.getElementById('signupPassword').value;
                const confirmPassword = document.getElementById('signupConfirmPassword').value;
                
                if (password !== confirmPassword) {
                    alert('Passwords do not match!');
                    return;
                }
                
                if (name && email && password) {
                    alert('Account created successfully! Welcome to LearnHub.');
                    closeModal('signupModal');
                } else {
                    alert('Please fill in all fields.');
                }
            });

            // Smooth scrolling for navigation links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
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
        }

        // Modal functions
        function openModal(modalId) {
            document.getElementById(modalId).style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        function switchModal(currentModal, targetModal) {
            closeModal(currentModal);
            openModal(targetModal);
        }

        // Course management functions
        function showAddCourseForm() {
            document.getElementById('courseManagement').style.display = 'block';
            document.getElementById('courseManagement').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }

        function hideAddCourseForm() {
            document.getElementById('courseManagement').style.display = 'none';
        }

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

        // Add search functionality
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
            
            // Search functionality
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
                        ${course.icon}
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

        // Add category filter functionality
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
    