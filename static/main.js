/**
* Template Name: Tempo - v2.1.0
* Template URL: https://bootstrapmade.com/tempo-free-onepage-bootstrap-theme/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
!(function($) {
  "use strict";


  var PRODUCTIONURL = "https://instafakeprofile.herokuapp.com";
  var LOCALURL = "http://127.0.0.1:5000";

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

  function ProcessRawData(user,posts){

    var totalPosts = user.edge_owner_to_timeline_media.count;
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


    var numberOfPosts = posts.edges.length;

    var i,totalCaptionLength = 0,totalCaptionsPresent = 0,nonimagesPresent= 0, locationTags=0, hashtagCount=0, totalLocationTags =0, totalLikes=0,totalComments=0;
    var avgCaptionLength = 0, avgCaptionsPresent=0, avgLocationTags =0, avgHashtagCount =0,capLength, captionZero = 0, avgLocationTags =0, engagementRatioLikes=0, engagementRatioComments=0;
    var nonImagePosts =0, avgNonImagePosts = 0;

    if (numberOfPosts){
      for (i=0;i<numberOfPosts;i++){
        var caption = posts.edges[i].node.edge_media_to_caption.edges;
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
        if (posts.edges[i].node.location)
          totalLocationTags +=1;

        if(posts.edges[i].node.is_video)
          nonImagePosts+=1;

        totalLikes += posts.edges[i].node.edge_media_preview_like.count;
        totalComments += posts.edges[i].node.edge_media_to_comment.count;
      }

      avgCaptionLength = totalCaptionLength/(numberOfPosts)
      avgCaptionsPresent = totalCaptionsPresent/(numberOfPosts);
      avgLocationTags = totalLocationTags/(numberOfPosts);
      avgHashtagCount = hashtagCount/(numberOfPosts);
      engagementRatioLikes = (totalLikes*100)/(numberOfPosts*followers);
      engagementRatioComments = (totalComments*100)/(numberOfPosts*followers);
      avgNonImagePosts = nonImagePosts/numberOfPosts;

    }
    captionZero = 1 -avgCaptionsPresent;

    var jsondata = {posts: totalPosts, flr : followers, flw:following, bl:biographyLength,pic:profilePicAvailability,
     lin:externalLink, cl:avgCaptionLength, cz:captionZero, ni:avgNonImagePosts, erl:engagementRatioLikes, erc: engagementRatioComments, lt:avgLocationTags, hc:avgHashtagCount};
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
        //default image
        $("#insta-profile").css("background", "url('static/img/bg2.png')");
        $('.positive-result').hide();
        $('.negative-result').hide();
        $('.private-result').hide();
        $('.loading-div').show("slow");

        var  url = "https://www.instagram.com/" + tc + "/?__a=1";
        $.ajax({url: url})
        .done(function( data ) {
          $("#insta-profile").show();
          if (typeof data.graphql === 'undefined'){
            alert("Too many requests !! Check after some time");
            return;
          }
          var user = data.graphql.user;
          $('html, body').animate({
              scrollTop: $("#insta-profile").offset().top-100
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
            $("#insta-profile").css("background", "url('static/img/private-img.png')");
            return
          }

          //verified users are real accounts
          if (user.is_verified){
            $('.loading-div').hide();
            $('.positive-result').show("slow");
            $("#insta-profile").css("background", "url('static/img/real-img.png')");
            return
          }

          var userid = data.logging_page_id.substring(12);
          //get posts of user
          url = 'https://instagram.com/graphql/query/?query_id=17888483320059182&variables={"id":"'+userid+'","first":100,"after":null}'
          $.ajax({url: url})
          .done(function( userposts ) {
              var processedData = ProcessRawData(user,userposts.data.user.edge_owner_to_timeline_media); 

            //Send data to server
            var serverurl = PRODUCTIONURL + '/predict';
            //var serverurl = LOCALURL + '/predict';
            $.ajax({ 
              type: "POST",
              url: serverurl, 
              dataType: "json",
              contentType: 'application/json',
              data: JSON.stringify(processedData),
            })
            .done(function( data ) {
              $('.loading-div').hide("slow");
              if (data[0]===1){
                $("#insta-profile").css("background", "url('static/img/real-img.png')");
                $('.positive-result').show("slow");
              }
              else{
                $("#insta-profile").css("background", "url('static/img/fake-img.png')");
                $('.negative-result').show("slow");
              }
          });

            });


          
        });
        return false;
      }
  }); 


})(jQuery);