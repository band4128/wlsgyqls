// 슬라이드
document.addEventListener("DOMContentLoaded", (event) => {
  let currentIndex = 0;
  const slides = document.querySelectorAll(".slide");
  const totalSlides = slides.length;

  function showSlide(index) {
    const slider = document.querySelector(".slider");
    const slideWidth = slides[0].clientWidth;
    slider.style.transform = `translateX(-${index * slideWidth}px)`;
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    showSlide(currentIndex);
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    showSlide(currentIndex);
  }

  function goToSlide(index) {
    currentIndex = index;
    showSlide(currentIndex);
  }

  setInterval(nextSlide, 3000);
});

// 스크롤 내릴 시 header도 같이 내려가는 코드
document.addEventListener("DOMContentLoaded", function () {
  var header = document.getElementById("header");
  var originalHeight = header.offsetHeight;
  

  window.addEventListener("scroll", function () {
    if (window.scrollY > 0) {
      header.style.position = "fixed";
      header.style.top = "0";
      header.style.left = "0";
      header.style.width = "100%";
      header.style.height = originalHeight + "px";
    } else {
      header.style.position = "relative";
      header.style.height = originalHeight + "px";
    }
  });
});

// 스크롤에 따라 부드러운 애니메이션
document.addEventListener("DOMContentLoaded", function () {
  const textContainer = document.querySelector(".text-container");
  const session2 = document.querySelector(".session2");
  const h3Elements = document.querySelectorAll(".session2 h3");
  const text4 = document.querySelector("input");
  const text2 = document.querySelector(".text2");

  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const session2Top = session2.offsetTop;
    const session2Height = session2.offsetHeight;

    // session2가 화면에 나타날 때 애니메이션 효과 부여
    if (
      scrollTop + windowHeight > session2Top &&
      scrollTop < session2Top + session2Height
    ) {
      // 텍스트 컨테이너와 버튼 애니메이션
      textContainer.style.opacity = "1";
      textContainer.style.transform = "translate(-50%, -50%)"; // 중앙 정렬
      
      // 각 h3 요소 애니메이션
      h3Elements.forEach((h3, index) => {
        h3.style.opacity = "1";
        h3.style.transform = "translateY(0)";
      });
    } else {
      // session2가 화면에서 벗어나면 애니메이션 효과 제거
      // textContainer와 버튼 애니메이션 제거
      textContainer.style.opacity = "0";
      textContainer.style.transform = "translate(-50%, -50%) translateY(50px)";

      // 각 h3 요소 애니메이션 제거
      h3Elements.forEach((h3) => {
        h3.style.opacity = "0";
        h3.style.transform = "translateY(50px)";
      });
    }
  }

  // 스크롤 이벤트 리스너 등록
  window.addEventListener("scroll", handleScroll);
});
