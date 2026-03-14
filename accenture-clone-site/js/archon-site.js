(function ($) {
    "use strict";

    var localHrefMap = {
        "/us-en": "/index.html",
        "/us-en/": "/index.html",
        "/us-en/services": "/services.html",
        "/us-en/services/": "/services.html",
        "/us-en/insights": "/insights-index.html",
        "/us-en/insights/": "/insights-index.html",
        "/us-en/about/contact-us": "/contact-us.html",
        "/us-en/about/contact-us/": "/contact-us.html"
    };

    function disableCookieBanner() {
        var cookieSelectors = [
            "#onetrust-consent-sdk",
            "#onetrust-banner-sdk",
            "#onetrust-pc-sdk",
            ".onetrust-pc-dark-filter",
            ".optanon-alert-box-wrapper",
            ".onetrust-close-btn-handler",
            ".onetrust-pc-sdk"
        ];

        if (!document.getElementById("archon-cookie-banner-hide-style")) {
            $("head").append(
                "<style id=\"archon-cookie-banner-hide-style\">" +
                cookieSelectors.join(",") +
                "{display:none !important;visibility:hidden !important;opacity:0 !important;pointer-events:none !important;}" +
                "body{overflow:auto !important;}" +
                "</style>"
            );
        }

        cookieSelectors.forEach(function (selector) {
            $(selector).remove();
        });

        $("body").removeClass("onetrust-consent-sdk");
        $("html, body").css("overflow", "");
    }

    function normalizeKnownHref(href) {
        var normalized = href;

        if (/^https?:\/\//i.test(href)) {
            try {
                normalized = new URL(href, window.location.origin).pathname;
            } catch (error) {
                return null;
            }
        }

        return localHrefMap[normalized] || null;
    }

    function rewriteKnownLinks() {
        $("a[href]").each(function () {
            var link = $(this);
            var href = link.attr("href");
            var nextHref;

            if (!href) {
                return;
            }

            nextHref = normalizeKnownHref(href);
            if (nextHref) {
                link.attr("href", nextHref);
            }
        });
    }

    function applyArchonNavbarSimplification() {
        var navHrefMap = {
            "Home": "/index.html",
            "Services": "/services.html",
            "Insights": "/insights-index.html",
            "Contact": "/contact-us.html"
        };

        if (!document.getElementById("archon-navbar-quick-fix-style")) {
            $("head").append(
                "<style id=\"archon-navbar-quick-fix-style\">" +
                ".rad-global-nav__utility-nav,.rad-header__search,.rad-global-nav__language-container{display:none !important;}" +
                ".rad-global-nav__l1--button .rad-button__icon-right{display:none !important;}" +
                ".rad-global-nav__menu-item-content{display:none !important;}" +
                "@media (min-width: 1024px) {" +
                ".rad-global-nav__primary-nav{margin-left:auto !important;}" +
                ".rad-global-nav__menu-items{justify-content:flex-end !important;}" +
                "}" +
                "</style>"
            );
        }

        $(".rad-global-nav__menu-items > li").each(function () {
            var navItem = $(this);
            var button = navItem.children("button.rad-global-nav__l1--button");

            if (!button.length) {
                return;
            }

            var label = $.trim(button.find(".rad-button__text").text());
            var href = navHrefMap[label];

            if (!href) {
                return;
            }

            var link = $("<a>", {
                "class": button.attr("class") + " archon-nav-link",
                "href": href,
                "aria-label": label,
                "data-cmp-clickable": ""
            });

            link.append($("<div>", { "class": "rad-button__text", "text": label }));
            button.replaceWith(link);
            navItem.find(".rad-global-nav__menu-item-content").remove();
        });
    }

    function applyAccessibilityPolish() {
        $(".rad-card img").attr("alt", "");

        $(".rad-awards-card__rte a[target*='blank']").each(function () {
            var link = $(this);
            if (!link.attr("title")) {
                link.attr("title", "This opens a new tab.");
            }
        });
    }

    function handleHashScroll() {
        var href = window.location.href;
        if (href.indexOf("#") === -1) {
            return;
        }

        var targetHash = "#" + href.split("#")[1];
        var target = $(targetHash);
        var header = $(".cmp-global-header__navbar-container");

        if (!target.length) {
            return;
        }

        $("html, body").animate({
            scrollTop: target.offset().top - (header.height() || 0)
        }, 1000);
    }

    function initArchonSiteFixes() {
        disableCookieBanner();
        rewriteKnownLinks();
        applyArchonNavbarSimplification();
        applyAccessibilityPolish();
    }

    $(function () {
        initArchonSiteFixes();
    });

    $(window).on("load", handleHashScroll);
    window.addEventListener("radTransitionFinished", initArchonSiteFixes);

    new MutationObserver(function () {
        disableCookieBanner();
        rewriteKnownLinks();
    }).observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})(window.jQuery);
