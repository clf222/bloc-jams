//Refactor the individual style calls of the landing.js script to be a single function named revealPoint that:
//takes a single argument: the index of the points class node element, and
//gets called in a for loop.

 var points = document.getElementsByClassName('point');
 var revealPoint = function(ind) {
                   points[ind].style.opacity = 1;
                   points[ind].style.transform = "scaleX(1) translateY(0)";
                   points[ind].style.msTransform = "scaleX(1) translateY(0)";
                   points[ind].style.WebkitTransform = "scaleX(1) translateY(0)";
               };
               
    

   
      for (i = 0; i<points.length; i++) {  
        revealPoint(i);
      
      } 
              

            
