/* =========================================================
   Teresa Luo — personal site
   Shared behaviour for every page (no dependencies).
   ========================================================= */
(function () {
    "use strict";

    /* ---------- Nav: active page, mobile menu, header border ---------- */
    var page = document.body.dataset.page;
    document.querySelectorAll("[data-nav]").forEach(function (a) {
        if (a.dataset.nav === page) a.classList.add("active");
    });

    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".site-nav");
    if (toggle && nav) {
        toggle.addEventListener("click", function () {
            var open = nav.classList.toggle("open");
            toggle.setAttribute("aria-expanded", String(open));
        });
    }

    /* ---------- Email: address is stored reversed in data-email so spam bots
       scanning the HTML don't find it; it's assembled here when the page loads ---------- */
    document.querySelectorAll("a[data-email]").forEach(function (a) {
        a.href = "mailto:" + a.dataset.email.split("").reverse().join("");
    });

    var header = document.querySelector(".site-header");
    function onPageScroll() {
        if (header) header.classList.toggle("scrolled", window.scrollY > 4);
    }
    window.addEventListener("scroll", onPageScroll, { passive: true });
    onPageScroll();

    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    /* ---------- Photo placeholders ----------
       Any <img data-ph="Label"> whose file is missing becomes a grey box
       showing the label and the path it expects. Drop a file at that
       path and refresh: the real photo shows up. */
    function toPlaceholder(img) {
        if (img.dataset.phDone) return;
        img.dataset.phDone = "1";
        var box = document.createElement("div");
        box.className = "ph";
        box.innerHTML = '<i class="fa-regular fa-image" aria-hidden="true"></i><span></span><code></code>';
        box.querySelector("span").textContent = img.dataset.ph || img.alt || "Photo";
        box.querySelector("code").textContent = img.getAttribute("src");
        img.replaceWith(box);
    }
    document.querySelectorAll("img[data-ph]").forEach(function (img) {
        if (img.complete && img.naturalWidth === 0) toPlaceholder(img);
        else img.addEventListener("error", function () { toPlaceholder(img); });
    });

    function arrowButton(cls, dir, label) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = cls + " " + dir;
        b.setAttribute("aria-label", label);
        b.innerHTML = '<i class="fa-solid fa-chevron-' + (dir === "prev" ? "left" : "right") + '" aria-hidden="true"></i>';
        return b;
    }

    /* ---------- Card carousels (Life page) ----------
       Markup: .carousel > .carousel-track > figure.slide (img + figcaption).
       Add as many slides as you like; arrows + counter appear automatically. */
    document.querySelectorAll(".carousel").forEach(function (carousel) {
        var track = carousel.querySelector(".carousel-track");
        var slides = track ? track.children : [];
        if (slides.length < 2) return;

        var prev = arrowButton("carousel-arrow", "prev", "Previous photo");
        var next = arrowButton("carousel-arrow", "next", "Next photo");
        var count = document.createElement("span");
        count.className = "carousel-count";
        carousel.append(prev, next, count);

        function index() { return Math.round(track.scrollLeft / track.clientWidth); }
        function update() {
            var i = index();
            count.textContent = (i + 1) + " / " + slides.length;
            prev.disabled = i <= 0;
            next.disabled = i >= slides.length - 1;
        }
        function go(step) {
            track.scrollTo({ left: (index() + step) * track.clientWidth, behavior: "smooth" });
        }
        prev.addEventListener("click", function () { go(-1); });
        next.addEventListener("click", function () { go(1); });
        track.addEventListener("scroll", function () { requestAnimationFrame(update); }, { passive: true });
        window.addEventListener("resize", update);
        update();
    });
})();
