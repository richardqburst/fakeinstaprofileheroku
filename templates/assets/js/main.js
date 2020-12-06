/**
* Template Name: Tempo - v2.1.0
* Template URL: https://bootstrapmade.com/tempo-free-onepage-bootstrap-theme/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
!(function($) {
  "use strict";

  // Smooth scroll for the navigation menu and links with .scrollto classes
  var scrolltoOffset = $('#header').outerHeight() - 17;
  $(document).on('click', '.nav-menu a, .mobile-nav a, .scrollto', function(e) {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      if (target.length) {
        e.preventDefault();

        var scrollto = target.offset().top - scrolltoOffset;

        if ($(this).attr("href") == '#header') {
          scrollto = 0;
        }

        $('html, body').animate({
          scrollTop: scrollto
        }, 1500, 'easeInOutExpo');

        if ($(this).parents('.nav-menu, .mobile-nav').length) {
          $('.nav-menu .active, .mobile-nav .active').removeClass('active');
          $(this).closest('li').addClass('active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
          $('.mobile-nav-overly').fadeOut();
        }
        return false;
      }
    }
  });

  // Activate smooth scroll on page load with hash links in the url
  $(document).ready(function() {
    if (window.location.hash) {
      var initial_nav = window.location.hash;
      if ($(initial_nav).length) {
        var scrollto = $(initial_nav).offset().top - scrolltoOffset;
        $('html, body').animate({
          scrollTop: scrollto
        }, 1500, 'easeInOutExpo');
      }
    }
  });

  // Mobile Navigation
  if ($('.nav-menu').length) {
    var $mobile_nav = $('.nav-menu').clone().prop({
      class: 'mobile-nav d-lg-none'
    });
    $('body').append($mobile_nav);
    $('body').prepend('<button type="button" class="mobile-nav-toggle d-lg-none"><i class="icofont-navigation-menu"></i></button>');
    $('body').append('<div class="mobile-nav-overly"></div>');

    $(document).on('click', '.mobile-nav-toggle', function(e) {
      $('body').toggleClass('mobile-nav-active');
      $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
      $('.mobile-nav-overly').toggle();
    });

    $(document).on('click', '.mobile-nav .drop-down > a', function(e) {
      e.preventDefault();
      $(this).next().slideToggle(300);
      $(this).parent().toggleClass('active');
    });

    $(document).click(function(e) {
      var container = $(".mobile-nav, .mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
          $('.mobile-nav-overly').fadeOut();
        }
      }
    });
  } else if ($(".mobile-nav, .mobile-nav-toggle").length) {
    $(".mobile-nav, .mobile-nav-toggle").hide();
  }

  // Navigation active state on scroll
  var nav_sections = $('section');
  var main_nav = $('.nav-menu, .mobile-nav');

  $(window).on('scroll', function() {
    var cur_pos = $(this).scrollTop() + 200;

    nav_sections.each(function() {
      var top = $(this).offset().top,
        bottom = top + $(this).outerHeight();

      if (cur_pos >= top && cur_pos <= bottom) {
        if (cur_pos <= bottom) {
          main_nav.find('li').removeClass('active');
        }
        main_nav.find('a[href="#' + $(this).attr('id') + '"]').parent('li').addClass('active');
      }
      if (cur_pos < 300) {
        $(".nav-menu ul:first li:first").addClass('active');
      }
    });
  });

  // Toggle .header-scrolled class to #header when page is scrolled
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('#header').addClass('header-scrolled');
    } else {
      $('#header').removeClass('header-scrolled');
    }
  });

  if ($(window).scrollTop() > 100) {
    $('#header').addClass('header-scrolled');
  }

  // Back to top button
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });

  $('.back-to-top').click(function() {
    $('html, body').animate({
      scrollTop: 0
    }, 1500, 'easeInOutExpo');
    return false;
  });

  // Porfolio isotope and filter
  $(window).on('load', function() {
    var portfolioIsotope = $('.portfolio-container').isotope({
      itemSelector: '.portfolio-item',
      layoutMode: 'fitRows'
    });

    $('#portfolio-flters li').on('click', function() {
      $("#portfolio-flters li").removeClass('filter-active');
      $(this).addClass('filter-active');

      portfolioIsotope.isotope({
        filter: $(this).data('filter')
      });
    });

    // Initiate venobox (lightbox feature used in portofilo)
    $(document).ready(function() {
      $('.venobox').venobox();
    });
  });

  // Portfolio details carousel
  $(".portfolio-details-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    items: 1
  });

  function ProcessRawData(user){

    var totalPosts = user.edge_felix_video_timeline.count+user.edge_owner_to_timeline_media.count;
    var followers = user.edge_followed_by.count;
    var following = user.edge_follow.count;
    var biographyLength = user.biography.length;
    var profilePicAvailability = 0;
    if (user.profile_pic_url)
      profilePicAvailability=1;
    var externalLink = 0;
    //link can be given in both external link or as a tag in biography
    if (user.external_url || user.biography.split("@").length-1){
      externalLink=1;
    }


    var numberOfVideos = 0;
    var numberOfNonVideos = 0;
    if (user.edge_felix_video_timeline.count>=12){
      numberOfVideos = 12;
    }
    else
    {
      numberOfVideos = user.edge_felix_video_timeline.count
    }
    if (user.edge_owner_to_timeline_media.count>=12){
      numberOfNonVideos = 12;
    }
    else
    {
      numberOfNonVideos = user.edge_owner_to_timeline_media.count
    }
    var i,totalCaptionLength = 0,totalCaptionsPresent = 0,nonimagesPresent= 0, locationTags=0, hashtagCount=0, totalLocationTags =0, totalLikes=0,totalComments=0;
    var avgCaptionLength = 0, avgCaptionsPresent=0, avgLocationTags =0, avgHashtagCount =0,capLength, captionZero = 0, avgLocationTags =0, engagementRatioLikes=0, engagementRatioComments=0;

    if (totalPosts){
      //getting features from video content
      for (i=0;i<numberOfVideos;i++){
        var caption = user.edge_felix_video_timeline.edges[i].node.edge_media_to_caption.edges;
        if (caption.length){
          capLength = caption[0].node.text.length + user.edge_felix_video_timeline.edges[i].node.title.length;
          hashtagCount += caption[0].node.text.split("#").length-1 + user.edge_felix_video_timeline.edges[i].node.title.split("#").length-1;
        }
        else{
          capLength = user.edge_felix_video_timeline.edges[i].node.title.length;
          hashtagCount += user.edge_felix_video_timeline.edges[i].node.title.split("#").length-1;
        }
        totalCaptionLength += capLength;
        if (capLength>=4){
          totalCaptionsPresent+=1;
        }
        if (user.edge_felix_video_timeline.edges[i].node.location)
          totalLocationTags +=1;
        totalLikes += user.edge_felix_video_timeline.edges[i].node.edge_liked_by.count;
        totalComments += user.edge_felix_video_timeline.edges[i].node.edge_media_to_comment.count;
      }

      //getting data from other content
      for (i=0;i<numberOfNonVideos;i++){
        var caption = user.edge_owner_to_timeline_media.edges[i].node.edge_media_to_caption.edges;
        if (caption.length){
          capLength = caption[0].node.text.length;
          hashtagCount += caption[0].node.text.split("#").length-1;
        }
        else{
          capLength = 0;
          hashtagCount += 0;
        }
        totalCaptionLength += capLength;
        if (capLength>=4){
          totalCaptionsPresent+=1;
        }
        if (user.edge_owner_to_timeline_media.edges[i].node.location)
          totalLocationTags +=1;

        totalLikes += user.edge_owner_to_timeline_media.edges[i].node.edge_liked_by.count;
        totalComments += user.edge_owner_to_timeline_media.edges[i].node.edge_media_to_comment.count;
      }

      var computedPosts = numberOfVideos + numberOfNonVideos;
      avgCaptionLength = totalCaptionLength/(computedPosts)
      avgCaptionsPresent = totalCaptionsPresent/(computedPosts);
      avgLocationTags = totalLocationTags/(computedPosts);
      avgHashtagCount = hashtagCount/(computedPosts);
      engagementRatioLikes = (totalLikes*100)/(computedPosts*followers);
      engagementRatioComments = (totalComments*100)/(computedPosts*followers);

    }
    captionZero = 1 -avgCaptionsPresent;
    //check
    var nonImagePosts =  1 - (user.edge_owner_to_timeline_media.count/totalPosts);

    var jsondata = {posts: totalPosts, flr : followers, flw:following, bl:biographyLength,pic:profilePicAvailability,
     lin:externalLink, cl:avgCaptionLength, cz:captionZero, ni:nonImagePosts, erl:engagementRatioLikes, erc: engagementRatioComments, lt:avgLocationTags, hc:avgHashtagCount};
    return jsondata;
  }


  //submit userid 
  $( ".form-submit-button" ).click(function() {
    var tc = $(this).closest("form").find("input[name='fname']").val();
    if (tc==""){
      alert("Enter a user id");      
      return false;
    }
    else
      {
        $('.positive-result').hide();
        $('.negative-result').hide();
        $('.private-result').hide();
        $('.loading-div').show("slow");

        var  url = "https://www.instagram.com/" + tc + "/?__a=1";
        $.ajax({url: url})
        .done(function( data ) {
          $("#insta-profile").show();
          if (typeof myVar !== 'undefined'){
            alert("Too many requests !! Check after some time");
            return;
          }
          var user = data.graphql.user;
          $('html, body').animate({
              scrollTop: $("#insta-profile").offset().top
           }, 2000);

          $("#account-pic").attr("src",user.profile_pic_url);
          $("#username").text(user.full_name);
          $("#num-posts").text(user.edge_felix_video_timeline.count+user.edge_owner_to_timeline_media.count);
          $("#followers-count").text(user.edge_followed_by.count);
          $("#following-count").text(user.edge_follow.count);

          //verify if profile is priivate
          if (user.is_private){
            $('.loading-div').hide();
            $('.private-result').show("slow");
            return
          }

          //verified users are real accounts
          if (user.is_verified){
            $('.loading-div').hide();
            $('.positive-result').show("slow");
            return
          }

          var processedData = ProcessRawData(user); 

          //Send data to server
          var serverurl = 'http://127.0.0.1:5000//predict';
          $.ajax({ 
            type: "POST",
            url: serverurl, 
            dataType: "json",
            contentType: 'application/json',
            data: JSON.stringify(processedData),
          })
          .done(function( data ) {
            $('.loading-div').hide("slow");
            if (data[0]===1)
              $('.positive-result').show("slow");
            else
              $('.negative-result').show("slow");
          });

        });
        return false;
      }
  }); 


})(jQuery);