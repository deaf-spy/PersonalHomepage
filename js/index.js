// MAIN JAVASCRIPT FOR MY PERSONAL WEBSITE
//
//
// 

var r;
var rs;
var ugly = 0;
var color = 0;
var currentTop = 0;
var Xposition = 0;

var myname1 = document.querySelector(".chessboard1");
var myname2 = document.querySelector(".connect4boardwrapper");


const divs = ["chess", "welcome", "connect4"];
var currentDiv = 0;

// ADDS CHESSBOARDFOCUSER TO FOCUS ON CHESSBOARD/CONNECT4BOARD WHEN HOVERED
myname1.addEventListener("mouseenter", chessboardFocuser);
myname1.addEventListener("mouseleave", unChessboardFocuser);

myname2.addEventListener("mouseenter", connect4Focuser);
myname2.addEventListener("mouseleave", unConnect4Focuser);

function chessboardFocuser() {
  $('.chessboard1').removeClass('hidden');
  // $('#chessboard1').css('z-index', '5');
  $('.myname').addClass('hidden');
}

function unChessboardFocuser() {
  $('.chessboard1').addClass('hidden');
  // $('#chessboard1').css('z-index', '0');
  
  // $('.myname').removeClass('hidden');
  
  
}


function connect4Focuser() {
  // $('#chessboard1').removeClass('hidden');
  // $('#chessboard1').css('z-index', '5');
  $('.myname').addClass('hidden');
}

function unConnect4Focuser() {
  // $('#chessboard1').addClass('hidden');
  // $('#chessboard1').css('z-index', '0');
  // $('.myname').removeClass('hidden');
}


// STORES USER'S PREFERENCE OF LIGHT/DARK MODE 

function colorer() {
  localStorage.color = Number(!(Number(localStorage.color)));
  //console.log(Number(localStorage.color));
}

if (Number(localStorage.color)) {
  switcher();

  //console.log("Hi");
}


// UTILITY TO SWITCH COLORS AND ADD/REMOVE CLASSES WHEN CHANGING LIGHT/DARK MODE

switcher();

function switcher() {

  ugly += 1;
  if (ugly % 2 == 1) {
    $(".text").removeClass("hidden");
    $(".text2").addClass("hidden");
    $(".fas").removeClass("fa-sun");
    $(".fas").addClass("fa-moon");
    $(".logo").removeClass("filtered");
    $(".overlay1").css('opacity', 'var(--lightModeOpacity)');
  } else {
    $(".text2").removeClass("hidden");
    $(".text").addClass("hidden");
    $(".fas").removeClass("fa-moon");
    $(".fas").addClass("fa-sun");
    $(".logo").addClass("filtered");
    $(".overlay1").css('opacity', 'var(--darkModeOpacity)');

  }

  r = document.querySelector(':root');
  rs = getComputedStyle(r);
  if (rs.getPropertyValue('--background-color') == '#fdf6e3') {
    r.style.setProperty('--background-color', '#002b36');
  } else {
    r.style.setProperty('--background-color', '#fdf6e3');
  }
  if (rs.getPropertyValue('--color') == '#002b36') {
    r.style.setProperty('--color', '#fdf6e3');
  } else {
    r.style.setProperty('--color', '#002b36');
  }
  if (rs.getPropertyValue('--white') == '#000000') {
    r.style.setProperty('--white', '#FFFFFF');
  } else {
    r.style.setProperty('--white', '#000000');
  }
  if (rs.getPropertyValue('--black') == '#FFFFFF') {
    r.style.setProperty('--black', '#000000');
  } else {
    r.style.setProperty('--black', '#FFFFFF');
  }

}


function textswitcher() {
  s = document.querySelector('');
}


// CHEATCODE HACK TO SWITCH

$(document).keypress(function(event) {
        if (ugly == 0) {

        }
        cheatcode_cache += 47 < event.which && event.which < 123 ? event.key : "" ;
        if (cheatcode_cache.indexOf("s") != -1) {
            cheatcode_cache = "";
            switcher();
            

        }
});


// INITIAL WEBSITE TRANSITIONS

$(".navbar").removeClass("hidden");
// $(".scrolldown").removeClass("hidden");
r.style.setProperty('--delay', '1s');

var jpgFiles = [1, 2, 8];
var extension = ".png";
var overlaynumber = Math.floor(Math.random()*9);
for (let i = 0; i < jpgFiles.length; i++) {
  if (overlaynumber == jpgFiles[i]) {
    extension = ".jpg";
  }
  
}
var link = '../img/ol/lol/ol'.concat(overlaynumber).concat(extension);
// var link = '../img/ol/lol/ol8.jpg';
// var link = '../img/ol/lol2/ol'.concat(overlaynumber).concat('.png');

// console.log(overlaynumber);
// console.log(link);
// console.log(`url(${link})`);

$('.overlay1').css('background-image', `url(${link})`);

$('.overlay1').removeClass('hidden');
$('.bg1').removeClass('hidden');


if ($(window).scrollTop() == 0) {

  $(".myname").removeClass('hidden');
}

// if (Xposition > 1600) {
//   $("#left").removeClass('hidden');
// } else {
//   $("#left").addClass('hidden');
// }

// if (Xposition < 3520) {
//   $("#right").removeClass('hidden');
// } else {
//   $("#right").addClass('hidden');
// }

// function getScrollPosition() {
//   var ContainerElement = document.getElementById("innerwrapper");
//   var x = ContainerElement.scrollLeft;
//   var y = ContainerElement.scrollTop;
//   console.log(x); // scroll position from Left
//   console.log(y); // scroll position from top
// }


// $(window).scroll(function() {
//   console.log($('.innerwrapper').scrollLeft);

//   // scrollFunction();
//   // console.log(currentTop);
  

//   if ($(window).scrollTop() != $(document).height()) {

//     $(".myname").removeClass('hidden');
//   }
//   // var top2 = $(this).scrollTop();
//   // if (top2 <= 300) {
//   //   $('.myname').removeClass('hidden');
//   // } else{
//   //   $('.myname').addClass('hidden');
    
//   // }
// });

var scrollContainer = document.querySelector("#outerwrapper");

scrollContainer.addEventListener("wheel", function(e) {
  
  // $(".myname").removeClass('hidden');

  // console.log($('#innerwrapper').width());

  // if ((Xposition <= 0 && e.deltaY < 0) || (Xposition >= ($('#innerwrapper').width()))) {

  // } else {
  //   Xposition += e.deltaY;
  // }

  // if (Xposition <= 1600) {
  //   $("#left").addClass('hidden');
  // } else {
  //   $("#left").removeClass('hidden');
  // }

  // if (Xposition < 3520) {
  //   $("#right").removeClass('hidden');
  // } else {
  //   $("#right").addClass('hidden');
  // }
  
  
  // console.log(Xposition);

  // scrollFunction(Xposition);

});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

  anchor.addEventListener('click', function (e) {

      // e.preventDefault();

      document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
      });
  });
});

// function scrollFunction(Xposition) {
//   // var top1 = $(window).scrollTop() + 50;
//   for (let i = 0; i < divs.length; i++) {
//     console.log($("#" + divs[i]), $("#" + divs[i]).position()["left"]);

//     if(Xposition > $("#" + divs[i]).position()["top"]) {
//       currentTop = i;
//     }
    
//   }



//   // if(currentTop == divs.length - 1) {
//   //   $('#left').addClass('hidden');
//   // } else {
//   //   $('#left').removeClass('hidden');
//   // }

//   // if(currentTop == 0) {
//   //   $('#right').addClass('hidden');
//   // } else {
//   //   $('#right').removeClass('hidden');
//   // }
// }

$('.myname').addClass('lol');

function shadowTimer() {
  $('.myname').addClass('lol2');
}

window.setTimeout(shadowTimer, 500);


// UTILITIES FOR MOVING LEFT AND RIGHT

// function moveLeft() {
//   console.log(currentDiv);
//   currentDiv -= 1;
//   if (currentDiv) {
//     $('#left').addClass('hidden');
//   } else {
//     $('#left').removeClass('hidden');
    
//   }
  
//   var link = $('#left');
//   link.attr('href', '#' + divs[currentDiv]);

  
// }

// function moveRight() {
//   // console.log(currentTop);
//   // // console.log(divs.length);
//   // var thing = (currentTop - 1) % divs.length;
//   // console.log(thing);
//   // location.href='#'+divs[thing];

//   console.log(currentDiv);
//   currentDiv += 1;
//   if (currentDiv + 1 == divs.length) {
//     $('#right').addClass('hidden');
//   } else {
//     $('#right').removeClass('hidden');
    
//   }
  
//   var link = $('#right');
//   link.attr('href', '#' + divs[currentDiv]);

// }




