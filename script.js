/* ==========================================================================
   CASTELO CONSIG — script.js
   Toda a lógica de interação, animação e segurança do front-end.

   CORREÇÃO DOS LINKS DE CONTATO (seções 2 e 3 e formulário):
   - PC: WhatsApp, Instagram e e-mail abrem em NOVA ABA (o site continua aberto).
   - Celular: os links abrem direto no aplicativo (link universal do
     WhatsApp/Instagram e mailto: para o app de e-mail).
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------
   * 1. CONFIGURAÇÃO
   * ------------------------------------------------------------------ */

  const CONFIG = Object.freeze({
    whatsappNumber: "5588988785553",
    instagramUser: "castelo_consig",
    contactEmail: "mcpromotora86@gmail.com",
    defaultWhatsappMessage:
      "Olá! Gostaria de saber mais sobre os serviços da Castelo Consig.",
    defaultEmailSubject: "Contato pelo site — Castelo Consig",
    defaultEmailBody: "Olá, Castelo Consig!\n\nGostaria de receber mais informações.",
  });


  /* ------------------------------------------------------------------
   * 2. HELPERS
   * ------------------------------------------------------------------ */

  function onlyDigits(str) {
    return String(str ?? "").replace(/\D+/g, "");
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) && value.length <= 254;
  }

  function debounce(fn, wait) {
    let timer;

    return function debounced(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, wait);
    };
  }

  function throttleRaf(fn) {
    let scheduled = false;

    return function throttled(...args) {
      if (scheduled) return;
      scheduled = true;

      requestAnimationFrame(() => {
        fn.apply(this, args);
        scheduled = false;
      });
    };
  }

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /**
   * Detecta celular/tablet. O iPadOS se identifica como "Macintosh",
   * por isso também checamos se o aparelho tem tela de toque.
   */
  function detectMobile() {
    const ua = navigator.userAgent || "";

    if (/Android|iPhone|iPad|iPod|Mobile|IEMobile|Opera Mini/i.test(ua)) {
      return true;
    }

    if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) {
      return true;
    }

    return false;
  }

  const IS_MOBILE = detectMobile();


  /* ------------------------------------------------------------------
   * 3. CONTATOS (WhatsApp / Instagram / E-mail)
   * ------------------------------------------------------------------ */

  function buildWhatsappUrl(message) {
    const digits = onlyDigits(CONFIG.whatsappNumber);
    const text = encodeURIComponent(message || CONFIG.defaultWhatsappMessage);

    // wa.me é o link universal: no celular abre o app do WhatsApp;
    // no PC abre a página do WhatsApp (app desktop ou WhatsApp Web).
    return `https://wa.me/${digits}?text=${text}`;
  }

  function buildInstagramUrl() {
    const user = String(CONFIG.instagramUser || "").replace(/[^a-zA-Z0-9._]/g, "");

    // Link universal: no celular abre o app do Instagram (se instalado);
    // no PC abre o perfil no navegador.
    return `https://www.instagram.com/${user}/`;
  }

  // mailto: — usado no celular (abre o app de e-mail).
  // ATENÇÃO: o endereço NÃO deve passar por encodeURIComponent,
  // senão o "@" vira "%40" e alguns aplicativos não reconhecem.
  function buildMailtoUrl(subject, body) {
    const params = [];

    if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
    if (body) params.push(`body=${encodeURIComponent(body)}`);

    return `mailto:${CONFIG.contactEmail}` + (params.length ? `?${params.join("&")}` : "");
  }

  // Tela de escrita do Gmail — usada no PC (abre em nova aba).
  // Se preferir que o PC use o programa de e-mail instalado,
  // troque por: return buildMailtoUrl(subject, body);
  function buildGmailComposeUrl(subject, body) {
    const params = new URLSearchParams({
      view: "cm",
      fs: "1",
      to: CONFIG.contactEmail,
      su: subject || "",
      body: body || "",
    });

    return `https://mail.google.com/mail/?${params.toString()}`;
  }

  function buildEmailUrl(subject, body) {
    return IS_MOBILE
      ? buildMailtoUrl(subject, body)
      : buildGmailComposeUrl(subject, body);
  }

  /**
   * Define href/target/rel de um link.
   * - PC: nova aba (o visitante não sai do site).
   * - Celular: mesma aba, para o sistema entregar o link ao aplicativo.
   */
  function setLink(link, url, openInNewTab) {
    link.setAttribute("href", url);

    if (openInNewTab) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    } else {
      link.removeAttribute("target");
      link.setAttribute("rel", "noopener noreferrer");
    }
  }

  function wireContactLinks() {
    const newTab = !IS_MOBILE;

    document.querySelectorAll(".js-whatsapp-link").forEach((link) => {
      setLink(link, buildWhatsappUrl(link.dataset.waMessage), newTab);
    });

    document.querySelectorAll(".js-instagram-link").forEach((link) => {
      setLink(link, buildInstagramUrl(), newTab);
    });

    document.querySelectorAll(".js-email-link").forEach((link) => {
      const subject = link.dataset.emailSubject || CONFIG.defaultEmailSubject;
      const body = link.dataset.emailBody || CONFIG.defaultEmailBody;

      setLink(link, buildEmailUrl(subject, body), newTab);
    });
  }


  /* ------------------------------------------------------------------
   * 4. HEADER
   * ------------------------------------------------------------------ */

  function initHeader() {
    const header = document.getElementById("header");
    const toggle = document.getElementById("navToggle");

    if (!header) return;

    const onScroll = throttleRaf(() => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (!toggle) return;

    toggle.addEventListener("click", () => {
      const isOpen = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    header.querySelectorAll(".nav__links a").forEach((link) => {
      link.addEventListener("click", () => {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }


  /* ------------------------------------------------------------------
   * 5. REVELAÇÃO AO ROLAR
   * ------------------------------------------------------------------ */

  function initScrollReveal() {
    const targets = document.querySelectorAll(
      ".reveal, .diff-card, .check-list li"
    );

    if (!targets.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach((element) => {
        element.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    targets.forEach((element) => {
      observer.observe(element);
    });
  }


  /* ------------------------------------------------------------------
   * 6. CONTADORES
   * ------------------------------------------------------------------ */

  function animateCount(element) {
    const target = parseFloat(element.dataset.count || "0");
    const decimals = parseInt(element.dataset.decimals || "0", 10);
    const suffix = element.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();

    if (prefersReducedMotion) {
      element.textContent = target.toFixed(decimals) + suffix;
      return;
    }

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;

      element.textContent = value.toFixed(decimals) + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  function initCounters() {
    const counters = document.querySelectorAll(".stat__num[data-count]");

    if (!counters.length) return;

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animateCount);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach((element) => {
      observer.observe(element);
    });
  }


  /* ------------------------------------------------------------------
   * 7. CARROSSEL DE DEPOIMENTOS
   * ------------------------------------------------------------------ */

  function initTestimonials() {
    const track = document.getElementById("testimonialsTrack");
    const prevBtn = document.getElementById("testimonialPrev");
    const nextBtn = document.getElementById("testimonialNext");

    if (!track || !prevBtn || !nextBtn) return;

    function cardStep() {
      const card = track.querySelector(".testimonial-card");

      if (!card) return 320;

      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.columnGap || style.gap || "24");

      return card.getBoundingClientRect().width + gap;
    }

    function scrollPrev() {
      track.scrollBy({
        left: -cardStep(),
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }

    function scrollNext() {
      const atEnd =
        track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;

      track.scrollBy({
        left: atEnd ? -track.scrollLeft : cardStep(),
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }

    prevBtn.addEventListener("click", scrollPrev);
    nextBtn.addEventListener("click", scrollNext);

    if (prefersReducedMotion) return;

    let autoplayId = null;
    let paused = false;

    function startAutoplay() {
      if (autoplayId || paused) return;
      autoplayId = window.setInterval(scrollNext, 5000);
    }

    function stopAutoplay() {
      if (autoplayId !== null) {
        window.clearInterval(autoplayId);
        autoplayId = null;
      }
    }

    track.addEventListener("mouseenter", () => {
      paused = true;
      stopAutoplay();
    });

    track.addEventListener("mouseleave", () => {
      paused = false;
      startAutoplay();
    });

    track.addEventListener("focusin", () => {
      paused = true;
      stopAutoplay();
    });

    track.addEventListener("focusout", (event) => {
      if (track.contains(event.relatedTarget)) return;
      paused = false;
      startAutoplay();
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });

    startAutoplay();
  }


  /* ------------------------------------------------------------------
   * 8. MENU FLUTUANTE DE CONTATO
   * ------------------------------------------------------------------ */

  function initFab() {
    const fab = document.getElementById("fabMenu");
    const toggle = document.getElementById("fabToggle");

    if (!fab || !toggle) return;

    function setOpen(open) {
      fab.classList.toggle("is-open", open);
      document.body.classList.toggle("fab-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute(
        "aria-label",
        open ? "Fechar opções de contato" : "Abrir opções de contato"
      );
    }

    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      setOpen(!fab.classList.contains("is-open"));
    });

    fab.querySelectorAll(".fab__option").forEach((link) => {
      link.addEventListener("click", () => {
        setOpen(false);
      });
    });

    document.addEventListener("click", (event) => {
      if (!fab.contains(event.target)) {
        setOpen(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    });
  }


  /* ------------------------------------------------------------------
   * 9. VOLTAR AO TOPO
   * ------------------------------------------------------------------ */

  function initToTop() {
    const btn = document.getElementById("toTopBtn");

    if (!btn) return;

    const onScroll = throttleRaf(() => {
      btn.classList.toggle("is-visible", window.scrollY > 700);
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    btn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  }


  /* ------------------------------------------------------------------
   * 10. FORMULÁRIO DE CONTATO
   * ------------------------------------------------------------------ */

  function initNewsletter() {
    const form = document.getElementById("newsletterForm");
    const emailInput = document.getElementById("newsletterEmail");
    const honeypot = document.getElementById("newsletterHoneypot");
    const msg = document.getElementById("newsletterMsg");

    if (!form || !emailInput || !msg) return;

    let lastSubmit = 0;

    const MIN_INTERVAL_MS = 5000;

    function setMessage(text, state) {
      msg.textContent = String(text ?? "");
      msg.dataset.state = state;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (honeypot && honeypot.value !== "") {
        setMessage("Não foi possível concluir a solicitação.", "error");
        return;
      }

      const now = Date.now();

      if (now - lastSubmit < MIN_INTERVAL_MS) {
        setMessage("Aguarde alguns segundos antes de tentar novamente.", "error");
        return;
      }

      const email = emailInput.value.trim();

      if (!isValidEmail(email)) {
        setMessage("Digite um e-mail válido.", "error");
        emailInput.focus();
        return;
      }

      lastSubmit = now;

      const subject = CONFIG.defaultEmailSubject;
      const body =
        `Olá, Castelo Consig!\n\nGostaria de receber informações. Meu e-mail é: ${email}`;

      if (IS_MOBILE) {
        // Celular: abre o aplicativo de e-mail.
        window.location.href = buildMailtoUrl(subject, body);
        setMessage("Seu aplicativo de e-mail será aberto para concluir o contato.", "ok");
      } else {
        // PC: abre a tela de escrita em uma nova aba (o site continua aberto).
        const win = window.open(buildGmailComposeUrl(subject, body), "_blank");

        if (win) {
          win.opener = null;
          setMessage("Abrimos uma nova aba para você concluir o envio do e-mail.", "ok");
        } else {
          // Pop-up bloqueado: tenta o programa de e-mail instalado.
          window.location.href = buildMailtoUrl(subject, body);
          setMessage("Seu programa de e-mail será aberto para concluir o contato.", "ok");
        }
      }

      form.reset();
    });
  }


  /* ------------------------------------------------------------------
   * 11. PARTÍCULAS / FAÍSCAS
   * ------------------------------------------------------------------ */

  function initSparks() {
    const canvas = document.getElementById("sparks-canvas");

    if (!canvas || prefersReducedMotion) {
      if (canvas) canvas.remove();
      return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let width;
    let height;
    let particles;
    let rafId = null;

    const DENSITY = 0.00006;
    const MAX_PARTICLES = 70;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function createParticle() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.6 + 0.4,
        vy: -(Math.random() * 0.25 + 0.05),
        vx: (Math.random() - 0.5) * 0.15,
        alpha: Math.random() * 0.5 + 0.15,
        twinkle: Math.random() * Math.PI * 2,
      };
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(
        MAX_PARTICLES,
        Math.max(18, Math.floor(width * height * DENSITY))
      );

      particles = Array.from({ length: count }, createParticle);
    }

    function step() {
      ctx.clearRect(0, 0, width, height);

      // Dourado da identidade Castelo Consig.
      ctx.fillStyle = "#d4af5a";

      for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.twinkle += 0.02;

        if (particle.y < -5) {
          particle.y = height + 5;
          particle.x = Math.random() * width;
        }

        if (particle.x < -5) {
          particle.x = width + 5;
        }

        if (particle.x > width + 5) {
          particle.x = -5;
        }

        ctx.globalAlpha =
          particle.alpha * (0.6 + 0.4 * Math.sin(particle.twinkle));

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(step);
    }

    function start() {
      if (!rafId) {
        rafId = requestAnimationFrame(step);
      }
    }

    function stop() {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    resize();
    start();

    window.addEventListener("resize", debounce(resize, 200));

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    });
  }


  /* ------------------------------------------------------------------
   * 12. ANO ATUAL
   * ------------------------------------------------------------------ */

  function initYear() {
    const element = document.getElementById("year");

    if (element) {
      element.textContent = String(new Date().getFullYear());
    }
  }


  /* ------------------------------------------------------------------
   * 13. SEGURANÇA DOS LINKS EXTERNOS
   * ------------------------------------------------------------------ */

  function hardenExternalLinks() {
    document.querySelectorAll('a[target="_blank"]').forEach((link) => {
      const rel = new Set(
        (link.getAttribute("rel") || "").split(/\s+/).filter(Boolean)
      );

      rel.add("noopener");
      rel.add("noreferrer");

      link.setAttribute("rel", Array.from(rel).join(" "));
    });
  }


  /* ------------------------------------------------------------------
   * INICIALIZAÇÃO
   * ------------------------------------------------------------------ */

  document.addEventListener("DOMContentLoaded", () => {
    wireContactLinks();
    initHeader();
    initScrollReveal();
    initCounters();
    initTestimonials();
    initFab();
    initToTop();
    initNewsletter();
    initSparks();
    initYear();
    hardenExternalLinks();
  });

})();