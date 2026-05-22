// ========================
// 解码中国 - 主页面 JavaScript
// ========================

// 数字动画函数
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// 当页面加载完成时执行
document.addEventListener('DOMContentLoaded', function () {
    // 统计数字动画
    const statNumbers = document.querySelectorAll('.stat-number span[data-target]');
    if (statNumbers.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const targetValue = parseInt(element.getAttribute('data-target') || '0');
                    animateValue(element, 0, targetValue, 2000);
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => observer.observe(stat));
    }

    // 平滑滚动并更新活动状态
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    this.classList.add('active');
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // 滚动监测自动更新导航活动状态
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current) && current !== '') {
                link.classList.add('active');
            }
        });

        if (window.pageYOffset < 100 && document.querySelector('.nav-menu a[href="index.html"]')) {
            document.querySelector('.nav-menu a[href="index.html"]').classList.add('active');
        }
    });

    // 导航栏滚动效果
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Reveal 动画
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.classList.add('active');

                const staggeredChildren = el.querySelectorAll('.join-step, .value-card, .story-card');
                staggeredChildren.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('active');
                    }, index * 100);
                });

                revealObserver.unobserve(el);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // 背景鼠标交互
    const shapes = document.querySelectorAll('.bg-shape');
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth - 0.5) * 40;
        const y = (clientY / window.innerHeight - 0.5) * 40;

        shapes.forEach((shape, index) => {
            const factor = (index + 1) * 0.5;
            shape.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
        });
    });
});

// ========================
// 多语言切换逻辑 Language Switcher Logic
// ========================
function initLanguageSwitcher() {
    const langBtns = document.querySelectorAll('.lang-btn');
    const htmlElem = document.documentElement;
    
    function setLanguage(lang) {
        htmlElem.setAttribute('lang', lang);
        localStorage.setItem('preferred-lang', lang);
        
        langBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // 处理中英双语言版本的表单必填项和提交（避免隐藏的 input/select 阻碍表单验证）
        const zhInputs = document.querySelectorAll('.lang-zh[required], .lang-zh[name]');
        const enInputs = document.querySelectorAll('.lang-en[required], .lang-en[name]');
        
        if (lang === 'zh') {
            zhInputs.forEach(el => { el.disabled = false; });
            enInputs.forEach(el => { el.disabled = true; });
        } else {
            zhInputs.forEach(el => { el.disabled = true; });
            enInputs.forEach(el => { el.disabled = false; });
        }

        // 更新表单占位符 (如果存在)
        updatePlaceholders(lang);
    }

    function updatePlaceholders(lang) {
        const placeholders = {
            'zh': {
                'name': '请输入您的姓名',
                'email': 'email@example.com',
                'phone': '+1 (xxx) xxx-xxxx',
                'nationality': '您的国籍',
                'organization': '您的学校或公司',
                'referral': '请输入推荐码',
                'dietary': '饮食或特殊需求',
                'other_info': '您的留言...'
            },
            'en': {
                'name': 'Your full name',
                'email': 'email@example.com',
                'phone': '+1 (xxx) xxx-xxxx',
                'nationality': 'Your nationality',
                'organization': 'Your university or company',
                'referral': 'Enter code',
                'dietary': 'Dietary / Accessibility needs',
                'other_info': 'Your message...'
            }
        };

        const currentMap = placeholders[lang];
        if (currentMap) {
            for (const [id, text] of Object.entries(currentMap)) {
                const el = document.getElementById(id) || document.getElementsByName(id)[0];
                if (el) el.placeholder = text;
            }
        }
    }

    // 始终默认中文，除非用户之前在浏览器主动选择了别的语言
    const savedLang = localStorage.getItem('preferred-lang') || 'zh';
    setLanguage(savedLang);

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.dataset.lang);
        });
    });
}

// 在 DOMContentLoaded 中初始化
document.addEventListener('DOMContentLoaded', () => {
    initLanguageSwitcher();
    initApplicationForm();
});

// ========================
// 表单与 Airtable 提交逻辑
// ========================
function initApplicationForm() {
    const form = document.getElementById('application-form');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="lang-zh">提交中... / </span><span class="lang-en">Submitting...</span>';
        submitBtn.disabled = true;

        // 获取当前语言环境，用于判断提取哪一个必填项
        const lang = document.documentElement.lang || 'zh';

        // 提取输入信息
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const nationality = document.getElementById('nationality').value;
        const organization = document.getElementById('organization').value;
        const referral = document.getElementById('referral').value;
        const dietary = document.getElementById('dietary').value;
        const otherInfo = document.getElementById('other-info').value;

        // 处理隐藏与显示的双语选择框
        const role = lang === 'zh' 
            ? document.getElementById('role-zh').value 
            : document.getElementById('role-en').value;
        const hearAbout = lang === 'zh' 
            ? document.getElementById('hear-about-zh').value 
            : document.getElementById('hear-about-en').value;
        
        // 通过 Airtable Webhook 传输数据 (免疫所有前端跨域限制且不需要在此暴露私人 Token)
        const url = 'https://hooks.airtable.com/workflows/v1/genericWebhook/appLCEbSoEveIgOKa/wflDXDyj8ApAGEUxG/wtrYdNy3NbpxllSi3';

        // 扁平化数据结构给您的自动化工作流使用
        const data = {
            "Name": name,
            "Email": email,
            "Phone": phone,
            "Nationality": nationality,
            "Role": role,
            "Organization": organization,
            "Hear About": hearAbout,
            "Referral Code": referral,
            "Dietary Needs": dietary,
            "Other Info": otherInfo,
            "Language": lang === 'zh' ? 'Chinese' : 'English'
        };

        try {
            // no-cors 模式要求使用简单请求头，text/plain 可绕过预检同时 Airtable 仍可识别 JSON 主体
            await fetch(url, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: JSON.stringify(data)
            });

            // no-cors 模式下响应不可读，发送完成即无缝跳转到成功确认专属页面
            window.location.href = 'success.html';
        } catch (error) {
            console.error('Network Error:', error);
            alert('网络错误，提交失败，请重试！');
        } finally {
            // 恢复按钮状态
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}
