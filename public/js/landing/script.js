$(window).on("load", function () {

    "use strict";

    //Clear URL On Page Refresh
    var loc = window.location.href,
        index = loc.indexOf('#');

    if (index > 0) {
        window.location = loc.substring(0, index);
    }

    /* ===================================
        Page Piling
    ====================================== */
    if($(window).width() < 1200) {
        $('.pagedata').removeAttr('id');
        $('html, body').css('overflow-y', 'scroll');

        //All Product Counter
        $('.count').each(function () {
            $(this).appear(function () {
                $(this).prop('Counter', 0).animate({
                    Counter: $(this).text()
                }, {
                    duration: 3000,
                    easing: 'swing',
                    step: function (now) {
                        $(this).text(Math.ceil(now));
                    }
                });
            });
        });
    }
    else{
        $('#pagepiling').pagepiling({
            direction: 'vertical',
            sectionsColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
            anchors: ['home-banner', 'all-products', 'reviews', 'contact'],
            scrollingSpeed: 500,
            menu: '#menu',
            easing: 'linear',
            loopBottom: false,
            loopTop: false,
            css3: true,
            navigation: {
                'bulletsColor': '#ffffff',
                'position': 'left',
                'tooltips': ['Home', 'All Products', 'Reviews', 'Contact'],
            },

            //events
            onLeave: function (index, nextIndex, direction) {
                //reaching our First section? The one with our normal site?

                $('.navbar-top-default').fadeOut();
                $('.slider-bottom .slider-social').fadeOut();
                $('.slider-copyright').fadeOut();

                if(nextIndex == 1 || nextIndex == 2 || nextIndex == 3 || nextIndex == 4 || nextIndex == 5 || nextIndex == 6 || nextIndex == 7 || nextIndex == 8 || nextIndex == 9 || nextIndex == 10){

                    setTimeout(function(){
                        $('.navbar-top-default').fadeIn();
                        $('.slider-bottom .slider-social').fadeIn();
                        $('.slider-copyright').fadeIn();
                    }, 600);
                }

                //All Product Counter
                $('.count').each(function () {
                    $(this).appear(function () {
                        $(this).prop('Counter', 0).animate({
                            Counter: $(this).text()
                        }, {
                            duration: 3000,
                            easing: 'swing',
                            step: function (now) {
                                $(this).text(Math.ceil(now));
                            }
                        });
                    });
                });
                //First Slide Animation
                if(nextIndex == 1) {
                    $('.content1').addClass('zoomIn');
                    setTimeout(function(){
                        $('.content1').removeClass('zoomIn');
                    }, 1200);

                    $('.content2').addClass('zoomIn');
                    setTimeout(function(){
                        $('.content2').removeClass('zoomIn');
                    }, 1400);

                    $('.content3').addClass('zoomIn');
                    setTimeout(function(){
                        $('.content3').removeClass('zoomIn');
                    }, 1600);

                    $('.section1right').addClass('fadeIn');
                    setTimeout(function(){
                        $('.section1right').removeClass('fadeIn');
                    }, 1800);

                    $('.circle1fade').addClass('zoomIn');
                    setTimeout(function(){
                        $('.circle1fade').removeClass('zoomIn');
                    }, 1000);

                    $('.circle2fade').addClass('zoomIn');
                    setTimeout(function(){
                        $('.circle2fade').removeClass('zoomIn');
                    }, 1200);

                    $('.circle3fade').addClass('zoomIn');
                    setTimeout(function(){
                        $('.circle3fade').removeClass('zoomIn');
                    }, 1400);

                    $('.circle4fade').addClass('zoomIn');
                    setTimeout(function(){
                        $('.circle4fade').removeClass('zoomIn');
                    }, 1600);
                    $('.circle5fade').addClass('zoomIn');
                    setTimeout(function(){
                        $('.circle5fade').removeClass('zoomIn');
                    }, 1600);
                }
                //Second Slide Animation
                if(nextIndex == 2) {
                    $('.section2left').addClass('slideInLeft');
                    setTimeout(function(){
                        $('.section2left').removeClass('slideInLeft');
                    }, 1800);

                    $('.section2right').addClass('slideInRight');
                    setTimeout(function(){
                        $('.section2right').removeClass('slideInRight');
                    }, 1800);

                    $('.products-fade').addClass('zoomIn');
                    setTimeout(function(){
                        $('.products-fade').removeClass('zoomIn');
                    }, 1600);
                }
                //Third Slide Animation
                if(nextIndex == 3) {
                    $('.section3zoom').addClass('zoomIn');
                    setTimeout(function(){
                        $('.section3zoom').removeClass('zoomIn');
                    }, 1600);

                    $('.review-zoom1In').addClass('zoomIn');
                    setTimeout(function(){
                        $('.review-zoom1In').removeClass('zoomIn');
                    }, 1000);

                    $('.review-zoom2In').addClass('zoomIn');
                    setTimeout(function(){
                        $('.review-zoom2In').removeClass('zoomIn');
                    }, 1200);

                    $('.review-zoom3In').addClass('zoomIn');
                    setTimeout(function(){
                        $('.review-zoom3In').removeClass('zoomIn');
                    }, 1400);

                    $('.review-zoom4In').addClass('zoomIn');
                    setTimeout(function(){
                        $('.review-zoom4In').removeClass('zoomIn');
                    }, 1600);
                }
                //Fourth Slide Animation
                if(nextIndex == 4) {
                    $('.section4left').addClass('slideInLeft');
                    setTimeout(function(){
                        $('.section4left').removeClass('slideInLeft');
                    }, 1800);
                }
            },
        });
    }

/* ===================================
        WOW Animation
====================================== */

    if ($(window).width() > 991) {
        var wow = new WOW({
            boxClass: 'wow',
            animateClass: 'animated',
            offset: 0,
            mobile: false,
            live: true
        });
        new WOW().init();
    }

/* ===================================
    Loading Timeout
 ====================================== */

    $('.side-menu').removeClass('hidden');

    setTimeout(function(){
        $(".loader-bg").fadeOut("slow");
    }, 500);
});

jQuery(function ($) {

    "use strict";

    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 260) { // Set position from top to add class
            $('header').addClass('header-appear');
        }
        else {
            $('header').removeClass('header-appear');
        }
    });

    //scroll to appear
    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 500)
            $('.scroll-top-arrow').fadeIn('slow');
        else
            $('.scroll-top-arrow').fadeOut('slow');
    });

    //Click event to scroll to top
    $(document).on('click', '.scroll-top-arrow', function () {
        $('html, body').animate({scrollTop: 0}, 800);
        return false;
    });
});

/* ===================================
     Side Menu Open & Close
====================================== */
function  my_click() {

    $('#my_tog').on("click", function () {
        $(".side_nav").addClass("expand_nav");
        $("#my_tog").addClass("close_nav");
        $("#my_tog").attr("id","close_nav");

        $(".overlay-body").addClass("show_body_overlay");
        $('#pp-nav').hide();
    });

    $('#close_nav').on("click", function () {
        $("#close_nav").removeClass("close_nav");
        $(".side_nav").removeClass("expand_nav");
        $("#my_tog").removeClass("close_nav");
        $("#close_nav").attr("id","my_tog");

        $(".overlay-body").removeClass("show_body_overlay");
        $('#pp-nav').show();
    });
}

$('.side-nav-menu .nav-menu li a').on("click", function () {
    $(".side_nav").removeClass("expand_nav");
    $("#close_nav").removeClass("close_nav");
    $(".side_nav").removeClass("expand_nav");
    $("#my_tog").removeClass("close_nav");
    $("#close_nav").attr("id","my_tog");
    $('#pp-nav').show();
    $('.side-nav-menu .nav-menu .nav-item .nav-link').removeClass('active');
    $(this).addClass('active');
});

/* ===================================
    Broad Nav
====================================== */

$('.my_nav_tog').click(function() {
    $('.broad').addClass('broad-nav');
    $('.broad').css({ opacity: "1" });
    $('.head-nav').hide();
    $('body').addClass('show-modal');
});

$('.btn-close').click(function() {
    $('.broad').css({ opacity: "0" });
    $('body').removeClass('show-modal');
    setTimeout(function() {$('.broad').removeClass('broad-nav')},100);
});

$('.broad ul li a').click(function () {
    $('.broad').css({ opacity: "0" });
    $('body').removeClass('show-modal');
    setTimeout(function() {$('.broad').removeClass('broad-nav')},100);
});

/* ===================================
    Fixed Broad Nav-Bar
 ====================================== */

$(window).on('scroll', function () {

    if($(window).width() <= 767){
        if ($(this).scrollTop() > 300) {
            $('#home').addClass('fixed-top')
            $('#home').addClass('fix-top')
            $('#pagepiling').addClass('margin-manage');
        }
        else {
            $('#home').removeClass('fixed-top')
            $('#home').removeClass('fix-top')
            $('#pagepiling').removeClass('margin-manage');
        }
    }else {
        $('#home').removeClass('fixed-top')
        $('#home').removeClass('fix-top')
    }
});

$('.overlay-body').on('click', function(e) {
    $("#close_nav").removeClass("close_nav");
    $(".side_nav").removeClass("expand_nav");
    $("#my_tog").removeClass("close_nav");
    $("#close_nav").attr("id","my_tog");
    $(".overlay-body").removeClass('show_body_overlay');
});

/* =====================================
      Nav-Bar Offset
 ====================================== */

$(".broad .nav-menu .nav-link").on("click", function (event) {
    event.preventDefault();
    off_set= 65;
    if(screen.width > 768){
        off_set = 140;
    }
    $("html,body").animate({
        scrollTop: $(this.hash).offset().top - off_set}, 100);
});

/* ===================================
        Mouse parallax
 ====================================== */

if ($(window).width() > 991) {
    $('#home-banner').mousemove(function(e) {
        $('[data-depth]').each(function () {
            var depth = $(this).data('depth');
            var amountMovedX = (e.pageX * -depth/4);
            var amountMovedY = (e.pageY * -depth/4);

            $(this).css({
                'transform':'translate3d(' + amountMovedX +'px,' + amountMovedY +'px, 0)',
            });
        });
    });
}
