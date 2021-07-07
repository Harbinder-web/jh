(function ($) {
  "use strict";
  $.fn.catanisSpinner = function () {
    $(document).on("click", ".add, .sub", function () {
      var el = $(this),
        $qty = el.closest(".spinner").find(".qty"),
        _max = $qty.attr("max") ? $qty.attr("max") : 20;
      if (el.is(".add")) {
        if ($qty.val() < parseInt(_max)) {
          $qty.val(function (i, oldval) {
            return ++oldval;
          });
          $qty.trigger("change");
        }
      } else {
        if ($qty.val() > parseInt($qty.attr("min"))) {
          $qty.val(function (i, oldval) {
            return --oldval;
          });
          $qty.trigger("change");
        }
      }
    });
  };
  $.fn.catanisImagesLoaded = function (func) {
    if ($.isFunction(func)) {
      var images = $(this).find("img"),
        loadedImages = 0,
        count = images.length;
      if (count > 0) {
        images
          .one("load", function () {
            loadedImages++;
            if (loadedImages === count) {
              func.call();
            }
          })
          .each(function () {
            if (this.complete) {
              jQuery(this).load();
            }
          });
      } else {
        func.call();
      }
    }
  };
  $.fn.catanisInputPlaceholder = function () {
    var $this = $(this),
      placeholder = $this.data("placeholder");
    if ($this.val() === "") {
      $this.val(placeholder);
    }
    if ($this.val() === placeholder) {
      $this.addClass("m-has-placeholder");
    }
    $this.focus(function () {
      if ($this.val() === placeholder) {
        $this.val("").removeClass("m-has-placeholder");
      }
    });
    $this.blur(function () {
      if ($this.val() === "") {
        $this.val(placeholder).addClass("m-has-placeholder");
      }
    });
  };
  (function ($, sr) {
    var debounce = function (func, threshold, execAsap) {
      var timeout;
      return function debounced() {
        var obj = this,
          args = arguments;
        function delayed() {
          if (!execAsap) func.apply(obj, args);
          timeout = null;
        }
        if (timeout) clearTimeout(timeout);
        else if (execAsap) func.apply(obj, args);
        timeout = setTimeout(delayed, threshold || 100);
      };
    };
    jQuery.fn[sr] = function (fn) {
      return fn ? this.on("resize", debounce(fn)) : this.trigger(sr);
    };
  })(jQuery, "smartresize");
  $.fn.catanisTabs = function (options) {
    var defaults = {
        tabSel: ".tabs li",
        paneSel: ".panes>div",
        currentClass: "current",
      },
      o = $.extend(defaults, options),
      $root = $(this),
      $tabs = $root.find(o.tabSel),
      $panes = $root.find(o.paneSel),
      current = 0;
    function init() {
      showSelected(0);
      $root.on("click", o.tabSel, function (e) {
        e.preventDefault();
        var index = $tabs.index($(this));
        if (index !== current) {
          hideTab(current);
          showSelected(index);
        }
      });
    }
    function showSelected(index) {
      $panes.eq(index).fadeIn();
      $tabs.eq(index).addClass(o.currentClass);
      current = index;
    }
    function hideTab(index) {
      $panes.eq(index).hide();
      $tabs.eq(index).removeClass(o.currentClass);
    }
    init();
  };
  $.fn.fadingTexts = function (elem) {
    var current_fading_no = 0;
    var count_fading_texts = 0;
    var current_fading_text = new Array();
    var $parent = elem.parent();
    init();
    function init() {
      elem.find("span").each(function (ind, val) {
        var current_fading_element = $(this);
        count_fading_texts++;
        current_fading_text[count_fading_texts] = current_fading_element.html();
      });
      elem.before('<p class="fading-texts-container"></p>');
      elem.hide();
      $parent.find(".fading-texts-container").css({ opacity: "0" });
      show_fading_texts();
    }
    function show_fading_texts() {
      current_fading_no++;
      if (current_fading_no > count_fading_texts) current_fading_no = 1;
      $parent
        .find(".fading-texts-container")
        .html(current_fading_text[current_fading_no])
        .animate({ opacity: 1.0 }, 500);
      setTimeout(function () {
        $parent
          .find(".fading-texts-container")
          .animate({ opacity: 0 }, 500, show_fading_texts);
      }, 3000);
    }
  };
  $.fn.panrEffect = function () {
    function init() {
      var el = jQuery(".cata-panr-elem");
      if (!el.length || typeof jQuery.fn.catanisPanr != "function") {
        return;
      } else {
        el.imagesLoaded(function () {
          el.each(function () {
            var $this = jQuery(this),
              sensitivityValue = $this.attr("data-sensitivity"),
              scaleValue = $this.attr("data-scale");
            if (
              typeof sensitivityValue === typeof undefined &&
              sensitivityValue === false
            ) {
              sensitivityValue = 12.6;
            }
            if (
              typeof scaleValue === typeof undefined &&
              scaleValue === false
            ) {
              scaleValue = 1.08;
            }
            $this.catanisPanr({
              sensitivity: sensitivityValue,
              scale: false,
              scaleOnHover: true,
              scaleTo: scaleValue,
              scaleDuration: 0.28,
              panY: true,
              panX: true,
              panDuration: 3,
              moveTarget: $this,
              resetPanOnMouseLeave: true,
            });
          });
        });
      }
    }
  };
  $.fn.catanisAccordion = function (options) {
    var defaults = {
        tabSel: ".accordion-title",
        paneSel: ".pane",
        currentClass: "current",
      },
      o = $.extend(defaults, options),
      $root = $(this),
      $tabs = $root.find(o.tabSel),
      $panes = $root.find(o.paneSel),
      allClosed = $root.hasClass("accordion-all-closed"),
      current = allClosed ? -1 : 0;
    function init() {
      $root.data("acc_init", "true");
      if (!allClosed) {
        showSelected(0);
      }
      $root.on("click", o.tabSel, function (e) {
        e.preventDefault();
        var index = $tabs.index($(this));
        if (index !== current) {
          hideTab(current);
          showSelected(index);
        } else {
          hideTab(current);
          current = -1;
        }
      });
    }
    function showSelected(index) {
      $tabs.eq(index).addClass(o.currentClass);
      $panes.eq(index).slideDown(300);
      current = index;
    }
    function hideTab(index) {
      $tabs.removeClass(o.currentClass);
      $panes.slideUp(300);
    }
    if (!$root.data("acc_init")) {
      init();
    }
  };
  $.fn.visible = function (partial) {
    var $t = $(this),
      $w = $(window),
      viewTop = $w.scrollTop(),
      viewBottom = viewTop + $w.height(),
      _top = $t.offset().top,
      _bottom = _top + $t.height(),
      compareTop = partial === true ? _bottom : _top,
      compareBottom = partial === true ? _top : _bottom;
    return compareBottom <= viewBottom && compareTop >= viewTop;
  };
  $.fn.hasAllClasses = function (classesString) {
    var i,
      classes = (classesString || "").match(/\S+/g) || [];
    for (i = 0; i < classes.length; i++) {
      if (!this.hasClass(classes[i])) {
        return false;
      }
    }
    return true;
  };
  $.fn.getBrowser = function () {
    var browser = {},
      ua,
      match,
      matched;
    if (CATANIS.browser) {
      return CATANIS.browser;
    }
    ua = navigator.userAgent.toLowerCase();
    match =
      /(chrome)[ \/]([\w.]+)/.exec(ua) ||
      /(webkit)[ \/]([\w.]+)/.exec(ua) ||
      /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
      /(msie) ([\w.]+)/.exec(ua) ||
      (ua.indexOf("compatible") < 0 &&
        /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)) ||
      [];
    matched = { browser: match[1] || "", version: match[2] || "0" };
    if (matched.browser) {
      browser[matched.browser] = true;
      browser.version = matched.version;
    }
    if (browser.chrome) {
      browser.webkit = true;
    } else if (browser.webkit) {
      browser.safari = true;
    }
    CATANIS.browser = browser;
    return browser;
  };
})(jQuery);
var CATACORE = CATACORE || {};
CATACORE.windowWidth = jQuery(window).width();
CATACORE.windowHeight = jQuery(window).height();
(function ($) {
  "use strict";
  CATACORE.documentReady = {
    init: function () {
      CATACORE.pageSettings.init();
      CATACORE.pageSettings.initAnimation(false);
      CATACORE.elements.init();
      if ($(".cata-page-title").length > 0) {
        CATACORE.featurePageSize.init(".cata-page-title");
      }
      var searchOuter = $("#search-outer");
      $(".header-search > .iconn").on("click", function () {
        searchOuter.stop(true).fadeIn(800, "easeOutExpo");
        searchOuter
          .find(" > div")
          .show()
          .end()
          .find(".search-input")
          .attr(
            "placeholder",
            searchOuter.find(".search-input").data("placeholder")
          )
          .focus();
        return false;
      });
      $("#search-outer #close > a").on("click", function () {
        searchOuter
          .find(" > div")
          .hide()
          .end()
          .find(".search-input")
          .attr("placeholder", "");
        searchOuter.stop(true).fadeOut(600, "easeOutExpo");
        return false;
      });
    },
  };
  CATACORE.documentLoad = {
    init: function () {
      CATACORE.isotope.init();
      CATACORE.stickySidebar.init();
      this.init_main();
      this.more_demo_aside();
      this.lazy_load_img();
      CATACORE.pageSettings.fullHeightRow();
      CATACORE.pageSettings.set_resize_content();
      new CATACORE.menuNav($("#catanis_menu")).init();
      $("p:empty").remove();
      $("#catanis-loader").delay(500).fadeOut("slow");
      $("input[type=number]").catanisSpinner();
      if (jQuery().tooltip) {
        $('[data-toggle="tooltip"]').tooltip({ html: true });
      }
      if ($.fn.YTPlayer) {
        jQuery("#comingsoon_fvideo").YTPlayer();
      }
      if ($.fn.lsvrInputPlaceholder) {
        $("*[data-placeholder]").each(function () {
          $(this).lsvrInputPlaceholder();
        });
      }
      var $css = $("#cata_inline_style");
      var $css_ouput = "<style>" + $css.text() + "</style>";
      $($css_ouput).insertAfter("#cata_inline_style");
      $css.remove();
      if (window.location.hash != "#!") {
        if ($(window.location.hash).length > 0) {
          $("nav.catanis-main-menu > ul > li").removeClass("active");
          $(
            "nav.catanis-main-menu > ul > li a[href='" +
              window.location.hash +
              "']"
          )
            .parent()
            .addClass("active");
          setTimeout(function () {
            $("html, body")
              .stop()
              .animate(
                { scrollTop: $(window.location.hash).offset().top - 80 },
                800,
                "swing",
                function () {
                  $("#cata-main-header").addClass("cata-onepage-nohide");
                }
              );
          }, 500);
        }
      }
      $(document).on("scroll", onScroll);
      $('a[href^="#"]').on("click", function (e) {
        e.preventDefault();
        $(document).off("scroll");
        var curhash = this.hash,
          target = e.target,
          $curhash = $(curhash),
          $target = $(target);
        if (
          $target.closest(".vc_tta").hasClass("cata-tta") ||
          $target.parent().hasClass("vc_carousel-control")
        ) {
          if ($target.closest(".vc_tta").hasClass("cata-tta")) {
            if ($(".cata-slick-slider").length > 0) {
              var tabId = curhash.substr(1);
              var elemSlick = $target
                .closest(".vc_tta")
                .find("#" + tabId + " .cata-slick-slider .slides");
              elemSlick.slick("unslick");
              setTimeout(function () {
                elemSlick.not(".slick-initialized").slick();
              }, 50);
            }
          }
          if (history.pushState) {
            setTimeout(function () {
              history.pushState(null, null, " ");
              return false;
            }, 0);
          }
          return;
        }
        if ($target.closest("ul").hasClass("cata-main-menu")) {
          $("nav.catanis-main-menu > ul > li").removeClass("active");
          $(this).parent().addClass("active");
        }
        if ($curhash.length) {
          $("html, body")
            .stop()
            .animate(
              { scrollTop: $curhash.offset().top - 80 },
              800,
              "swing",
              function () {
                if (history.pushState) {
                  history.pushState(null, null, curhash);
                } else {
                  location.hash = curhash;
                }
                $("#cata-main-header").addClass("cata-onepage-nohide");
                $(document).on("scroll", onScroll);
                return false;
              }
            );
        } else {
          if ($target.closest("ul").hasClass("cata-main-menu")) {
            var temp = CATANIS.home_url + this.hash;
            window.location.href = temp;
          }
        }
      });
      function onScroll(event) {
        var scrollPosition = $(document).scrollTop();
        scrollPosition += 100;
        $("nav.catanis-main-menu a").each(function () {
          var currentLink = $(this);
          if (
            currentLink.attr("href") &&
            currentLink.attr("href").match("^#")
          ) {
            var refElement = $(currentLink.attr("href"));
            if (refElement.length > 0) {
              if (scrollPosition <= 100) {
                $("nav.catanis-main-menu > ul > li").removeClass("active");
              }
              if (
                refElement.offset().top <= scrollPosition &&
                refElement.offset().top + refElement.height() > scrollPosition
              ) {
                $("nav.catanis-main-menu > ul > li").removeClass("active");
                currentLink.parent().addClass("active");
              } else {
              }
            }
          }
        });
      }
    },
    init_main: function () {
      var $selector;
      CATACORE.documentLoad.init_header();
      $selector = $(".cata-parallax-bg");
      if ($selector.length > 0) {
        $selector.each(function () {
          var prlx_speed = $(this).data("prlx-speed");
          if (typeof prlx_speed == "undefined") {
            prlx_speed = 1;
          }
          prlx_speed = parseFloat(prlx_speed);
          $(this).parallax(prlx_speed);
        });
      }
      $selector = $(".cata-parallax-bg22");
      if ($selector.length > 0) {
        $selector.each(function () {
          var prlx_section = $(this),
            prlx_speed = prlx_section.data("prlx-speed"),
            prlx_height = prlx_section.data("prlx-height");
          if (typeof prlx_speed == "undefined") {
            prlx_speed = 0.4;
          }
          if (typeof prlx_height == "undefined") {
            prlx_height = 0;
          }
          prlx_speed = parseFloat(prlx_speed);
          prlx_height = parseInt(prlx_height);
          if (prlx_height > 0) {
            prlx_section.css({
              "min-height": prlx_height + "px",
              height: prlx_height + "px",
            });
          }
          prlx_section.parallax("50%", prlx_speed);
        });
      }
      $selector = $(".cata-select2");
      if ($selector.length > 0) {
        $selector.each(function () {
          var elem = $(this);
          elem.select2({ minimumResultsForSearch: -1 });
        });
      }
    },
    init_header: function () {
      var main_header = $("#cata-main-header"),
        _header_height = CATACORE.pageSettings.get_header_height(),
        _topBegin = _header_height + 50,
        window_width = jQuery(window).width() + scrollBarWidth;
      var _topSpacing = CATACORE.pageSettings.check_admin_bar()
        ? jQuery("#wpadminbar").height()
        : 0;
      var header_fixed = CATANIS.header_fixed == 1 ? true : false;
      var header_mobile_fixed = CATANIS.header_mobile_fixed == 1 ? true : false;
      var main_header = $("#cata-main-header");
      if (
        (window_width > 768 && header_fixed) ||
        (window_width <= 768 && header_mobile_fixed)
      ) {
        main_header.sticky({
          topSpacing: _topSpacing,
          topBegin: _topBegin,
          scrollOnTop: function () {
            $(".cata-header").removeClass("fadeInDown");
          },
          scrollOnBottom: function () {
            if (!$("body").hasClass("menu-vertical")) {
              main_header.addClass("animated fadeInDown");
            }
          },
        });
        $("#cata-main-header-sticky-wrapper").height(_header_height);
      }
      $(window).smartresize(function () {
        main_header.removeClass("header-sticky-hide cata-onepage-nohide");
        if ($("#cata-main-header-sticky-wrapper").hasClass("is-sticky")) {
          if (
            CATACORE.pageSettings.check_admin_bar() &&
            $(window).width() > 600
          ) {
            _topSpacing = jQuery("#wpadminbar").height();
          } else {
            _topSpacing = 0;
          }
          main_header.css("top", _topSpacing);
        }
      });
      var last_scroll_top = 0;
      var extra_space = 600 + _topSpacing + _topBegin;
      if (jQuery("#cata-page-title").length > 0) {
        extra_space += jQuery("#cata-page-title").height();
      }
      $(window).on("scroll", function () {
        if (!(jQuery.browser.msie && jQuery.browser.version < 10)) {
          var scrollTop = jQuery(this).scrollTop();
          if ($("#cata-main-header-sticky-wrapper").hasClass("is-sticky")) {
            if (scrollTop > last_scroll_top && scrollTop > extra_space) {
              main_header.addClass("header-sticky-hide");
            } else {
              if (main_header.hasClass("header-sticky-hide")) {
                main_header.removeClass(
                  "header-sticky-hide cata-onepage-nohide"
                );
              }
              scrollTop += 5;
            }
            last_scroll_top = scrollTop;
          }
          var header_wrap = $(".cata-page-title");
          if (header_wrap.find(".page-header-wrap").data("parallax") == "1") {
            var calc = 0,
              offset = header_wrap.offset().top,
              height = header_wrap.outerHeight(),
              range = height / 2.5;
            offset = offset + height / 2.5;
            calc = 1 - (scrollTop - offset + range) / range;
            header_wrap
              .find(".pagetitle-contents-inner")
              .css({
                opacity: calc,
                transform: "translateY(" + scrollTop * -0.3 + "px)",
              });
            if (calc > "1" || scrollTop == "0") {
              header_wrap.find(".pagetitle-contents-inner").css({ opacity: 1 });
            } else if (calc < "0") {
              header_wrap.find(".pagetitle-contents-inner").css({ opacity: 0 });
            }
            var bgPos = header_wrap
              .find(".page-header-wrap")
              .data("bgPosition");
            var yPos = scrollTop / 10;
            if (bgPos == "center") {
              yPos = scrollTop / 10 + 50;
            } else if (bgPos == "bottom") {
              yPos = -(scrollTop / 10) + 100;
            }
            var coords = "50% " + yPos + "%";
            header_wrap
              .find(".page-header-wrap")
              .css({ backgroundPosition: coords });
          }
        }
      });
      $(".header-sidewidget > a").on("click", function (e) {
        e.preventDefault();
        $("#cata-template-wrapper")
          .stop(true)
          .transition({ x: "-300px" }, 700, "easeInOutCubic");
        $("#slide-out-widget-area")
          .stop(true)
          .transition({ x: "0" }, 700, "easeInOutCubic")
          .addClass("open");
        $("#slide-out-widget-area-bg")
          .css({ height: "100%", width: "100%" })
          .stop(true)
          .transition({ opacity: 1 }, 700, "easeInOutCubic", function () {});
      });
      $(".slide_out_area_close").on("click", function (e) {
        e.preventDefault();
        $("#cata-template-wrapper")
          .stop(true)
          .transition({ x: "0px" }, 700, "easeInOutCubic");
        $("#slide-out-widget-area")
          .stop(true)
          .transition({ x: "300px" }, 700, "easeInOutCubic")
          .removeClass("open");
        $("#slide-out-widget-area-bg")
          .stop(true)
          .transition({ opacity: 0 }, 700, "easeInOutCubic", function () {
            $(this).css({ height: "1px", width: "1px" });
            $("#cata-template-wrapper").removeAttr("style");
            $("#main-container-wrapper, #cata-main-header").css(
              "transform",
              "none"
            );
          });
      });
    },
    more_demo_aside: function () {
      $("body")
        .on("init", ".more_demo_aside .la-tabs-wrapper", function () {
          $(".more_demo_aside .la-tab").hide();
          var hash = window.location.hash;
          var url = window.location.href;
          var $tabs = $(this).find(".la-tabs").first();
          $tabs.find("li:first a").click();
        })
        .on("click", ".more_demo_aside .la-tabs li a", function (e) {
          e.preventDefault();
          var $tab = $(this);
          var $tabs_wrapper = $tab.closest(".la-tabs-wrapper");
          var $tabs = $tabs_wrapper.find(".la-tabs");
          $tabs.find("li").removeClass("active");
          $tabs_wrapper.find(".la-tab").hide();
          $tab.closest("li").addClass("active");
          $tabs_wrapper.find($tab.attr("href")).show();
        });
      $(".more_demo_aside .la-tabs-wrapper").trigger("init");
      $(document).on("click", ".more_demo_aside button", function (e) {
        $("body").toggleClass("open-aside-demo");
      });
    },
    lazy_load_img: function () {
      var elem = $("img.cata-lazy-load");
      var cnt = 1,
        itemAppeared = 1;
      elem.appear(function () {
        var $this = $(this),
          delay = 50 * cnt++;
        setTimeout(function () {
          itemAppeared++;
          if (itemAppeared == cnt) {
            cnt = 1;
          }
          if ($this.data("src")) {
            $this.attr("src", $this.data("src"));
          }
        }, delay);
      });
    },
  };
  CATACORE.documentResize = {
    init: function () {
      CATACORE.pageSettings.set_resize_content();
      CATACORE.pageSettings.fullHeightRow();
      if ($(".cata-page-title").length > 0) {
        CATACORE.featurePageSize.init(".cata-page-title");
      }
    },
  };
  CATACORE.documentScroll = { init: function () {} };
  (CATACORE.pageSettings = {
    init: function () {
      this.widget_init();
      this.social_share_links();
      this.RSVP_init();
      backToTop();
      sectionVideoBG();
      $(".cata-music-toggle-btn").on("click", function () {
        $(this).toggleClass("active");
        return false;
      });
      function backToTop() {
        var stag_offset = 700,
          $back_to_top = $(".cata-backtotop");
        $(window).scroll(function () {
          jQuery(document).scrollTop() > stag_offset
            ? $back_to_top.addClass("show")
            : $back_to_top.removeClass("show");
        });
        $back_to_top.on("click", function () {
          jQuery("html, body").animate({ scrollTop: 0 }, 700);
          return false;
        });
      }
      function sectionVideoBG() {
        if (typeof videojs == "function") {
          $(".cata-section-video-bg").each(function (index, element) {
            var idVid = $(element).attr("id");
            videojs("s" + idVid).ready(function () {
              var myPlayer = this;
              if ($("#" + idVid).hasClass("muted")) {
                myPlayer.volume(0);
              }
              if ($("#" + idVid).hasClass("autoplay")) {
                myPlayer.play();
              }
              var video_control = $("#" + idVid).find(".video-control");
              video_control.on("click", function (e) {
                if (myPlayer.paused()) {
                  $("#" + idVid)
                    .removeClass("pausing")
                    .addClass("playing");
                  myPlayer.play();
                } else {
                  $("#" + idVid)
                    .removeClass("playing")
                    .addClass("pausing");
                  myPlayer.pause();
                }
              });
            });
          });
        }
      }
    },
    fullHeightRow: function () {
      var $element = $(
        ".cata-section.row-full-height:first .cata-row, #cata-main-content .cata-container:first .cata-section.row-full-height .cata-row"
      );
      if ($element.length) {
        $element.css({ "padding-top": 0, "padding-bottom": 0 });
        var section = $element.closest(".cata-section"),
          sectionHeight = $element.outerHeight(),
          windowHeight = CATACORE.pageSettings.get_window_height(),
          headerHeight = CATACORE.pageSettings.get_header_height(),
          space = (windowHeight - sectionHeight) / 2;
        if (sectionHeight < windowHeight - 80) {
          $(
            "#main-container-wrapper .page-template #cata-main-content, #main-container-wrapper .page-template .cata-sidebar"
          ).css({ "padding-top": 0, "padding-bottom": 0 });
          if (!$("body").hasClass("header-overlap")) {
            $element.css({ "padding-top": space, "padding-bottom": space });
          } else {
            if (space > 0) {
              if (section.hasClass("row-columns-bottom")) {
                $element.css({
                  "padding-top": space * 2 - 50,
                  "padding-bottom": 30,
                });
              } else if (section.hasClass("row-columns-top")) {
                $element.css({
                  "padding-top": headerHeight + 30,
                  "padding-bottom": space * 2 - headerHeight - 30,
                });
              } else {
                $element.css({
                  "padding-top": space + headerHeight / 2,
                  "padding-bottom": space - headerHeight / 2,
                });
              }
            } else {
              $element.css({
                "padding-top": headerHeight,
                "padding-bottom": -headerHeight,
              });
            }
          }
        } else {
          $(
            "#main-container-wrapper .page-template #cata-main-content, #main-container-wrapper .page-template .cata-sidebar"
          ).css({ "padding-top": 0, "padding-bottom": 0 });
          if (!$("body").hasClass("header-overlap")) {
            $element.css({ "padding-top": 30, "padding-bottom": 30 });
          } else {
            $element.css({
              "padding-top": headerHeight + 30,
              "padding-bottom": 30,
            });
          }
        }
      }
    },
    set_resize_content: function () {
      var window_height = $(window).height();
      if (CATACORE.pageSettings.check_admin_bar()) {
        window_height =
          window_height - CATACORE.pageSettings.get_admin_bar_height();
      }
      if (!$("body").hasClass("header-overlap") || $(window).width() < 992) {
        window_height = window_height - 80;
      }
      if ($(".cata-footer").length) {
        window_height = window_height - $(".cata-footer").height();
      }
      var window_width = $(window).width();
      $(".row-fullscreen").css("min-height", window_height);
      $(".full-screen-width").css("min-width", window_width);
    },
    RSVP_init: function () {
      var contactForms = $(".wpcf7");
      if (contactForms.length > 0) {
        contactForms.each(function () {
          var form = $(this);
          var guests = form.find(".cata-guests-number");
          var attending = form.find(".cata-guests-attending");
          if (guests.length > 0) {
            guests.select2({
              placeholder: "Number Of Guests",
              minimumResultsForSearch: -1,
            });
          }
          if (attending.length > 0) {
            attending.select2({
              placeholder: "What Will You Be Attending",
              minimumResultsForSearch: -1,
            });
          }
        });
      }
    },
    random_string: function () {
      var chars =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
      var string_length = 8;
      var randomstring = "";
      for (var i = 0; i < string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum, rnum + 1);
      }
      return randomstring;
    },
    check_admin_bar: function () {
      return $("body").hasClass("logged-in") &&
        $("body").hasClass("admin-bar") &&
        $("#wpadminbar").length > 0
        ? true
        : false;
    },
    get_admin_bar_height: function () {
      return $("#wpadminbar").outerHeight();
    },
    get_header_height: function () {
      var height = 0;
      if (jQuery(".cata-header .header-top").length > 0) {
        height += jQuery(".cata-header .header-top").outerHeight();
      }
      if (jQuery(".cata-header .header-middle").length > 0) {
        height += jQuery(".cata-header .header-middle").outerHeight();
      }
      if (jQuery(".cata-header .header-bottom").length > 0) {
        height += jQuery(".cata-header .header-bottom").outerHeight();
      }
      return height;
    },
    get_window_height: function () {
      var height = 0;
      height = $(window).height();
      if (!$("body").hasClass("header-overlap")) {
        height = height - this.get_header_height();
      }
      if (this.check_admin_bar()) {
        height = height - $("#wpadminbar").outerHeight();
      }
      return height;
    },
    catanisParticlesJS: function () {
      particlesJS("particles-js", {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: "#ffffff" },
          shape: {
            type: "circle",
            stroke: { width: 0, color: "#000000" },
            polygon: { nb_sides: 5 },
            image: { src: "img/github.svg", width: 100, height: 100 },
          },
          opacity: {
            value: 0.5,
            random: false,
            anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false },
          },
          size: {
            value: 3,
            random: true,
            anim: { enable: false, speed: 40, size_min: 0.1, sync: false },
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.4,
            width: 1,
          },
          move: {
            enable: true,
            speed: 6,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: { enable: false, rotateX: 600, rotateY: 1200 },
          },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: true, mode: "repulse" },
            onclick: { enable: true, mode: "push" },
            resize: true,
          },
          modes: {
            grab: { distance: 400, line_linked: { opacity: 1 } },
            bubble: {
              distance: 400,
              size: 40,
              duration: 2,
              opacity: 8,
              speed: 3,
            },
            repulse: { distance: 200, duration: 0.4 },
            push: { particles_nb: 4 },
            remove: { particles_nb: 2 },
          },
        },
        retina_detect: true,
      });
    },
    widget_init: function () {
      var $selector = "";
      $(".cata-facebook-inner").css({
        width: $(".cata-facebook-outer").width(),
      });
      $selector = $(".widget-title-wrapper>.cata-toggle-control");
      if ($selector.length > 0) {
        widget_toggle_control();
        $(window).smartresize(function () {
          widget_toggle_control();
        });
        $selector.on("click", function (e) {
          e.preventDefault();
          $(this).parent().siblings().slideToggle(400);
          $(this).toggleClass("active");
        });
      }
      function widget_toggle_control() {
        var elempa = $(".sidebar-box .widget-title-wrapper");
        var elem = elempa.find(">.cata-toggle-control");
        var window_width = jQuery(window).width() + scrollBarWidth;
        if (window_width >= tabletPortrait && elempa.length > 0) {
          elem.removeClass("active").hide();
          elem.parent().siblings().show();
          elem
            .closest("aside.sidebar-box")
            .removeClass("cata-widget-responsive");
        } else {
          elem.removeClass("active").show();
          elem.parent().siblings().hide();
          elem.siblings().show();
          elem.closest("aside.sidebar-box").addClass("cata-widget-responsive");
        }
      }
      $selector = $(
        ".widget_pages, .widget_nav_menu, .widget_product_categories"
      );
      if ($selector.length > 0) {
        $selector.each(function (i, val) {
          var pa = $(val);
          pa.find("li:has(ul)")
            .on("click", function (e) {
              if (this == e.target) {
                $(this).toggleClass("expanded");
                $(this).children("ul").slideToggle("medium");
              }
              return false;
            })
            .addClass("collapsed")
            .children("ul")
            .hide();
          pa.find("li a").on("click", function (e) {
            e.stopPropagation();
          });
        });
      }
      $selector = $(".widget_meta");
      if ($selector.length > 0) {
        if (CATACORE.pageSettings.check_admin_bar()) {
          $selector.find("ul").addClass("meta-logged");
        }
      }
      $selector = $(".flickr-items");
      if ($selector.length > 0) {
        $selector.find("a").attr("target", "_blank");
      }
      var $selector = $(".cata-widget-tag-cloud .cata-widget-tag-cloud-wraper");
      if ($selector.length > 0) {
        $selector.each(function () {
          if (!$(this).hasClass("no_flash")) {
            var paID = $(this).attr("id"),
              paData = $(this).data(),
              myCanvas = jQuery("#" + paID).find("canvas");
            if (!myCanvas.tagcanvas(paData.params, "cata_tags")) {
              $(paID).hide();
            }
          }
        });
      }
      $selector = $(".cata-tab-post-widget-content");
      if ($selector.length > 0) {
        $selector.each(function (i, val) {
          var $this = jQuery(this);
          var widget_id = this.id;
          var args = $this.data("args");
          $this.find(".cata-tabs a").on("click", function (e) {
            e.preventDefault();
            jQuery(this)
              .parent()
              .addClass("selected")
              .siblings()
              .removeClass("selected");
            var tab_name = this.id.slice(0, -4);
            cata_load_tab_post_content(tab_name, 1, $this, args);
          });
          $this.find(".cata-tabs a").first().click();
        });
      }
      function cata_load_tab_post_content(
        tab_name,
        page_num,
        container,
        args_obj
      ) {
        var container = jQuery(container);
        var tab_content = container.find("#" + tab_name + "-tab-content");
        var isLoaded = tab_content.data("loaded");
        if (!isLoaded || page_num != 1) {
          if (!container.hasClass("cata-widget-loading")) {
            container.addClass("cata-widget-loading");
            tab_content
              .find(".tab-content-wrapper")
              .load(
                CATANIS.ajax_url,
                {
                  action: "cata_tab_post_widget_content",
                  tab: tab_name,
                  page: page_num,
                  args: args_obj,
                },
                function () {
                  container.removeClass("cata-widget-loading");
                  tab_content
                    .data("loaded", 1)
                    .hide()
                    .fadeIn()
                    .siblings()
                    .hide();
                }
              );
          }
        } else {
          tab_content.fadeIn().siblings().hide();
        }
      }
    },
    social_share_links: function () {
      $(".cata-social-share-facebook").on("click", function (e) {
        e.preventDefault();
        window.open(
          "//www.facebook.com/sharer/sharer.php?u=" + $(this).attr("href"),
          "facebookWindow",
          "height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0"
        );
        return false;
      });
      $(".cata-social-share-twitter").on("click", function (e) {
        e.preventDefault();
        window.open(
          "//twitter.com/intent/tweet?text=" +
            encodeURIComponent($(this).attr("title")) +
            " " +
            $(this).attr("href"),
          "twitterWindow",
          "height=450,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0"
        );
        return false;
      });
      $(".cata-social-share-linkedin").on("click", function (e) {
        e.preventDefault();
        window.open(
          "//www.linkedin.com/shareArticle?mini=true&url=" +
            $(this).attr("href") +
            "&title=" +
            encodeURIComponent($(this).attr("title")),
          "linkedinWindow",
          "height=500,width=820,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0"
        );
        return false;
      });
      $(".cata-social-share-googleplus").on("click", function (e) {
        e.preventDefault();
        window.open(
          "//plus.google.com/share?url=" + $(this).attr("href"),
          "googleplusWindow",
          "height=600,width=600,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0"
        );
        return false;
      });
      $(".cata-social-share-pinterest").on("click", function (e) {
        e.preventDefault();
        window.open(
          "//pinterest.com/pin/create/button/?url=" +
            $(this).attr("href") +
            "&media=" +
            $(this).data("pin-img") +
            "&description=" +
            encodeURIComponent($(this).attr("title")),
          "pinterestWindow",
          "height=600,width=800,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0"
        );
        return false;
      });
      $(".cata-social-share-reddit").on("click", function (e) {
        e.preventDefault();
        window.open(
          "//www.reddit.com/submit?url=" + $(this).attr("href"),
          "redditWindow",
          "height=600,width=820,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=1"
        );
        return false;
      });
      $(".cata-social-share-digg").on("click", function (e) {
        e.preventDefault();
        window.open(
          "//www.digg.com/submit?phase=2&amp;url=" + $(this).attr("href"),
          "diggWindow",
          "height=600,width=820,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=1"
        );
        return false;
      });
      $(".cata-social-share-stumbleUpon").on("click", function (e) {
        e.preventDefault();
        window.open(
          "//www.stumbleupon.com/submit?url=" + $(this).attr("href"),
          "stumbleUponWindow",
          "height=600,width=820,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=1"
        );
        return false;
      });
      $(".cata-social-share-delicious").on("click", function (e) {
        e.preventDefault();
        window.open(
          "//www.del.icio.us/post?url=" + $(this).attr("href"),
          "stumbleUponWindow",
          "height=600,width=820,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=1"
        );
        return false;
      });
      $("body").on("click", ".cata-love", function (e) {
        var loveLink = $(this),
          loveId = loveLink.attr("id"),
          icon = loveLink.find("i");
        if (loveLink.hasClass("loved")) return false;
        if (loveLink.hasClass("inactive")) return false;
        var dataToPass = { action: "cata-love", loves_id: loveId };
        $.post(CATANIS.ajax_url, dataToPass, function (data) {
          loveLink.find("span").html(data);
          loveLink.addClass("loved").attr("title", loveLink.data("loved"));
          loveLink.find("span").css({ opacity: 1, width: "auto" });
          icon.removeClass("fa-heart-o").addClass("fa-heart");
        });
        loveLink.addClass("inactive");
        return false;
      });
    },
    initAnimation: function (use_delay) {
      var $isotopItem = $(".cata-has-animation");
      if (!isMobile.any()) {
        var cnt = 1,
          itemAppeared = 1;
        $isotopItem.appear(function () {
          var $this = $(this),
            delay = 180 * cnt++;
          if (use_delay == true) {
            setTimeout(function () {
              itemAppeared++;
              if (itemAppeared == cnt) {
                cnt = 1;
              }
              $this.addClass("cata-animated");
            }, delay);
          } else {
            $this.addClass("cata-animated");
          }
        });
      } else {
        $isotopItem.addClass("cata-animated");
      }
    },
  }),
    (CATACORE.isotope = {
      init: function () {
        var $selector = $(".cata-portfolio, .cata-post");
        if (!$selector.length) return;
        $selector.each(function () {
          var $element = $(this);
          if (jQuery.fn.isotope && $element.hasClass("cata-isotope")) {
            CATACORE.isotope.settings($element);
          }
        });
        $(".cata-project-gallery").each(function () {
          var $element = $(this);
          portsingle_isotope($element);
        });
        function portsingle_isotope($element) {
          var $container = $element.find(".cata-gallery-imgs");
          $container.isotope({
            itemSelector: ".cata-img",
            transitionDuration: "0.65s",
            animationEngine: "jquery",
            filter: "*",
            layoutMode: "masonry",
          });
          $container.imagesLoaded("always", function () {
            $container.isotope("layout");
            setTimeout(function () {
              $container.isotope("layout");
            }, 1000);
          });
          $(window).smartresize(function () {
            setTimeout(function () {
              $container.isotope("layout");
            }, 1000);
          });
        }
      },
      settings: function ($element) {
        var windowWidth = $(window).width(),
          $container = $element.find(".cata-isotope-container"),
          $isotopItem = $container.find(".cata-isotope-item"),
          layout =
            $element.data("layout") != "" ? $element.data("layout") : "fitRows",
          isHorizontal = !isNaN($element.data("is-horizontal")) ? true : false,
          filterDef =
            $element.data("filterdef") != "" &&
            !isNaN($element.data("filterdef"))
              ? "." + $element.data("filterdef")
              : "*",
          dataSpinner = $element.data("spinner"),
          spacing =
            $element.hasClass("cata-with-spacing") &&
            !isNaN($element.data("spacing-size"))
              ? Math.abs($element.data("spacing-size")) / 2
              : 0;
        $isotopItem.filter(":even").addClass("item-even");
        $isotopItem.filter(":odd").addClass("item-odd");
        $isotopItem.css({
          "padding-left": spacing,
          "padding-right": spacing,
          "margin-bottom": spacing * 2,
        });
        if (spacing != 0) {
          $container.css({ "margin-left": -spacing, "margin-right": -spacing });
        }
        if (
          $element.hasClass("cata-with-spacing") &&
          $element.closest(".cata-section").hasClass("cata-fullwidth")
        ) {
          $element.css({
            "padding-left": spacing * 2 - 0.5,
            "padding-right": spacing * 2 - 0.5,
          });
        }
        if (
          $element.hasClass("cata-with-spacing") &&
          $element.closest(".container-fluid").length > 0
        ) {
          $element
            .closest(".container-fluid")
            .css({
              "padding-left": spacing * 2 - 0.5,
              "padding-right": spacing * 2 - 0.5,
            });
        }
        if (jQuery.fn.isotope && $element.hasClass("cata-isotope")) {
          isotopeSetup();
        }
        function isotopeSetup() {
          if (isHorizontal == true) {
            calcHeightHorizontal(false);
          } else {
            $container.isotope({
              itemSelector: ".cata-isotope-item",
              transitionDuration: "0.65s",
              animationEngine: "jquery",
              filter: filterDef,
              layoutMode: layout,
              masonry: { columnWidth: ".cata-isotope-grid-sizer" },
            });
          }
          if (layout == "packery") {
            masonryItemSize();
          }
          $container.imagesLoaded("always", function () {
            $container.isotope("layout");
            isotopeFilter();
            setTimeout(function () {
              $container.isotope("layout");
            }, 1000);
          });
          $(window).smartresize(function () {
            if (isHorizontal == true) {
              calcHeightHorizontal(true);
            } else {
              setTimeout(function () {
                $container.isotope("layout");
              }, 1000);
            }
            if (layout == "packery") {
              masonryItemSize();
            }
          });
        }
        function masonryItemSize() {
          var smallItem = $container.find(".cata-default-masonry-item").first(),
            standardHeight = smallItem.width(),
            wideTallHeight = standardHeight * 2 + spacing * 2;
          if (standardHeight > 0) {
            $container
              .find(".cata-default-masonry-item .cata-item-image")
              .css("height", standardHeight);
            $container
              .find(".cata-small-height-masonry-item .cata-item-image")
              .css("height", standardHeight - 30);
            $container
              .find(".cata-large-height-masonry-item .cata-item-image")
              .css("height", wideTallHeight);
            $container
              .find(".cata-large-width-masonry-item .cata-item-image")
              .css("height", standardHeight);
            $container
              .find(".cata-large-width-height-masonry-item .cata-item-image")
              .css("height", wideTallHeight);
          }
          $container.isotope("layout");
        }
        function isotopeFilter() {
          $element
            .find(".cata-isotope-filter li > a")
            .on("click", function (e) {
              $element.find(".cata-isotope-filter li").removeClass("selected");
              var selector = $(this).attr("data-filter");
              $container.isotope({ filter: selector });
              $(this).closest("li").addClass("selected");
            });
        }
        function calcHeightHorizontal(resize) {
          var window_height = $(window).height(),
            header_height =
              $("header").outerHeight() + $("#cata-page-title").outerHeight(),
            footer_height = $("footer").outerHeight(),
            item_info_height = $element.hasClass("cata-hover-style3")
              ? $isotopItem.find(".cata-item-info").outerHeight()
              : 0;
          var element_height = window_height - header_height - footer_height;
          element_height = element_height < 400 ? 400 : element_height;
          $element.css("height", element_height);
          if ($(window).width() + scrollBarWidth >= 768) {
            $isotopItem.css({
              height:
                $container.outerHeight(true) - spacing * 2 - item_info_height,
            });
            $isotopItem
              .find(".cata-item-image")
              .css("height", element_height - item_info_height - 30);
            if (resize) {
              $container.isotope("destroy");
            }
            $element.niceScroll({
              touchbehavior: true,
              cursoropacitymax: 1,
              cursorborderradius: "0",
              background: "#eee",
              cursorwidth: "5px",
              cursorborder: "0px",
              cursorcolor: "#e6b1b3",
              cursorminheight: 10,
              zindex: 999,
              autohidemode: false,
              bouncescroll: false,
              scrollspeed: 120,
              mousescrollstep: 90,
              grabcursorenabled: true,
              horizrailenabled: true,
              preservenativescrolling: true,
              cursordragontouch: true,
              enablemousewheel: true,
              railpadding: { top: 0, right: 0, left: 0, bottom: 0 },
            });
            $element
              .niceScroll()
              .scrollstart(function (info) {
                setTimeout(function () {
                  $container.isotope("layout");
                }, 500);
              })
              .scrollend(function (info) {
                setTimeout(function () {
                  $container.isotope("layout");
                }, 500);
              });
            $container.isotope({
              itemSelector: ".cata-isotope-item",
              transitionDuration: "0.65s",
              animationEngine: "jquery",
              layoutMode: "packery",
              packery: { isHorizontal: true },
              resizable: true,
            });
            setTimeout(function () {
              $container.isotope("layout");
            }, 1000);
          } else {
            $isotopItem.css({ height: "auto" });
            $isotopItem.find(".cata-item-image").css("height", "auto");
            if (resize) {
              $container.isotope("destroy");
            }
            $element.niceScroll({
              touchbehavior: true,
              cursoropacitymax: 1,
              cursorborderradius: "0",
              background: "#eee",
              cursorwidth: "5px",
              cursorborder: "0px",
              cursorcolor: "#e6b1b3",
              cursorminheight: 10,
              zindex: 999,
              autohidemode: false,
              bouncescroll: false,
              scrollspeed: 120,
              mousescrollstep: 90,
              grabcursorenabled: true,
              horizrailenabled: true,
              preservenativescrolling: true,
              cursordragontouch: true,
              enablemousewheel: true,
              railpadding: { top: 0, right: 0, left: 0, bottom: 0 },
            });
            $container.isotope({
              itemSelector: ".cata-isotope-item",
              transitionDuration: "0.65s",
              animationEngine: "jquery",
              layoutMode: "packery",
              packery: { isHorizontal: false },
              resizable: true,
            });
            $container.isotope("layout");
            setTimeout(function () {
              $container.isotope("layout");
            }, 500);
          }
        }
        var actionLoadmore = "",
          loadmoreButton = $element.find(".cata-btn-loadmore"),
          backtotop = loadmoreButton.parent().find(".cata-infload-to-top");
        loadmoreButton.on("click", isotopeLoadmore);
        backtotop.on("click", function () {
          jQuery("html, body").animate(
            { scrollTop: parseInt($element.offset().top - 120) },
            700
          );
          return false;
        });
        if ($element.hasClass("cata-portfolio")) {
          actionLoadmore = "cata_portfolio_loadmore_items";
        } else if ($element.hasClass("cata-post")) {
          actionLoadmore = "cata_posts_loadmore_items";
          if ($element.hasClass("cata-paging-infinite-scroll")) {
            $container.infinitescroll(
              {
                navSelector: ".cata-pagination",
                nextSelector: ".cata-pagination .next",
                itemSelector: ".cata-blog-item",
                bufferPx: 0,
                loading: {
                  msgText: $element.data("msgtext"),
                  finishedMsg: $element.data("finishedmsg"),
                  img: "http://i.imgur.com/lQV0wWe.gif",
                },
              },
              function (newElements) {
                if (jQuery.fn.isotope && $element.hasClass("cata-isotope")) {
                  $container.isotope("insert", $(newElements));
                  $element
                    .find(".cata-isotope-filter li.selected")
                    .trigger("click");
                  $isotopItem = $container.find(".cata-isotope-item");
                  $isotopItem.css({
                    "padding-left": spacing,
                    "padding-right": spacing,
                    "margin-bottom": spacing * 2,
                  });
                  setTimeout(function () {
                    $container.isotope("layout");
                    if (layout == "packery") {
                      masonryItemSize();
                    }
                  }, 200);
                } else {
                  $container.append($(newElements).hide().fadeIn(600));
                }
                CATACORE.pageSettings.initAnimation(false);
                CATACORE.elements.videojs();
                CATACORE.elements.audio();
                CATACORE.elements.catanis_slider();
                $isotopItem = $container.find(".cata-isotope-item");
                $isotopItem.filter(":even").addClass("item-even");
                $isotopItem.filter(":odd").addClass("item-odd");
              }
            );
          }
        }
        function isotopeLoadmore(e) {
          e.preventDefault();
          var $loadmoreButton = $(e.target),
            currentpage = loadmoreButton.parent().data("currentpage"),
            parentWrapper = loadmoreButton.parent();
          if ($loadmoreButton.hasClass("cata-loading")) {
            return false;
          }
          jQuery.ajax({
            type: "POST",
            timeout: 30000,
            url: CATANIS.ajax_url,
            data: {
              action: actionLoadmore,
              currentpage: currentpage,
              params: parentWrapper.data("params"),
            },
            beforeSend: function () {
              loadmoreButton.addClass("cata-loading");
            },
            complete: function () {
              loadmoreButton.removeClass("cata-loading");
              parentWrapper.data("currentpage", ++currentpage);
            },
            error: function (xhr, err) {
              loadmoreButton.removeClass("cata-loading");
            },
            success: function (response) {
              if (response != 0 && response != "") {
                if (
                  jQuery.fn.isotope &&
                  jQuery.fn.catanisImagesLoaded &&
                  $element.hasClass("cata-isotope")
                ) {
                  $container.isotope("insert", $(response)).isotope("layout");
                  $element
                    .find(".cata-isotope-filter li.selected")
                    .trigger("click");
                  $isotopItem = $container.find(".cata-isotope-item");
                  $isotopItem.css({
                    "padding-left": spacing,
                    "padding-right": spacing,
                    "margin-bottom": spacing * 2,
                  });
                  $container.isotope("layout");
                  setTimeout(function () {
                    $container.isotope("layout");
                    if (layout == "packery") {
                      masonryItemSize();
                    }
                  }, 500);
                  setTimeout(function () {
                    $container.isotope("layout");
                    if (layout == "packery") {
                      masonryItemSize();
                    }
                  }, 1000);
                } else {
                  $container.append(response);
                }
                CATACORE.pageSettings.initAnimation(false);
                CATACORE.elements.videojs();
                CATACORE.elements.videojs_popup();
                CATACORE.elements.audio();
                CATACORE.elements.catanis_slider();
                $isotopItem = $container.find(".cata-isotope-item");
                $isotopItem.filter(":even").addClass("item-even");
                $isotopItem.filter(":odd").addClass("item-odd");
              } else {
                parentWrapper.addClass("cata-all-items-loaded");
              }
            },
          });
          return false;
        }
      },
    });
  (CATACORE.stickySidebar = {
    init: function () {
      var $sidebar = $(".cata-sidebar-fixed");
      if ($sidebar.length > 0) {
        var $content = $("#cata-main-content .entry-content"),
          $sidebarWrapper = $sidebar.find(".cata-wrapper"),
          headerHeight =
            CATANIS.header_fixed == 1
              ? $("#cata-main-header").outerHeight()
              : 0,
          pagetitleHeight = $(".cata-page-title").length
            ? $(".cata-page-title").outerHeight()
            : 0,
          topOffset = headerHeight + pagetitleHeight,
          bottomOffset = 0;
        var windowWidth,
          sidebarWidth,
          sidebarHeight,
          contentPadding,
          sidebarTop,
          contentTop;
        var scrolling = false,
          sidebarAnimation = false,
          resizing = false;
        updateParams();
        if (windowWidth + scrollBarWidth >= tabletPortrait) {
          $(window).on("scroll", checkSidebar);
        }
        $(window).smartresize(resetScroll);
      }
      function checkSidebar() {
        if (!sidebarAnimation) {
          sidebarAnimation = true;
          updateSidebarPosition();
        }
      }
      function resetScroll() {
        if (!resizing) {
          bottomOffset = 0;
          resizing = true;
          $sidebarWrapper.removeClass("fixed").attr("style", "");
          updateParams();
        }
      }
      function updateParams() {
        windowWidth = $(window).width();
        sidebarWidth = $sidebar.width();
        sidebarHeight = $sidebar.height();
        contentPadding = parseInt($content.css("padding-top"));
        sidebarTop = $sidebar.offset().top;
        contentTop = $content.offset().top;
        bottomOffset += 50;
        if ($("body").hasClass("single-portfolio")) {
          if ($(".cata-related-portfolio").length) {
            bottomOffset += $(".cata-related-portfolio").outerHeight(true);
          }
          if ($(".cata-project-custom-content").length) {
            bottomOffset += $(".cata-project-custom-content").outerHeight(true);
          }
        }
        if ($("#comments").length) {
          bottomOffset += $("#comments").outerHeight(true);
        }
        $(window).off("scroll", checkSidebar);
        if (windowWidth + scrollBarWidth >= tabletPortrait) {
          checkSidebar();
          $(window).on("scroll", checkSidebar);
        }
        resizing = false;
      }
      function updateSidebarPosition() {
        var contentHeight = $content.height(),
          scrollTop = $(window).scrollTop();
        if (scrollTop < sidebarTop - topOffset + contentPadding) {
          $sidebarWrapper.removeClass("fixed").attr("style", "");
        } else if (
          scrollTop >= sidebarTop - topOffset + contentPadding &&
          scrollTop <
            sidebarTop +
              contentHeight -
              sidebarHeight -
              topOffset +
              contentPadding -
              bottomOffset
        ) {
          $sidebarWrapper
            .addClass("fixed")
            .css({ top: topOffset, position: "fixed", width: sidebarWidth });
        } else {
          if ($sidebarWrapper.hasClass("fixed")) {
            $sidebarWrapper
              .removeClass("fixed")
              .css({
                top:
                  contentHeight +
                  contentPadding -
                  sidebarHeight -
                  bottomOffset +
                  "px",
                position: "relative",
              });
          }
        }
        sidebarAnimation = false;
      }
    },
  }),
    (CATACORE.featurePageSize = {
      init: function (section) {
        this.$section = $(section);
        this.updateParams();
        var featureHeight;
        if (!this.$section.hasClass("cata-page-title-revslider")) {
          if (this.$section.hasClass("cata-fullscreen")) {
            featureHeight = this.fullscreenSize();
          } else if (this.$section.hasClass("cata-custom-size")) {
            featureHeight = this.customSize();
          }
        }
        CATACORE.resizeVideo.init(this.$section);
      },
      updateParams: function () {
        this.windowH = CATACORE.pageSettings.get_window_height();
        this.headerH = CATACORE.pageSettings.get_header_height();
      },
      fullscreenSize: function () {
        if (!this.$section.hasClass("cata-page-title-revslider")) {
          var sectionH = this.$section
            .css("height", this.windowH)
            .find(".page-header-wrap")
            .css("height", this.windowH);
          return sectionH;
        }
      },
      customSize: function () {
        var initHeight = this.$section.find(".page-header-wrap").data("height"),
          newHeight = (this.windowH * initHeight) / 100;
        if (newHeight > this.windowH) {
          newHeight = this.windowH;
        }
        this.$section
          .css("height", newHeight)
          .find(".page-header-wrap")
          .css("height", newHeight);
        return newHeight;
      },
    });
  CATACORE.resizeVideo = {
    init: function ($selector) {
      CATACORE.resizeVideo.videoSettings($selector);
      $(window).smartresize(function () {
        CATACORE.resizeVideo.videoSettings($selector);
      });
    },
    videoSettings: function ($selector) {
      var $video = $selector.find("video"),
        containerWidth = $selector.find("video").parent().outerWidth(),
        containerHeight = $selector.find("video").parent().outerHeight(),
        ratio = 16 / 9,
        videoHeight = containerHeight,
        videoWidth = containerHeight * ratio;
      if (videoWidth < containerWidth) {
        (videoWidth = containerWidth), (videoHeight = containerWidth * ratio);
      }
      $video.width(videoWidth).height(videoHeight);
    },
  };
  CATACORE.elements = {
    init: function () {
      this.slider_fullwidth();
      this.catanis_slider();
      this.center_slider();
      this.double_slider();
      this.countdown();
      this.milestone();
      this.autotyping();
      this.fading_texts();
      this.videojs();
      this.videojs_popup();
      this.google_maps();
      this.progressBars();
      this.elemWaypoint();
      this.message();
    },
    slider_fullwidth: function () {
      var $selector = $(".cata-slider-fwidth");
      if ($selector.length > 0) {
        $("html, body").animate({ scrollTop: 0 }, "fast");
        $selector.each(function (ind, val) {
          var elemID = jQuery("#" + $(val).attr("id"));
          var elemSlick = elemID.find(".slides");
          elemSlick.on("init", function (event, slick) {
            elemSlick.find(".slider-text").removeClass("cata-animated");
            $(slick.$slides.get(0))
              .find(".slider-text")
              .addClass("cata-animated");
          });
          elemSlick.slick();
          elemSlick.on(
            "afterChange",
            function (event, slick, currentSlide, nextSlide) {
              elemSlick.find(".slider-text").removeClass("cata-animated");
              $(slick.$slides.get(currentSlide))
                .find(".slider-text")
                .addClass("cata-animated");
            }
          );
          if (elemID.hasClass("slider-vertical")) {
            var mousewheelevt = /Firefox/i.test(navigator.userAgent)
              ? "DOMMouseScroll"
              : "mousewheel";
            elemSlick.on(mousewheelevt, function (e) {
              var ev = window.event || e;
              ev = ev.originalEvent ? ev.originalEvent : ev;
              var delta = ev.detail ? ev.detail * -1 : ev.wheelDelta;
              if (delta > 0) {
                if (
                  elemSlick
                    .find(".slick-slide.slick-active")
                    .prev(".slick-slide").length > 0
                ) {
                  ev.preventDefault();
                  $("html, body").animate({ scrollTop: 0 }, "fast");
                  elemSlick.slick("slickPrev");
                }
              } else {
                if (
                  elemSlick
                    .find(".slick-slide.slick-active")
                    .next(".slick-slide").length > 0
                ) {
                  ev.preventDefault();
                  $("html, body").animate({ scrollTop: 0 }, "fast");
                  elemSlick.slick("slickNext");
                }
              }
            });
          }
          $("body").keyup(function (e) {
            if (e.keyCode == 38 || e.keyCode == 37) {
              if (
                elemSlick.find(".slick-slide.slick-active").prev(".slick-slide")
                  .length > 0
              ) {
                e.preventDefault();
                $("html, body").animate({ scrollTop: 0 }, "fast");
                elemSlick.slick("slickPrev");
              }
            }
            if (e.keyCode == 40 || e.keyCode == 39) {
              if (
                elemSlick.find(".slick-slide.slick-active").next(".slick-slide")
                  .length > 0
              ) {
                e.preventDefault();
                $("html, body").animate({ scrollTop: 0 }, "fast");
                elemSlick.slick("slickNext");
              }
            }
          });
        });
      }
    },
    catanis_slider: function () {
      var $selector = $(".cata-slick-slider");
      if ($selector.length > 0) {
        $selector.each(function (ind, val) {
          var $elem = $(val);
          if (
            !$elem.hasClass("cata-center-slider") &&
            !$elem.hasClass("cata-columns-slider")
          ) {
            var $selectorID = jQuery("#" + $elem.attr("id"));
            var elemSlick = $selectorID.find(".slides");
            if (!elemSlick.hasClass("slick-initialized")) {
              elemSlick.slick();
            }
          }
        });
      }
    },
    center_slider: function () {
      var $selector = $(".cata-center-slider");
      if ($selector.length > 0) {
        $selector.each(function (ind, val) {
          var $selectorID = jQuery("#" + $(val).attr("id"));
          var elemSlick = $selectorID.find(".slides");
          elemSlick.slick();
          var currentSlide = elemSlick.slick("slickCurrentSlide");
          $(elemSlick.slick("getSlick").$slides.get(0))
            .find(".ctent-wrap > div")
            .delay(2000)
            .addClass("cata-animated");
          elemSlick.on(
            "afterChange",
            function (event, slick, currentSlide, nextSlide) {
              elemSlick.find(".ctent-wrap > div").removeClass("cata-animated");
              $(slick.$slides.get(currentSlide))
                .find(".ctent-wrap > div")
                .addClass("cata-animated");
            }
          );
        });
      }
    },
    double_slider: function () {
      var $selector = $(".cata-double-slider");
      if ($selector.length > 0) {
        $selector.each(function (ind, val) {
          var $selectorID = $(val).attr("id"),
            $selector2ID = jQuery("#s" + $(val).attr("id")),
            bg = $selector2ID.data("bg"),
            fg = $selector2ID.data("fg");
          if ($(window).width() <= 800) {
            bg[0] = rgba(bg[0]);
          }
          $("#" + $selectorID + " .double-slider-text-container").css(
            "background-color",
            bg[0]
          );
          $("#" + $selectorID + " .double-slider-image-container").flexslider({
            animation: "fade",
            slideshow: $selector2ID.data("autoplay"),
            slideshowSpeed: $selector2ID.data("duration"),
            animationSpeed: 600,
            touch: false,
          });
          $("#" + $selectorID + " .double-slider-text-container").flexslider({
            animation: "slide",
            slideshow: $selector2ID.data("autoplay"),
            slideshowSpeed: $selector2ID.data("duration"),
            animationSpeed: 600,
            useCSS: false,
            touch: false,
            before: function (slider) {
              if ($(window).width() <= 800) {
                bg[slider.animatingTo] = rgba(bg[slider.animatingTo]);
              }
              $("#" + $selectorID + " .double-slider-text-container").css(
                "background-color",
                bg[slider.animatingTo]
              );
              if (slider.hasClass("double-slider-text-container")) {
                var to =
                  slider.direction == "next" && slider.animatingTo == 0
                    ? slider.count
                    : slider.animatingTo;
                if (slider.currentSlide < to && slider.direction == "next") {
                  slider.slides
                    .eq(slider.currentSlide)
                    .find(".slider-subtitle,.slider-title,.slider-description")
                    .css("transform", "translateX(-200px)");
                } else {
                  slider.slides
                    .eq(slider.currentSlide)
                    .find(".slider-subtitle,.slider-title,.slider-description")
                    .css("transform", "translateX(200px)");
                }
                slider.find(".slides").delay(200);
              }
            },
            after: function (slider) {
              setTimeout(function () {
                slider.slides
                  .find(".slider-subtitle,.slider-title,.slider-description")
                  .css("transform", "");
              }, 100);
            },
          });
          $("#" + $selectorID + " .slider-prev").on("click", function (e) {
            e.preventDefault();
            $(this)
              .closest(".cata-double-slider")
              .find(".flex-direction-nav .flex-prev")
              .click();
            return false;
          });
          $("#" + $selectorID + " .slider-next").on("click", function (e) {
            e.preventDefault();
            $(this)
              .closest(".cata-double-slider")
              .find(".flex-direction-nav .flex-next")
              .click();
            return false;
          });
        });
      }
      function rgba(rgb) {
        if (rgb.indexOf("rgba") != -1) return rgb;
        if (rgb.indexOf("#") != -1) {
          var h = rgb.replace("#", "");
          h = h.match(new RegExp("(.{" + h.length / 3 + "})", "g"));
          for (var i = 0; i < h.length; i++)
            h[i] = parseInt(h[i].length == 1 ? h[i] + h[i] : h[i], 16);
          h.push(".8");
          return "rgba(" + h.join(",") + ")";
        }
        rgb = rgb.replace(")", ",.8)");
        rgb = rgb.replace("rgb", "rgba");
        return rgb;
      }
    },
    milestone: function () {
      var $selector = $(".cata-milestone");
      if ($.fn.waypoint && $.fn.countTo && $selector.length > 0) {
        $selector.waypoint(
          function () {
            var end_num = $(this).data("number");
            $(this)
              .find("p.number > span")
              .countTo({
                from: 0,
                to: end_num,
                speed: 1500,
                refreshInterval: 30,
              });
          },
          { offset: "105%" }
        );
      }
    },
    countdown: function () {
      var $selector = $(".cata-countdown");
      if ($selector.length > 0) {
        $selector.each(function (ind, val) {
          var dataObj = $(this).find(".cata-countdown-content").data(),
            _date = dataObj.date;
          var date_val = _date.split("/");
          $(this)
            .find(".cata-countdown-content")
            .countdown({
              until: new Date(
                date_val[0],
                date_val[1],
                date_val[2],
                date_val[3],
                date_val[4]
              ),
              labels: CATANIS.countdown_label,
              labels1: CATANIS.countdown_label1,
              padZeroes: true,
            });
        });
      }
    },
    autotyping: function () {
      var $selector = $(".cata-autotyping-text");
      if ($selector.length > 0) {
        $selector.each(function (ind, val) {
          $(this).find(".content-auto-typing").typed($(this).data("params"));
        });
      }
    },
    fading_texts: function () {
      var $selector = $(".cata-autofade-text");
      if ($selector.length > 0) {
        $selector.find(".fading-texts").each(function (ind, val) {
          $(this).fadingTexts($(this));
        });
      }
    },
    message: function () {
      var $selector = $(".cata-message.closemessage");
      if ($selector.length > 0) {
        $selector.find(".cclose").on("click", function (e) {
          $(this)
            .parent()
            .fadeOut(function () {});
        });
      }
    },
    progressBars: function () {
      var selector = ".cata-progress-bar";
      $(selector).each(function () {
        $(this).appear(function () {
          var parent = $(this).parent(".cata-progress-bars"),
            percentage = $(this).attr("data-value");
          $(this)
            .find(".cata-bar-line")
            .animate({ width: percentage + "%" }, 1600);
          if ($("body").hasClass("rtl")) {
            $(this)
              .find(".cata-percentage")
              .animate({ right: percentage + "%" }, 1600);
          } else {
            $(this)
              .find(".cata-percentage")
              .animate({ left: percentage + "%" }, 1600);
          }
        });
      });
    },
    audio: function () {
      $("video, audio").mediaelementplayer();
    },
    videojs: function () {
      var $selector = $(".cata-video");
      if ($selector.length > 0) {
        var video = $selector.find("video");
        if (video.length > 0) {
          video = video.attr("id");
          videojs(video, {}, function () {
            if ($selector.hasClass("cata-video-autoplay")) {
              this.play();
            }
            if ($selector.hasClass("cata-video-muted")) {
              this.muted(true);
            }
            if (
              typeof pause !== "undefined" &&
              $.isFunction(pause) &&
              !$selector.hasClass("video-host-vimeo")
            ) {
              this.on("ended", function () {
                this.pause();
              });
            }
          });
        }
      }
    },
    videojs_popup: function () {
      if (typeof videojs == "function") {
        var $selector = $(".cata-video-popup-style");
        if ($selector.length > 0) {
          $selector.each(function (index, element) {
            var elemID = $(element).data("id");
            var selector = $("#" + elemID);
            var $video = $(
              '<video id="s' +
                elemID +
                '" name="s1' +
                elemID +
                '" class="video-js vjs-default-skin cata-video-popup" width="80%" height="80%" loop>' +
                selector.html() +
                "</video>"
            );
            $video
              .attr("data-setup", JSON.stringify(selector.data("setup")))
              .css("display", "none");
            $("body").append($video);
            var player = videojs("s" + elemID, {}, function () {
              this.on("ended", function () {});
            });
            player.pause();
            $(this)
              .find(".video-control")
              .on("click", function (e) {
                var $elemVid = $("#s" + elemID);
                var $overlay = $(
                  '<div class="cata-video-overlay"><span class="vclose"></span></div>'
                );
                $("body").append($overlay);
                var videoTime = setTimeout(function () {
                  $elemVid.css({ display: "block" });
                  $elemVid.stop(false, true).animate({ opacity: 1 }, 1000);
                  player.play();
                }, 1000);
                $overlay.stop().animate({ opacity: 0.9 }, 600);
                $overlay.on("click", function (e) {
                  clearTimeout(videoTime);
                  $(this)
                    .stop()
                    .animate({ opacity: 0 }, 600, "swing", function () {
                      $(this).remove();
                    });
                  $elemVid
                    .stop()
                    .animate({ opacity: 0 }, 600, "swing", function () {
                      $elemVid.css({ display: "none" });
                      player.pause();
                      player.currentTime(0);
                    });
                });
              });
          });
        }
      }
    },
    google_maps: function () {
      var $selector = $(".cata-google-maps");
      if ($selector.length > 0) {
        var base = this;
        $selector.each(function () {
          var _this = $(this),
            mapzoom = _this.data("zoom"),
            locations = _this.find(".cata-map-location");
          var map,
            mapOptions,
            isonce,
            mapStyle,
            mapStyle1,
            mapStyle2,
            mapStyle3,
            mapStyle4,
            mapStyle5,
            mapStyle6,
            mapStyle7,
            mapStyle8,
            mapStyle9,
            mapStyle10;
          mapStyle1 = [
            {
              featureType: "administrative.country",
              elementType: "geometry",
              stylers: [{ visibility: "simplified" }, { hue: "#ff0000" }],
            },
          ];
          mapStyle2 = [
            {
              featureType: "all",
              elementType: "labels.text.fill",
              stylers: [
                { saturation: 36 },
                { color: "#000000" },
                { lightness: 40 },
              ],
            },
            {
              featureType: "all",
              elementType: "labels.text.stroke",
              stylers: [
                { visibility: "on" },
                { color: "#000000" },
                { lightness: 16 },
              ],
            },
            {
              featureType: "all",
              elementType: "labels.icon",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "administrative",
              elementType: "geometry.fill",
              stylers: [{ color: "#000000" }, { lightness: 20 }],
            },
            {
              featureType: "administrative",
              elementType: "geometry.stroke",
              stylers: [
                { color: "#000000" },
                { lightness: 17 },
                { weight: 1.2 },
              ],
            },
            {
              featureType: "landscape",
              elementType: "geometry",
              stylers: [{ color: "#000000" }, { lightness: 20 }],
            },
            {
              featureType: "poi",
              elementType: "geometry",
              stylers: [{ color: "#000000" }, { lightness: 21 }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry.fill",
              stylers: [{ color: "#000000" }, { lightness: 17 }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry.stroke",
              stylers: [
                { color: "#000000" },
                { lightness: 29 },
                { weight: 0.2 },
              ],
            },
            {
              featureType: "road.arterial",
              elementType: "geometry",
              stylers: [{ color: "#000000" }, { lightness: 18 }],
            },
            {
              featureType: "road.local",
              elementType: "geometry",
              stylers: [{ color: "#000000" }, { lightness: 16 }],
            },
            {
              featureType: "transit",
              elementType: "geometry",
              stylers: [{ color: "#000000" }, { lightness: 19 }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#000000" }, { lightness: 17 }],
            },
          ];
          mapStyle3 = [
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#e9e9e9" }, { lightness: 17 }],
            },
            {
              featureType: "landscape",
              elementType: "geometry",
              stylers: [{ color: "#f5f5f5" }, { lightness: 20 }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry.fill",
              stylers: [{ color: "#ffffff" }, { lightness: 17 }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry.stroke",
              stylers: [
                { color: "#ffffff" },
                { lightness: 29 },
                { weight: 0.2 },
              ],
            },
            {
              featureType: "road.arterial",
              elementType: "geometry",
              stylers: [{ color: "#ffffff" }, { lightness: 18 }],
            },
            {
              featureType: "road.local",
              elementType: "geometry",
              stylers: [{ color: "#ffffff" }, { lightness: 16 }],
            },
            {
              featureType: "poi",
              elementType: "geometry",
              stylers: [{ color: "#f5f5f5" }, { lightness: 21 }],
            },
            {
              featureType: "poi.park",
              elementType: "geometry",
              stylers: [{ color: "#dedede" }, { lightness: 21 }],
            },
            {
              elementType: "labels.text.stroke",
              stylers: [
                { visibility: "on" },
                { color: "#ffffff" },
                { lightness: 16 },
              ],
            },
            {
              elementType: "labels.text.fill",
              stylers: [
                { saturation: 36 },
                { color: "#333333" },
                { lightness: 40 },
              ],
            },
            { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
            {
              featureType: "transit",
              elementType: "geometry",
              stylers: [{ color: "#f2f2f2" }, { lightness: 19 }],
            },
            {
              featureType: "administrative",
              elementType: "geometry.fill",
              stylers: [{ color: "#fefefe" }, { lightness: 20 }],
            },
            {
              featureType: "administrative",
              elementType: "geometry.stroke",
              stylers: [
                { color: "#fefefe" },
                { lightness: 17 },
                { weight: 1.2 },
              ],
            },
          ];
          mapStyle4 = [
            { stylers: [{ hue: "#007fff" }, { saturation: 89 }] },
            { featureType: "water", stylers: [{ color: "#ffffff" }] },
            {
              featureType: "administrative.country",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ];
          mapStyle5 = [
            { stylers: [{ saturation: -45 }, { lightness: 13 }] },
            {
              featureType: "road.highway",
              elementType: "geometry.fill",
              stylers: [{ color: "#8fa7b3" }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry.stroke",
              stylers: [{ color: "#667780" }],
            },
            {
              featureType: "road.highway",
              elementType: "labels.text.fill",
              stylers: [{ color: "#333333" }],
            },
            {
              featureType: "road.highway",
              elementType: "labels.text.stroke",
              stylers: [{ color: "#8fa7b3" }, { gamma: 2 }],
            },
            {
              featureType: "road.arterial",
              elementType: "geometry.fill",
              stylers: [{ color: "#a3becc" }],
            },
            {
              featureType: "road.arterial",
              elementType: "geometry.stroke",
              stylers: [{ color: "#7a8f99" }],
            },
            {
              featureType: "road.arterial",
              elementType: "labels.text.fill",
              stylers: [{ color: "#555555" }],
            },
            {
              featureType: "road.local",
              elementType: "geometry.fill",
              stylers: [{ color: "#a3becc" }],
            },
            {
              featureType: "road.local",
              elementType: "geometry.stroke",
              stylers: [{ color: "#7a8f99" }],
            },
            {
              featureType: "road.local",
              elementType: "labels.text.fill",
              stylers: [{ color: "#555555" }],
            },
            {
              featureType: "water",
              elementType: "geometry.fill",
              stylers: [{ color: "#bbd9e9" }],
            },
            {
              featureType: "administrative",
              elementType: "labels.text.fill",
              stylers: [{ color: "#525f66" }],
            },
            {
              featureType: "transit",
              elementType: "labels.text.stroke",
              stylers: [{ color: "#bbd9e9" }, { gamma: 2 }],
            },
            {
              featureType: "transit.line",
              elementType: "geometry.fill",
              stylers: [{ color: "#a3aeb5" }],
            },
          ];
          mapStyle6 = [
            {
              featureType: "administrative",
              elementType: "labels.text.fill",
              stylers: [{ color: "#444444" }],
            },
            {
              featureType: "administrative.locality",
              elementType: "labels",
              stylers: [{ visibility: "on" }],
            },
            {
              featureType: "landscape",
              elementType: "all",
              stylers: [{ color: "#f2f2f2" }, { visibility: "simplified" }],
            },
            {
              featureType: "poi",
              elementType: "all",
              stylers: [{ visibility: "on" }],
            },
            {
              featureType: "poi",
              elementType: "geometry",
              stylers: [
                { visibility: "simplified" },
                { saturation: "-65" },
                { lightness: "45" },
                { gamma: "1.78" },
              ],
            },
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "poi",
              elementType: "labels.icon",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "road",
              elementType: "all",
              stylers: [{ saturation: -100 }, { lightness: 45 }],
            },
            {
              featureType: "road",
              elementType: "labels",
              stylers: [{ visibility: "on" }],
            },
            {
              featureType: "road",
              elementType: "labels.icon",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "road.highway",
              elementType: "all",
              stylers: [{ visibility: "simplified" }],
            },
            {
              featureType: "road.highway",
              elementType: "labels.icon",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "road.arterial",
              elementType: "labels.icon",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "transit.line",
              elementType: "geometry",
              stylers: [
                { saturation: "-33" },
                { lightness: "22" },
                { gamma: "2.08" },
              ],
            },
            {
              featureType: "transit.station.airport",
              elementType: "geometry",
              stylers: [{ gamma: "2.08" }, { hue: "#ffa200" }],
            },
            {
              featureType: "transit.station.airport",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "transit.station.rail",
              elementType: "labels.text",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "transit.station.rail",
              elementType: "labels.icon",
              stylers: [
                { visibility: "simplified" },
                { saturation: "-55" },
                { lightness: "-2" },
                { gamma: "1.88" },
                { hue: "#ffab00" },
              ],
            },
            {
              featureType: "water",
              elementType: "all",
              stylers: [{ color: "#bbd9e5" }, { visibility: "simplified" }],
            },
          ];
          mapStyle7 = [
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#e9e9e9" }, { lightness: 17 }],
            },
            {
              featureType: "landscape",
              elementType: "geometry",
              stylers: [{ color: "#f5f5f5" }, { lightness: 20 }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry.fill",
              stylers: [{ color: "#ffffff" }, { lightness: 17 }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry.stroke",
              stylers: [
                { color: "#ffffff" },
                { lightness: 29 },
                { weight: 0.2 },
              ],
            },
            {
              featureType: "road.arterial",
              elementType: "geometry",
              stylers: [{ color: "#ffffff" }, { lightness: 18 }],
            },
            {
              featureType: "road.local",
              elementType: "geometry",
              stylers: [{ color: "#ffffff" }, { lightness: 16 }],
            },
            {
              featureType: "poi",
              elementType: "geometry",
              stylers: [{ color: "#f5f5f5" }, { lightness: 21 }],
            },
            {
              featureType: "poi.park",
              elementType: "geometry",
              stylers: [{ color: "#dedede" }, { lightness: 21 }],
            },
            {
              elementType: "labels.text.stroke",
              stylers: [
                { visibility: "on" },
                { color: "#ffffff" },
                { lightness: 16 },
              ],
            },
            {
              elementType: "labels.text.fill",
              stylers: [
                { saturation: 36 },
                { color: "#333333" },
                { lightness: 40 },
              ],
            },
            { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
            {
              featureType: "transit",
              elementType: "geometry",
              stylers: [{ color: "#f2f2f2" }, { lightness: 19 }],
            },
            {
              featureType: "administrative",
              elementType: "geometry.fill",
              stylers: [{ color: "#fefefe" }, { lightness: 20 }],
            },
            {
              featureType: "administrative",
              elementType: "geometry.stroke",
              stylers: [
                { color: "#fefefe" },
                { lightness: 17 },
                { weight: 1.2 },
              ],
            },
          ];
          mapStyle8 = [
            {
              featureType: "administrative",
              elementType: "all",
              stylers: [{ visibility: "on" }, { lightness: 33 }],
            },
            {
              featureType: "landscape",
              elementType: "all",
              stylers: [{ color: "#f2e5d4" }],
            },
            {
              featureType: "poi.park",
              elementType: "geometry",
              stylers: [{ color: "#c5dac6" }],
            },
            {
              featureType: "poi.park",
              elementType: "labels",
              stylers: [{ visibility: "on" }, { lightness: 20 }],
            },
            {
              featureType: "road",
              elementType: "all",
              stylers: [{ lightness: 20 }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry",
              stylers: [{ color: "#c5c6c6" }],
            },
            {
              featureType: "road.arterial",
              elementType: "geometry",
              stylers: [{ color: "#e4d7c6" }],
            },
            {
              featureType: "road.local",
              elementType: "geometry",
              stylers: [{ color: "#fbfaf7" }],
            },
            {
              featureType: "water",
              elementType: "all",
              stylers: [{ visibility: "on" }, { color: "#acbcc9" }],
            },
          ];
          mapStyle9 = [
            {
              featureType: "landscape.natural",
              elementType: "geometry.fill",
              stylers: [{ visibility: "on" }, { color: "#e0efef" }],
            },
            {
              featureType: "poi",
              elementType: "geometry.fill",
              stylers: [
                { visibility: "on" },
                { hue: "#1900ff" },
                { color: "#c0e8e8" },
              ],
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ lightness: 100 }, { visibility: "simplified" }],
            },
            {
              featureType: "road",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "transit.line",
              elementType: "geometry",
              stylers: [{ visibility: "on" }, { lightness: 700 }],
            },
            {
              featureType: "water",
              elementType: "all",
              stylers: [{ color: "#7dcdcd" }],
            },
          ];
          mapStyle10 = [
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#193341" }],
            },
            {
              featureType: "landscape",
              elementType: "geometry",
              stylers: [{ color: "#2c5a71" }],
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#29768a" }, { lightness: -37 }],
            },
            {
              featureType: "poi",
              elementType: "geometry",
              stylers: [{ color: "#406d80" }],
            },
            {
              featureType: "transit",
              elementType: "geometry",
              stylers: [{ color: "#406d80" }],
            },
            {
              elementType: "labels.text.stroke",
              stylers: [
                { visibility: "on" },
                { color: "#3e606f" },
                { weight: 2 },
                { gamma: 0.84 },
              ],
            },
            {
              elementType: "labels.text.fill",
              stylers: [{ color: "#ffffff" }],
            },
            {
              featureType: "administrative",
              elementType: "geometry",
              stylers: [{ weight: 0.6 }, { color: "#1a3541" }],
            },
            { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
            {
              featureType: "poi.park",
              elementType: "geometry",
              stylers: [{ color: "#2c5a71" }],
            },
          ];
          switch (_this.data("mapstyle")) {
            case "style1":
              mapStyle = mapStyle1;
              break;
            case "style2":
              mapStyle = mapStyle2;
              break;
            case "style3":
              mapStyle = mapStyle3;
              break;
            case "style4":
              mapStyle = mapStyle4;
              break;
            case "style5":
              mapStyle = mapStyle5;
              break;
            case "style6":
              mapStyle = mapStyle6;
              break;
            case "style7":
              mapStyle = mapStyle7;
              break;
            case "style8":
              mapStyle = mapStyle8;
              break;
            case "style9":
              mapStyle = mapStyle9;
              break;
            case "style10":
              mapStyle = mapStyle10;
              break;
          }
          var bounds = new google.maps.LatLngBounds();
          mapOptions = {
            center: { lat: -25.363, lng: 131.044 },
            draggable: !("ontouchend" in document),
            styles: mapStyle,
            zoom: mapzoom,
            scrollwheel: _this.data("scroll-wheel"),
            scaleControl: _this.data("scale"),
            navigationControl: _this.data("zoom-pancontrol"),
            locations: locations,
            mapTypeId: _this.data("type"),
          };
          map = new google.maps.Map(_this[0], mapOptions);
          map.addListener("tilesloaded", function () {
            if (!isonce) {
              locations.each(function (i) {
                var location = $(this),
                  options = location.data("options"),
                  lat = options.latitude,
                  long = options.longitude,
                  latlng = new google.maps.LatLng(lat, long),
                  marker = options.marker_image,
                  title = options.marker_title,
                  desc = options.marker_description,
                  pinimgLoad = new Image();
                bounds.extend(latlng);
                pinimgLoad.src = marker;
                $(pinimgLoad).on("load", function () {
                  base.setMarkers(i, map, lat, long, marker, title, desc);
                });
                isonce = true;
              });
              if (mapzoom > 0) {
                map.setCenter(bounds.getCenter());
                map.setZoom(mapzoom);
              } else {
                map.setCenter(bounds.getCenter());
                map.fitBounds(bounds);
              }
            }
          });
          google.maps.event.addDomListener(window, "resize", function () {
            map.setCenter(bounds.getCenter());
          });
        });
      }
    },
    setMarkers: function (i, map, lat, long, marker, title, desc) {
      function showPin(i) {
        var contentString = '<div class="cata-mapinfo"><h6>' + title + "</h6>";
        if (desc != "") {
          contentString += "<div>" + desc + "</div>";
        }
        contentString += "</div>";
        var google_marker = new google.maps.Marker({
          position: new google.maps.LatLng(lat, long),
          map: map,
          animation: google.maps.Animation.DROP,
          icon: marker,
          optimized: false,
        });
        var infowindow = new google.maps.InfoWindow({ content: contentString });
        google_marker.addListener("mouseover", function () {
          infowindow.open(map, google_marker);
        });
      }
      setTimeout(showPin, i * 500, i);
    },
    elemWaypoint: function () {
      var $selector = $(".cata_parallax");
      if (jQuery().waypoint && $selector.length > 0) {
        $selector.waypoint(
          function () {
            $(this).parallax("50%", $(this).attr("data-velocity"));
          },
          { offset: "200%" }
        );
      }
      var $selector = $(".progress");
      if (jQuery().waypoint && $selector.length > 0) {
        $selector.find(".progress-bar").css("width", "60px");
        $selector.waypoint(
          function () {
            var percentage = $selector
              .find(".progress-bar")
              .attr("aria-valuenow");
            $selector.find(".progress-bar").css({ width: percentage + "%" });
          },
          { triggerOnce: true, offset: "85%" }
        );
      }
      var $selector = $(".cata-counter-circle");
      if (jQuery().waypoint && jQuery().easyPieChart && $selector.length > 0) {
        $selector.waypoint(
          function () {
            $selector.each(function () {
              var elem = $(this).children(".cata-counter-circle-content"),
                dataObj = elem.data();
              elem.easyPieChart(dataObj.params);
            });
          },
          { triggerOnce: true, offset: "95%" }
        );
      }
      if (jQuery().appear) {
        if ($(window).width() + scrollBarWidth > 768) {
          var selector = ".has-animation";
          $(selector).each(function () {
            $(this).appear(function () {
              var parent = $(this).parent(".cata-progress-bars"),
                percentage = $(this).attr("data-value");
              var animation_type = $(this).attr("data-animation-type");
              var animation_duration = $(this).attr("data-animation-duration")
                ? $(this).attr("data-animation-duration")
                : 700;
              var animation_delay = $(this).attr("data-animation-delay")
                ? $(this).attr("data-animation-delay")
                : 0;
              var $this = $(this);
              $this.addClass("animated").addClass(animation_type);
              if (animation_duration != 0) {
                $this.css("-moz-animation-duration", animation_duration + "ms");
                $this.css(
                  "-webkit-animation-duration",
                  animation_duration + "ms"
                );
                $this.css("-ms-animation-duration", animation_duration + "ms");
                $this.css("-o-animation-duration", animation_duration + "ms");
                $this.css("animation-duration", animation_duration + "ms");
              }
              if (animation_delay != 0) {
                $this.css("-moz-animation-delay", animation_delay + "ms");
                $this.css("-webkit-animation-delay", animation_delay + "ms");
                $this.css("-ms-animation-delay", animation_delay + "ms");
                $this.css("-o-animation-delay", animation_delay + "ms");
                $this.css("animation-delay", animation_delay + "ms");
              }
            });
          });
        } else {
          var selector = ".has-animation";
          $(selector).addClass("animated");
        }
      }
    },
  };
  CATACORE.menuNav = function ($el, options) {
    this.$menu = $el;
    var defaults = {
      mobMenuClass: "mobi-nav-menu",
      mobPrecedingElSel: "#mobile-nav",
      mobBtnSel: ".mobi-nav-btn",
      mobArrowClass: "mobi-nav-arrow",
      mobSubOpenedClass: "mobi-sub-opened",
      megaMenuClass: "mega-menu-item",
      megaMenuMaxWidth: 1170,
      megaMenuColumnWidth: 230,
      megaMenuColumnWidthResize: 210,
    };
    this.o = $.extend(defaults, options);
  };
  var mn = CATACORE.menuNav.prototype;
  mn.init = function () {
    var self = this,
      browser = $.fn.getBrowser();
    self.$window = $(window);
    self.$body = $("body");
    self.$mainUl = self.$menu.find("ul:first");
    self.isIE9 = browser.msie && parseInt(browser.version, 10) == 9;
    if (self.$menu.is(":visible")) {
      self.initMainMenu();
    } else {
      $(window).on("resize.catanisdropdown", function () {
        if (self.$menu.is(":visible")) {
          self.initMainMenu();
          $(window).off(".catanisdropdown");
        }
      });
    }
    self.initMobileMenu();
  };
  mn.initMainMenu = function () {
    var self = this,
      menuPosition = "left";
    if (this.$body.hasClass("header-layout-center")) {
      menuPosition = "center";
    } else if (this.$body.hasClass("header-layout-right")) {
      menuPosition = "right";
    }
    this.menuPosition = menuPosition;
    self.$menu
      .find("ul li")
      .has("ul")
      .not("ul li.mega-menu-item li")
      .each(function () {
        $(this)
          .on("mouseenter", function () {
            self.doOnMenuMouseover($(this));
          })
          .on("mouseleave", function () {
            self.doOnMenuMouseout($(this));
          })
          .find("a:first")
          .append('<span class="drop-arrow"></span>');
      });
    self.$menu.find('a[href="#"]').on("click", function (e) {
      e.preventDefault();
    });
    this.initMegaMenu();
  };
  mn.initMegaMenu = function () {
    this.$megaUls = this.$menu
      .find("ul li." + this.o.megaMenuClass)
      .has("ul")
      .children("ul");
    if (this.$megaUls.length) {
      this.$parentWrapper = this.$menu.parents(
        ".header-bottom-container:first"
      );
      this.$window.on("resize", $.proxy(this.setMegaMenuWidth, this));
      this.setMegaMenuWidth();
    }
  };
  mn.setMegaMenuMaxWidth = function () {
    var maxWidth = 0;
    switch (this.menuPosition) {
      case "right":
        if (!this.lastMenuLi) {
          this.lastMenuLi = this.$menu.find("ul:first>li:last");
        }
        if (this.isIE9) {
          this.lastMenuLi.offset();
        }
        maxWidth =
          this.lastMenuLi.offset().left +
          this.lastMenuLi.width() -
          this.$parentWrapper.offset().left;
        break;
      case "left":
        maxWidth = this.$parentWrapper.width();
        break;
      case "center":
        maxWidth = this.$parentWrapper.width();
        break;
    }
    this.megaMenuMaxWidth = Math.min(this.o.megaMenuMaxWidth, maxWidth);
  };
  mn.setMegaMenuWidth = function () {
    var self = this;
    var megaMenuColWidth = 0;
    this.setMegaMenuMaxWidth();
    this.mainUlWidth = this.$mainUl.width();
    this.$megaUls.each(function () {
      var $ul = $(this),
        liNum = $ul.children("li").length,
        width,
        colsToFit;
      if (liNum > 0) {
        if (self.$window.width() < 1200) {
          megaMenuColWidth = self.o.megaMenuColumnWidthResize;
        } else {
          megaMenuColWidth = self.o.megaMenuColumnWidth;
        }
        if (self.megaMenuMaxWidth < liNum * megaMenuColWidth) {
          colsToFit = Math.floor(self.megaMenuMaxWidth / megaMenuColWidth) || 1;
          width = colsToFit * megaMenuColWidth;
        } else {
          width = liNum * megaMenuColWidth;
          colsToFit = liNum;
        }
        if (this.lastMegaClass) {
          $ul.removeClass(this.lastMegaClass);
        }
        this.lastMegaClass = "mega-columns-" + colsToFit;
        $ul.width(width).addClass(this.lastMegaClass);
        self.setMegaMenuPosition($ul, width);
      }
    });
  };
  mn.setMegaMenuPosition = function ($ul, ulWidth) {
    var left, $li, centerPosition, shortestEndDistance;
    if (ulWidth >= this.mainUlWidth) {
      switch (this.menuPosition) {
        case "right":
          $ul.css({ left: "auto", right: 0 });
          break;
        case "left":
          $ul.css({ left: 0 });
          break;
        case "center":
          if (typeof this.iconsWidth === "undefined") {
            var $icons = this.$parentWrapper.find(".header-buttons");
            this.iconsWidth = $icons.length ? $icons.width() : 0;
          }
          left = -(ulWidth - (this.mainUlWidth + this.iconsWidth) + 30) / 2;
          $ul.css({ left: left });
          break;
      }
    } else {
      $li = $ul.parents("li:first");
      (centerPosition = $li.position().left + $li.width() / 2),
        (shortestEndDistance = Math.min(
          centerPosition,
          this.mainUlWidth - centerPosition
        ));
      if (ulWidth / 2 <= shortestEndDistance) {
        left = centerPosition + 12 - ulWidth / 2;
        $ul.css({ left: left });
      } else {
        if (centerPosition <= this.mainUlWidth - centerPosition) {
          $ul.css({ left: 0 });
        } else {
          $ul.css({ left: "auto", right: 0 });
        }
      }
    }
  };
  mn.doOnMenuMouseover = function ($li) {
    var self = this,
      $ul = $li.find("ul:first"),
      parentUlNum = $ul.parents("ul").length,
      elWidth = $li.width(),
      ulWidth = $ul.width(),
      winWidth = self.$window.width(),
      elOffset = $li.offset().left;
    $li.addClass("hovered");
    if (self.menuPosition == "right" && !$li.hasClass(self.o.megaMenuClass)) {
      if (parentUlNum > 1 && elWidth + ulWidth + elOffset > winWidth) {
        $ul.css({ left: -elWidth });
      } else if (parentUlNum === 1) {
        if (ulWidth + elOffset > winWidth) {
          $ul.css({ left: winWidth - 3 - (ulWidth + elOffset) });
        } else {
          $ul.css({ left: 0 });
        }
      }
    }
    $ul.stop().fadeIn(300);
  };
  mn.doOnMenuMouseout = function ($li) {
    var $ul = $li.find("ul:first");
    $li.removeClass("hovered");
    $ul.stop().fadeOut(300);
  };
  mn.initMobileMenu = function () {
    var self = this,
      $menu = $("<div />", {
        class: self.o.mobMenuClass,
        html: self.$menu.html(),
      }).insertAfter($(self.o.mobPrecedingElSel));
    self.mobile = {
      opened: false,
      inAnimation: false,
      $menuBtn: $(self.o.mobBtnSel),
      $menu: $menu,
    };
    $menu.find("ul").css("width", "").css("left", "").css("right", "");
    $menu
      .find("ul li")
      .has("ul")
      .each(function () {
        $(this).append(
          '<div class="' + self.o.mobArrowClass + '"><span></span></div>'
        );
      });
    self.onMobileEventHandlers();
  };
  mn.onMobileEventHandlers = function () {
    var self = this,
      m = self.mobile;
    m.$menuBtn.on("click", function () {
      self.toggleMobileMenu();
    });
    self.$window.on("resize", function () {
      if (!m.$menuBtn.is(":visible") && m.$menu && m.opened) {
        m.$menu.hide();
        m.opened = false;
      }
    });
    m.$menu.find("li > a").on("click", function (e) {
      self.toggleMobileMenu();
    });
    m.$menu
      .find('li:has(ul) a[href="#"],' + "." + self.o.mobArrowClass)
      .on("click", function (e) {
        var $submenu = $(this).siblings("ul:first"),
          $arrow =
            e.target.nodeName.toLowerCase() == "span"
              ? $(this)
              : $(this).siblings("." + self.o.mobArrowClass);
        self.toggleMobileSubMenu($submenu, $(this));
        m.$menu.getNiceScroll().resize();
      });
  };
  mn.toggleMobileMenu = function () {
    var self = this,
      m = self.mobile;
    if (!m.inAnimation) {
      if (!m.opened) {
        m.inAnimation = true;
        m.$menu.animate({ height: "show" }, function () {
          m.opened = true;
          m.inAnimation = false;
        });
      } else {
        m.inAnimation = true;
        m.$menu.animate({ height: "hide" }, function () {
          m.opened = false;
          m.inAnimation = false;
        });
      }
    }
    if ($(window).width() + scrollBarWidth < 768) {
      m.$menu.css("max-height", $(window).height() - 100 + "px");
      m.$menu.niceScroll({
        touchbehavior: true,
        cursoropacitymax: 1,
        cursorwidth: "6px",
        cursorborder: "0px",
        cursorcolor: "#292929",
        railalign: "left",
        cursorminheight: 10,
        zindex: 9999,
        autohidemode: false,
        bouncescroll: false,
        scrollspeed: 120,
        mousescrollstep: 90,
        grabcursorenabled: true,
        preservenativescrolling: true,
        cursordragontouch: true,
        enablemousewheel: true,
      });
      m.$menu
        .niceScroll()
        .scrollstart(function (info) {
          m.$menu.getNiceScroll().resize();
        })
        .scrollend(function (info) {
          setTimeout(function () {
            m.$menu.getNiceScroll().resize();
          }, 500);
        });
    }
  };
  mn.toggleMobileSubMenu = function ($ul, $arrow) {
    var self = this,
      m = self.mobile;
    if (!$ul.length || m.inAnimation) {
      return;
    }
    m.inAnimation = true;
    $arrow.toggleClass(self.o.mobSubOpenedClass);
    if ($ul.is(":visible")) {
      $ul.animate({ height: "hide" }, function () {
        m.inAnimation = false;
      });
    } else {
      $ul.animate({ height: "show" }, function () {
        m.inAnimation = false;
      });
    }
  };
  var isMobile = {
    Android: function () {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
      return (
        isMobile.Android() ||
        isMobile.BlackBerry() ||
        isMobile.iOS() ||
        isMobile.Opera() ||
        isMobile.Windows()
      );
    },
  };
  var tabletPortrait = 992;
  var scrollBarWidth = getScrollBarWidth();
  function getScrollBarWidth() {
    if ($(document).height() > $(window).height()) {
      var fakeScrollBar, w1, w2;
      $("body").append(
        '<div id="fakescrollbar" style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"></div>'
      );
      fakeScrollBar = $("#fakescrollbar");
      fakeScrollBar.append('<div style="height:100px;">&nbsp;</div>');
      w1 = fakeScrollBar.find("div").innerWidth();
      fakeScrollBar.css("overflow-y", "scroll");
      w2 = $("#fakescrollbar")
        .find("div")
        .html("html is required to init new width.")
        .innerWidth();
      fakeScrollBar.remove();
      return w1 - w2;
    }
    return 0;
  }
  if (typeof jQuery.migrateVersion !== "undefined") {
    jQuery.migrateMute = true;
    jQuery.migrateTrace = false;
    jQuery.migrateReset();
  }
  $(window).smartresize(function () {
    CATACORE.documentResize.init();
  });
  $(window).scroll(function () {
    CATACORE.documentScroll.init();
  });
  $(document).ready(function () {
    CATACORE.documentReady.init();
  });
  $(window).on("load", function () {
    CATACORE.documentLoad.init();
  });
})(jQuery);
jQuery(document).ready(function ($) {
  var $demosPreview = $(".cata-demos-preview"),
    $demoTabs = $(".cata-demo-tabs"),
    demosLoad = 0,
    demosShown = 0,
    htmlResponse = "";
  $(document).on("click", ".cata-show-demos", function (e) {
    e.preventDefault();
    if (demosLoad && demosShown) {
      $demosPreview.addClass("cata-preview-open");
      cata_demos_preview_niceScroll();
      return;
    } else if (demosLoad && !demosShown) {
      $demosPreview.addClass("cata-preview-open");
      $demoTabs.html(htmlResponse);
      cata_tabs();
      cata_lazyload(".cata-tab-item.active .cata-lazy-img");
      cata_demos_preview_niceScroll();
      demosShown = 1;
      return;
    } else if (!demosLoad && !demosShown) {
      $demosPreview.addClass("cata-preview-open");
      cata_get_preview_demos((showDemos = 1));
    }
  });
  $(document).on("click", ".cata-close-demos-preview", function () {
    $demosPreview.removeClass("cata-preview-open");
  });
  $(document).keyup(function (e) {
    if (e.keyCode === 27) $(".cata-close-demos-preview").click();
  });
  $(document).on(
    "click",
    ".cata-category-list .cata-category-item",
    function () {
      var categoryTabId = $(this).attr("id"),
        tab = $('.cata-tab-item[data-tab-id="' + categoryTabId + '"]');
      $(this).siblings().removeClass("active");
      $(this).addClass("active");
      tab.siblings().removeClass("active");
      tab.addClass("active");
      cata_demos_preview_niceScroll();
      cata_lazyload(".cata-tab-item.active .cata-lazy-img");
    }
  );
  function cata_get_preview_demos(showDemos) {
    $demosPreview.addClass("cata-demos-loading");
    $.ajax({
      url: CATANIS.ajax_url,
      data: { action: "cata_loadmore_demos" },
      method: "POST",
      dataType: "JSON",
      success: function (response) {
        htmlResponse = response;
        demosLoad = 1;
        if (showDemos) {
          $demoTabs.html(htmlResponse);
          cata_tabs();
          cata_lazyload(".cata-tab-item.active .cata-lazy-img");
          demosShown = 1;
        }
        setTimeout(function () {
          cata_demos_preview_niceScroll();
        }, 150);
        $demosPreview.removeClass("cata-demos-loading");
        $demosPreview.addClass("cata-demos-loaded");
      },
      error: function (err) {
        console.log("ajax error");
      },
    });
  }
  function cata_demos_preview_niceScroll() {
    if ($(window).width() < 1024) return;
    $(".tab-scroll-content").niceScroll({
      touchbehavior: true,
      cursoropacitymax: 1,
      cursorwidth: "6px",
      cursorborder: "0px",
      cursorcolor: "#292929",
      railalign: "right",
      horizrailenabled: false,
      cursorminheight: 10,
      zindex: 9999,
      background: "#ddd",
      autohidemode: false,
      bouncescroll: false,
      scrollspeed: 120,
      mousescrollstep: 90,
      grabcursorenabled: true,
      preservenativescrolling: true,
      cursordragontouch: true,
      enablemousewheel: true,
    });
  }
  function cata_tabs() {
    var $firstTabEl = $(".cata-category-list .cata-category-item").first(),
      firstTabEl_id = $firstTabEl.attr("id");
    $firstTabEl.addClass("active");
    $('.cata-tab-item[data-tab-id="' + firstTabEl_id + '"]').addClass("active");
  }
  function cata_lazyload($selector) {
    var lazy = $($selector);
    lazy.each(function () {
      if (!$(this).parent().hasClass("cata-image-loaded")) {
        var ImageSrc = $(this).data("lazy-original");
        $(this).attr("src", ImageSrc);
        $(this).parent().addClass("cata-image-loading");
        $(this).on("load", function () {
          $(this).parent().removeClass("cata-image-loading");
          $(this).parent().addClass("cata-image-loaded");
        });
      }
    });
  }
});
