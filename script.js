/* ==========================================================================
   CASTELO CONSIG — script.js
   Toda a lógica de interação, animação e segurança do front-end.
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
  });


  /* ------------------------------------------------------------------
   * 2. HELPERS
   * ------------------------------------------------------------------ */

  function sanitizeText(str) {
    const div = document.createElement("div");
    div.textContent = String(str ?? "");
    return div.textContent;
  }

  function onlyDigits(str) {
    return String(str ?? "").replace(/\D+/g, "");
  }

  function isValidEmail(value) {
    return (
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) &&
      value.length <= 254
    );
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


  /* ------------------------------------------------------------------
   * 3. CONTATOS
   * ------------------------------------------------------------------ */

  function buildWhatsappUrl(message) {
    const digits = onlyDigits(CONFIG.whatsappNumber);

    const safeMessage = encodeURIComponent(
      sanitizeText(
        message ||
          "Olá! Gostaria de saber mais sobre os serviços da Castelo Consig."
      )
    );

    return `https://wa.me/${digits}?text=${safeMessage}`;
  }

  function buildInstagramUrl() {
    const user = String(CONFIG.instagramUser || "")
      .replace(/[^a-zA-Z0-9._]/g, "");

    return `https://instagram.com/${user}`;
  }

  function buildEmailUrl() {
    return `mailto:${encodeURIComponent(CONFIG.contactEmail)}`;
  }

  function wireContactLinks() {

    document.querySelectorAll(".js-whatsapp-link").forEach((link) => {
      link.setAttribute(
        "href",
        buildWhatsappUrl(link.dataset.waMessage)
      );

      link.removeAttribute("target");
      link.setAttribute("rel", "noopener noreferrer");
    });


    document.querySelectorAll(".js-instagram-link").forEach((link) => {
      link.setAttribute(
        "href",
        buildInstagramUrl()
      );

      link.removeAttribute("target");
      link.setAttribute("rel", "noopener noreferrer");
    });


    document.querySelectorAll(".js-email-link").forEach((link) => {
      link.setAttribute(
        "href",
        buildEmailUrl()
      );

      link.removeAttribute("target");
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

      header.classList.toggle(
        "is-scrolled",
        window.scrollY > 12
      );

    });


    window.addEventListener(
      "scroll",
      onScroll,
      { passive: true }
    );

    onScroll();


    if (!toggle) return;


    toggle.addEventListener("click", () => {

      const isOpen =
        header.classList.toggle("nav-open");

      toggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

    });


    header
      .querySelectorAll(".nav__links a")
      .forEach((link) => {

        link.addEventListener("click", () => {

          header.classList.remove("nav-open");

          toggle.setAttribute(
            "aria-expanded",
            "false"
          );

        });

      });

  }


  /* ------------------------------------------------------------------
   * 5. REVELAÇÃO AO ROLAR
   * ------------------------------------------------------------------ */

  function initScrollReveal() {

    const targets =
      document.querySelectorAll(
        ".reveal, .diff-card, .check-list li"
      );

    if (!targets.length) return;


    if (
      prefersReducedMotion ||
      !("IntersectionObserver" in window)
    ) {

      targets.forEach((element) => {
        element.classList.add("is-visible");
      });

      return;
    }


    const observer =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            if (!entry.isIntersecting) return;

            entry.target.classList.add(
              "is-visible"
            );

            observer.unobserve(
              entry.target
            );

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

    const target =
      parseFloat(
        element.dataset.count || "0"
      );

    const decimals =
      parseInt(
        element.dataset.decimals || "0",
        10
      );

    const suffix =
      element.dataset.suffix || "";

    const duration = 1400;

    const start = performance.now();


    if (prefersReducedMotion) {

      element.textContent =
        target.toFixed(decimals) + suffix;

      return;
    }


    function tick(now) {

      const progress =
        Math.min(
          (now - start) / duration,
          1
        );

      const eased =
        1 - Math.pow(1 - progress, 3);

      const value =
        target * eased;


      element.textContent =
        value.toFixed(decimals) + suffix;


      if (progress < 1) {
        requestAnimationFrame(tick);
      }

    }


    requestAnimationFrame(tick);

  }


  function initCounters() {

    const counters =
      document.querySelectorAll(
        ".stat__num[data-count]"
      );

    if (!counters.length) return;


    if (!("IntersectionObserver" in window)) {

      counters.forEach(animateCount);

      return;
    }


    const observer =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            if (!entry.isIntersecting) return;

            animateCount(entry.target);

            observer.unobserve(
              entry.target
            );

          });

        },
        {
          threshold: 0.4,
        }
      );


    counters.forEach((element) => {
      observer.observe(element);
    });

  }


  /* ------------------------------------------------------------------
   * 7. CARROSSEL DE DEPOIMENTOS
   * ------------------------------------------------------------------ */

  function initTestimonials() {

    const track =
      document.getElementById(
        "testimonialsTrack"
      );

    const prevBtn =
      document.getElementById(
        "testimonialPrev"
      );

    const nextBtn =
      document.getElementById(
        "testimonialNext"
      );


    if (
      !track ||
      !prevBtn ||
      !nextBtn
    ) {
      return;
    }


    function cardStep() {

      const card =
        track.querySelector(
          ".testimonial-card"
        );

      if (!card) return 320;


      const style =
        window.getComputedStyle(track);

      const gap =
        parseFloat(
          style.columnGap ||
          style.gap ||
          "24"
        );


      return (
        card.getBoundingClientRect().width +
        gap
      );

    }


    function scrollPrev() {

      track.scrollBy({
        left: -cardStep(),
        behavior:
          prefersReducedMotion
            ? "auto"
            : "smooth",
      });

    }


    function scrollNext() {

      const atEnd =
        track.scrollLeft +
        track.clientWidth >=
        track.scrollWidth - 4;


      track.scrollBy({

        left:
          atEnd
            ? -track.scrollLeft
            : cardStep(),

        behavior:
          prefersReducedMotion
            ? "auto"
            : "smooth",

      });

    }


    prevBtn.addEventListener(
      "click",
      scrollPrev
    );

    nextBtn.addEventListener(
      "click",
      scrollNext
    );


    if (prefersReducedMotion) return;


    let autoplayId = null;
    let paused = false;


    function startAutoplay() {

      if (autoplayId || paused) return;

      autoplayId =
        window.setInterval(
          scrollNext,
          5000
        );

    }


    function stopAutoplay() {

      if (autoplayId !== null) {

        window.clearInterval(
          autoplayId
        );

        autoplayId = null;

      }

    }


    track.addEventListener(
      "mouseenter",
      () => {

        paused = true;
        stopAutoplay();

      }
    );


    track.addEventListener(
      "mouseleave",
      () => {

        paused = false;
        startAutoplay();

      }
    );


    track.addEventListener(
      "focusin",
      () => {

        paused = true;
        stopAutoplay();

      }
    );


    track.addEventListener(
      "focusout",
      (event) => {

        if (
          track.contains(
            event.relatedTarget
          )
        ) {
          return;
        }

        paused = false;
        startAutoplay();

      }
    );


    document.addEventListener(
      "visibilitychange",
      () => {

        if (document.hidden) {
          stopAutoplay();
        } else {
          startAutoplay();
        }

      }
    );


    startAutoplay();

  }


  /* ------------------------------------------------------------------
   * 8. MENU FLUTUANTE DE CONTATO
   * ------------------------------------------------------------------ */

  function initFab() {

    const fab =
      document.getElementById(
        "fabMenu"
      );

    const toggle =
      document.getElementById(
        "fabToggle"
      );


    if (!fab || !toggle) return;


    function setOpen(open) {

      fab.classList.toggle(
        "is-open",
        open
      );


      document.body.classList.toggle(
        "fab-open",
        open
      );


      toggle.setAttribute(
        "aria-expanded",
        String(open)
      );


      toggle.setAttribute(
        "aria-label",
        open
          ? "Fechar opções de contato"
          : "Abrir opções de contato"
      );

    }


    toggle.addEventListener(
      "click",
      (event) => {

        event.stopPropagation();

        setOpen(
          !fab.classList.contains(
            "is-open"
          )
        );

      }
    );


    fab
      .querySelectorAll(".fab__option")
      .forEach((link) => {

        link.addEventListener(
          "click",
          () => {
            setOpen(false);
          }
        );

      });


    document.addEventListener(
      "click",
      (event) => {

        if (!fab.contains(event.target)) {
          setOpen(false);
        }

      }
    );


    document.addEventListener(
      "keydown",
      (event) => {

        if (event.key === "Escape") {
          setOpen(false);
        }

      }
    );

  }


  /* ------------------------------------------------------------------
   * 9. VOLTAR AO TOPO
   * ------------------------------------------------------------------ */

  function initToTop() {

    const btn =
      document.getElementById(
        "toTopBtn"
      );


    if (!btn) return;


    const onScroll =
      throttleRaf(() => {

        btn.classList.toggle(
          "is-visible",
          window.scrollY > 700
        );

      });


    window.addEventListener(
      "scroll",
      onScroll,
      { passive: true }
    );


    onScroll();


    btn.addEventListener(
      "click",
      () => {

        window.scrollTo({

          top: 0,

          behavior:
            prefersReducedMotion
              ? "auto"
              : "smooth",

        });

      }
    );

  }


  /* ------------------------------------------------------------------
   * 10. FORMULÁRIO DE CONTATO
   * ------------------------------------------------------------------ */

  function initNewsletter() {

    const form =
      document.getElementById(
        "newsletterForm"
      );

    const emailInput =
      document.getElementById(
        "newsletterEmail"
      );

    const honeypot =
      document.getElementById(
        "newsletterHoneypot"
      );

    const msg =
      document.getElementById(
        "newsletterMsg"
      );


    if (
      !form ||
      !emailInput ||
      !msg
    ) {
      return;
    }


    let lastSubmit = 0;

    const MIN_INTERVAL_MS = 5000;


    function setMessage(
      text,
      state
    ) {

      msg.textContent =
        sanitizeText(text);

      msg.dataset.state =
        state;

    }


    form.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();


        if (
          honeypot &&
          honeypot.value !== ""
        ) {

          setMessage(
            "Não foi possível concluir a solicitação.",
            "error"
          );

          return;
        }


        const now =
          Date.now();


        if (
          now - lastSubmit <
          MIN_INTERVAL_MS
        ) {

          setMessage(
            "Aguarde alguns segundos antes de tentar novamente.",
            "error"
          );

          return;
        }


        const email =
          emailInput.value.trim();


        if (!isValidEmail(email)) {

          setMessage(
            "Digite um e-mail válido.",
            "error"
          );

          emailInput.focus();

          return;
        }


        lastSubmit = now;


        const subject =
          encodeURIComponent(
            "Contato pelo site — Castelo Consig"
          );


        const body =
          encodeURIComponent(
            `Olá, Castelo Consig!\n\nGostaria de receber informações. Meu e-mail é: ${email}`
          );


        window.location.href =
          `mailto:${encodeURIComponent(
            CONFIG.contactEmail
          )}?subject=${subject}&body=${body}`;


        setMessage(
          "Seu aplicativo de e-mail será aberto para concluir o contato.",
          "ok"
        );


        form.reset();

      }
    );

  }


  /* ------------------------------------------------------------------
   * 11. PARTÍCULAS / FAÍSCAS
   * ------------------------------------------------------------------ */

  function initSparks() {

    const canvas =
      document.getElementById(
        "sparks-canvas"
      );


    if (
      !canvas ||
      prefersReducedMotion
    ) {

      if (canvas) {
        canvas.remove();
      }

      return;
    }


    const ctx =
      canvas.getContext("2d");


    if (!ctx) return;


    let width;
    let height;
    let particles;
    let rafId = null;


    const DENSITY = 0.00006;
    const MAX_PARTICLES = 70;

    const dpr =
      Math.min(
        window.devicePixelRatio || 1,
        2
      );


    function resize() {

      width =
        window.innerWidth;

      height =
        window.innerHeight;


      canvas.width =
        Math.floor(
          width * dpr
        );


      canvas.height =
        Math.floor(
          height * dpr
        );


      canvas.style.width =
        `${width}px`;

      canvas.style.height =
        `${height}px`;


      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );


      const count =
        Math.min(
          MAX_PARTICLES,
          Math.max(
            18,
            Math.floor(
              width *
              height *
              DENSITY
            )
          )
        );


      particles =
        Array.from(
          {
            length: count,
          },
          createParticle
        );

    }


    function createParticle() {

      return {

        x:
          Math.random() *
          width,

        y:
          Math.random() *
          height,

        r:
          Math.random() *
          1.6 +
          0.4,

        vy:
          -(
            Math.random() *
              0.25 +
            0.05
          ),

        vx:
          (
            Math.random() -
            0.5
          ) *
          0.15,

        alpha:
          Math.random() *
            0.5 +
          0.15,

        twinkle:
          Math.random() *
          Math.PI *
          2,

      };

    }


    function step() {

      ctx.clearRect(
        0,
        0,
        width,
        height
      );


      /*
       * Dourado da identidade Castelo Consig.
       */
      ctx.fillStyle =
        "#d4af5a";


      for (const particle of particles) {

        particle.x +=
          particle.vx;

        particle.y +=
          particle.vy;

        particle.twinkle +=
          0.02;


        if (
          particle.y <
          -5
        ) {

          particle.y =
            height + 5;

          particle.x =
            Math.random() *
            width;

        }


        if (
          particle.x <
          -5
        ) {

          particle.x =
            width + 5;

        }


        if (
          particle.x >
          width + 5
        ) {

          particle.x =
            -5;

        }


        const alpha =
          particle.alpha *
          (
            0.6 +
            0.4 *
            Math.sin(
              particle.twinkle
            )
          );


        ctx.globalAlpha =
          alpha;


        ctx.beginPath();


        ctx.arc(
          particle.x,
          particle.y,
          particle.r,
          0,
          Math.PI * 2
        );


        ctx.fill();

      }


      ctx.globalAlpha = 1;


      rafId =
        requestAnimationFrame(
          step
        );

    }


    function start() {

      if (!rafId) {

        rafId =
          requestAnimationFrame(
            step
          );

      }

    }


    function stop() {

      if (rafId) {

        cancelAnimationFrame(
          rafId
        );

        rafId = null;

      }

    }


    resize();
    start();


    window.addEventListener(
      "resize",
      debounce(
        resize,
        200
      )
    );


    document.addEventListener(
      "visibilitychange",
      () => {

        if (document.hidden) {
          stop();
        } else {
          start();
        }

      }
    );

  }


  /* ------------------------------------------------------------------
   * 12. ANO ATUAL
   * ------------------------------------------------------------------ */

  function initYear() {

    const element =
      document.getElementById(
        "year"
      );


    if (element) {

      element.textContent =
        String(
          new Date().getFullYear()
        );

    }

  }


  /* ------------------------------------------------------------------
   * 13. SEGURANÇA DOS LINKS EXTERNOS
   * ------------------------------------------------------------------ */

  function hardenExternalLinks() {

    document
      .querySelectorAll(
        'a[target="_blank"]'
      )
      .forEach((link) => {

        const rel =
          new Set(
            (
              link.getAttribute(
                "rel"
              ) || ""
            )
              .split(/\s+/)
              .filter(Boolean)
          );


        rel.add("noopener");
        rel.add("noreferrer");


        link.setAttribute(
          "rel",
          Array.from(rel).join(" ")
        );

      });

  }


  /* ------------------------------------------------------------------
   * INICIALIZAÇÃO
   * ------------------------------------------------------------------ */

  document.addEventListener(
    "DOMContentLoaded",
    () => {

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

    }
  );

})();