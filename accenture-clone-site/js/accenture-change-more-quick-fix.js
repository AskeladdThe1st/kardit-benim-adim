// // Change more - Quick fix - 4/27/2023
var href_window = window.location.href;

function applyArchonNavbarSimplification() {
    var navHrefMap = {
        "Home": "index.html",
        "Services": "services.html",
        "Insights": "insights-index.html",
        "Contact": "contact-us.html"
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

    $(".rad-global-nav__menu-items > li").each(function() {
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

$(function() {
    // TileGrid - Rad Template - image alt for web acc
    $(".rad-card").each(function() {
        // var alt_title = $(this).find(".rad-card__title").text().trim();
        $(this).find("img").attr("alt", "");
    })
    // Rad Card - Global and Recognition Awards - External Links.
    $(".rad-awards-card__rte a").each(function(){
        var rad_card_a = $(this);
        if(rad_card_a.attr("target").indexOf("blank") > -1){
            if(rad_card_a.attr("title") == undefined || rad_card_a.attr("title") == "") {
                rad_card_a.attr("title", "This opens a new tab away from Accenture.com.");
            }
        }
    });

    applyArchonNavbarSimplification();
});

window.addEventListener("radTransitionFinished", applyArchonNavbarSimplification);
