// var points = document.getElementsByClassName('point');
 var animatePoints = function() {

               // var points = document.getElementsByClassName('point');
 var revealPoint =function() {
         $(this).css({
             opacity: 1, 
             transform: 'ScaleX(1) translateY(0)'
             
         });
     };
      $.each($('.point'), revealPoint);       
 };

// var revealPoint = function(ind) {
//                   points[ind].style.opacity = 1;
//                   points[ind].style.transform = "scaleX(1) translateY(0)";
//                   points[ind].style.msTransform = "scaleX(1) translateY(0)";
//                   points[ind].style.WebkitTransform = "scaleX(1) translateY(0)";
//               };



//      for (var i = 0; i<points.length; i++) {
//
//        revealPoint(i);
//
//      }

$(window).load(function() { 
    if ($(window).height > 950) {
        animatePoints();
    }

var scrollDistance = $('.selling-points').offset().top - $(window).height() + 200;

  $(window).scroll(function(event){  
        if ($(window).scrollTop() >= scrollDistance) {
            animatePoints();
        }
    });
});
