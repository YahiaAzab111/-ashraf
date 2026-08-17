document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.getElementById('mobileToggle');
    const mainNav = document.getElementById('mainNav');
    const header = document.getElementById('header');

    const setMenuState = (isOpen) => {
        if (!mobileToggle || !mainNav) return;
        mainNav.classList.toggle('active', isOpen);
        mobileToggle.setAttribute('aria-expanded', String(isOpen));
        mobileToggle.setAttribute('aria-label', isOpen ? 'إغلاق قائمة التصفح' : 'فتح قائمة التصفح');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars', !isOpen);
            icon.classList.toggle('fa-xmark', isOpen);
        }
        document.body.classList.toggle('menu-open', isOpen);
    };

    if (mobileToggle && mainNav) {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.addEventListener('click', () => setMenuState(!mainNav.classList.contains('active')));
        mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenuState(false)));
        document.addEventListener('click', (event) => {
            if (mainNav.classList.contains('active') && !mainNav.contains(event.target) && !mobileToggle.contains(event.target)) setMenuState(false);
        });
        window.addEventListener('resize', () => { if (window.innerWidth > 900) setMenuState(false); });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && mainNav?.classList.contains('active')) {
            setMenuState(false);
            mobileToggle?.focus();
        }
    });

    const sections = document.querySelectorAll('section[id]');
    const updateHeaderAndActiveLink = () => {
        const scrollY = window.scrollY;
        if (header) header.style.boxShadow = scrollY > 50 ? '0 6px 20px rgba(15, 23, 42, 0.12)' : '0 2px 8px rgba(0, 0, 0, 0.05)';
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 110;
            const link = document.querySelector(`.main-nav a[href="#${section.id}"]`);
            if (link && scrollY >= sectionTop && scrollY < sectionTop + section.offsetHeight) {
                document.querySelectorAll('.main-nav a').forEach((item) => item.classList.remove('active'));
                link.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', updateHeaderAndActiveLink, { passive: true });
    updateHeaderAndActiveLink();

    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    filterBtns.forEach((button) => {
        button.addEventListener('click', () => {
            filterBtns.forEach((item) => item.classList.remove('active'));
            button.classList.add('active');
            const filterValue = button.dataset.filter;
            portfolioItems.forEach((item) => {
                const shouldShow = filterValue === 'all' || item.classList.contains(filterValue);
                item.style.display = shouldShow ? 'block' : 'none';
                item.style.opacity = shouldShow ? '1' : '0';
                item.style.transform = shouldShow ? 'scale(1)' : 'scale(.94)';
            });
        });
    });

    const lightboxModal = document.getElementById('lightboxModal');
    const modalBody = document.getElementById('modalBody');
    const modalCaption = document.getElementById('modalCaption');
    const modalClose = document.getElementById('modalClose');
    const closeModal = () => {
        if (!lightboxModal || !modalBody) return;
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
        const video = modalBody.querySelector('video');
        if (video) video.pause();
        window.setTimeout(() => { modalBody.innerHTML = ''; }, 300);
    };

    if (lightboxModal && modalBody && modalCaption) {
        portfolioItems.forEach((item) => {
            item.addEventListener('click', () => {
                modalBody.innerHTML = '';
                if (item.dataset.type === 'video') {
                    const video = document.createElement('video');
                    video.src = item.dataset.src;
                    video.controls = true;
                    video.autoplay = true;
                    video.playsInline = true;
                    modalBody.appendChild(video);
                } else {
                    const image = document.createElement('img');
                    image.src = item.dataset.src;
                    image.alt = item.dataset.caption || 'صورة من معرض الأعمال';
                    modalBody.appendChild(image);
                }
                modalCaption.textContent = item.dataset.caption || '';
                lightboxModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        modalClose?.addEventListener('click', closeModal);
        lightboxModal.addEventListener('click', (event) => { if (event.target === lightboxModal) closeModal(); });
        document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && lightboxModal.classList.contains('active')) closeModal(); });
    }
});
