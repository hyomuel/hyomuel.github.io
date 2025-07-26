// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 모바일 네비게이션 토글
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // 네비게이션 링크 클릭 시 모바일 메뉴 닫기
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // 스크롤 시 네비게이션 배경 변경
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.backdropFilter = 'blur(30px)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.8)';
            navbar.style.backdropFilter = 'blur(20px)';
        }
    });
    
    // 스무스 스크롤
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href) {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // 스크롤 애니메이션
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // 애니메이션 대상 요소들에 다양한 애니메이션 클래스 적용
    const animateElements = document.querySelectorAll('.section-header, .about-content, .tech-item, .work-item, .contact-item');
    animateElements.forEach((el, index) => {
        // 요소 타입에 따라 다른 애니메이션 적용
        if (el.classList.contains('section-header')) {
            el.classList.add('fade-in');
        } else if (el.classList.contains('about-content')) {
            el.classList.add('fade-in');
        } else if (el.classList.contains('tech-item')) {
            el.classList.add('scale-in');
        } else if (el.classList.contains('work-item')) {
            el.classList.add('scale-in');
        } else if (el.classList.contains('contact-item')) {
            el.classList.add('fade-in');
        } else {
            el.classList.add('fade-in');
        }
        
        // 지연 시간 추가로 자연스러운 순차 애니메이션
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
    
    // 통계 숫자 애니메이션
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    animateNumber(entry.target);
                }, 200);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
    
    // 3D 큐브와 파티클 패럴랙스 효과
    let ticking = false;
    
    function updateParallax() {
        const particles = document.querySelectorAll('.particle');
        const scrolled = window.pageYOffset;
        
        particles.forEach(particle => {
            const speed = particle.getAttribute('data-speed');
            if (speed) {
                const yPos = -(scrolled * speed / 30);
                particle.style.transform = `translateY(${yPos}px)`;
            }
        });
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
    
    // 마우스 움직임에 따른 큐브 반응 (부드럽게)
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    
    document.addEventListener('mousemove', function(e) {
        targetX = e.clientX / window.innerWidth;
        targetY = e.clientY / window.innerHeight;
    });
    
    function updateMouseEffect() {
        mouseX += (targetX - mouseX) * 0.1;
        mouseY += (targetY - mouseY) * 0.1;
        
        const cube = document.querySelector('.cube');
        if (cube) {
            const rotateX = (mouseY - 0.5) * 20;
            const rotateY = (mouseX - 0.5) * 20;
            cube.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }
        
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            const speed = (index + 1) * 0.15;
            const x = (mouseX - 0.5) * speed * 15;
            const y = (mouseY - 0.5) * speed * 15;
            
            let currentTransform = particle.style.transform || '';
            const baseTransform = currentTransform.replace(/translate\([^)]*\)/g, '');
            particle.style.transform = `${baseTransform} translate(${x}px, ${y}px)`;
        });
        
        requestAnimationFrame(updateMouseEffect);
    }
    
    updateMouseEffect();
    
    // 연락처 폼 제출
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 제출 버튼 비활성화 및 로딩 상태
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="btn-text">전송 중...</span><span class="btn-icon"><i class="fas fa-spinner fa-spin"></i></span>';
            submitBtn.disabled = true;
            
            // 폼 데이터 수집
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // 간단한 유효성 검사
            if (!data.name || !data.email || !data.message) {
                showNotification('모든 필드를 입력해주세요.', 'error');
                resetSubmitButton();
                return;
            }
            
            // 이메일 형식 검사
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('올바른 이메일 형식을 입력해주세요.', 'error');
                resetSubmitButton();
                return;
            }
            

            
            // Formspree를 통한 실제 이메일 전송
            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    showNotification('메시지가 성공적으로 전송되었습니다! 곧 답변드리겠습니다.', 'success');
                    this.reset();
                } else {
                    throw new Error('전송 실패');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('전송 중 오류가 발생했습니다. help@hyomuel.com으로 직접 이메일을 보내주세요.', 'error');
                
                // 이메일 클라이언트로 직접 전송하는 옵션 제공
                setTimeout(() => {
                    const mailtoLink = `mailto:help@hyomuel.com?subject=포트폴리오 문의 - ${data.name}&body=이름: ${data.name}%0D%0A이메일: ${data.email}%0D%0A%0D%0A메시지:%0D%0A${data.message}`;
                    if (confirm('폼 전송에 실패했습니다. 이메일 클라이언트로 직접 메시지를 보내시겠습니까?')) {
                        window.open(mailtoLink, '_blank');
                    }
                }, 2000);
            })
            .finally(() => {
                resetSubmitButton();
            });
            
            function resetSubmitButton() {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
        
        // 실시간 유효성 검사
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
    
    // 필드 유효성 검사 함수
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        
        clearFieldError(field);
        
        if (!value) {
            showFieldError(field, '이 필드는 필수입니다.');
            return false;
        }
        
        if (fieldName === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, '올바른 이메일 형식을 입력해주세요.');
                return false;
            }
        }
        

        
        return true;
    }
    
    // 필드 에러 표시
    function showFieldError(field, message) {
        field.style.borderColor = '#ef4444';
        field.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.2)';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            margin-left: 0.5rem;
        `;
        
        field.parentNode.appendChild(errorDiv);
    }
    
    // 필드 에러 제거
    function clearFieldError(field) {
        field.style.borderColor = '';
        field.style.boxShadow = '';
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    // 타이핑 애니메이션 (한 줄로 표시)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && heroTitle.textContent) {
        const originalText = heroTitle.textContent.trim();
        if (originalText) {
            heroTitle.innerHTML = '';
            
            // 타이핑 속도 변동
            const typeSpeed = {
                normal: 80,
                fast: 40,
                slow: 120
            };
            
            let i = 0;
            const typeWriter = () => {
                if (i < originalText.length) {
                    const char = originalText.charAt(i);
                    heroTitle.innerHTML += char;
                    i++;
                    
                    // 특수 문자나 공백에서는 속도 조절
                    let speed = typeSpeed.normal;
                    if (char === ' ' || char === ',') {
                        speed = typeSpeed.fast;
                    } else if (char === '.' || char === '!') {
                        speed = typeSpeed.slow;
                    }
                    
                    setTimeout(typeWriter, speed);
                }
            };
            
            // 페이지 로드 후 타이핑 시작
            setTimeout(typeWriter, 1500);
        }
    }
    
    // 프로젝트 카드 호버 효과 (부드럽게)
    const workItems = document.querySelectorAll('.work-item');
    workItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
            this.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
    });
    
    // 기술 아이템 호버 효과 (부드럽게)
    const techItems = document.querySelectorAll('.tech-item');
    techItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.1)';
            this.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
    });
    
    // 스크롤 진행률 표시
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #00d4ff, #7c3aed);
        z-index: 1001;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrolled + '%';
    });
    
    // 로딩 애니메이션
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
    
    // 배경 오브 애니메이션
    const orbs = document.querySelectorAll('.gradient-orb');
    orbs.forEach((orb, index) => {
        orb.addEventListener('mouseenter', function() {
            this.style.filter = 'blur(60px)';
            this.style.opacity = '0.5';
        });
        
        orb.addEventListener('mouseleave', function() {
            this.style.filter = 'blur(80px)';
            this.style.opacity = '0.3';
        });
    });
    
    // 버튼 호버 효과
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // 네비게이션 링크 활성 상태
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});

// 숫자 애니메이션 함수 (부드럽게)
function animateNumber(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2500; // 2.5초
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 이징 함수 적용 (부드러운 시작과 끝)
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(target * easeOutQuart);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// 알림 표시 함수
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 12px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    `;
    
    // 타입에 따른 스타일 설정
    if (type === 'success') {
        notification.style.background = 'rgba(16, 185, 129, 0.9)';
    } else if (type === 'error') {
        notification.style.background = 'rgba(239, 68, 68, 0.9)';
    } else {
        notification.style.background = 'rgba(0, 212, 255, 0.9)';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // 애니메이션 표시
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 자동 제거
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 커서 효과 제거됨

// 페이지 로드 완료 후 추가 애니메이션
window.addEventListener('load', function() {
    // 모든 이미지와 폰트가 로드된 후 실행
    setTimeout(() => {
        // 추가적인 초기화 애니메이션
        const elements = document.querySelectorAll('.fade-in, .scale-in');
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, index * 100);
        });
    }, 500);
});

// 스크롤 성능 최적화
let scrollTimeout;
window.addEventListener('scroll', function() {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    
    scrollTimeout = setTimeout(function() {
        // 스크롤이 멈춘 후 실행할 코드
    }, 100);
});

// 리사이즈 이벤트 최적화
let resizeTimeout;
window.addEventListener('resize', function() {
    if (resizeTimeout) {
        clearTimeout(resizeTimeout);
    }
    
    resizeTimeout = setTimeout(function() {
        // 리사이즈가 멈춘 후 실행할 코드
    }, 250);
}); 