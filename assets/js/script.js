// ---------------------------------------------- AOS Animation ----------------------------------------------

AOS.init();


// ---------------------------------------------- Navbar Dropdown ----------------------------------------------

$('.nav--button').click(function () {
      $('body').toggleClass('nav--open');
});


// ---------------------------------------------- Process Section Parallax ----------------------------------------------

(function () {
      const section = document.getElementById('processScrollSection');
      const steps = document.querySelectorAll('.process-section__step');
      const descriptions = document.querySelectorAll('.process-section__description');
      const visualArc = document.querySelector('.process-section__arc');

      if (!section || steps.length === 0) return;

      let targetProgress = 0;
      let currentProgress = 0;
      const lerpFactor = 0.08;

      function getDynamicParams() {
            const width = window.innerWidth;

            const radiusFactor = width < 768 ? 1.0 : 0.85;
            const radius = width * radiusFactor;

            const angleRange = width < 768 ? 180 : 200;

            return { radius, angleRange };
      }

      function updateVisualArc(radius) {
            if (!visualArc) return;
            const diameter = radius * 2;
            visualArc.style.width = `${diameter}px`;
            visualArc.style.height = `${diameter}px`;
            visualArc.style.left = '50%';
            visualArc.style.transform = `translateX(-50%)`;
            visualArc.style.top = '0';

            visualArc.style.opacity = '1';
      }

      function render(progress) {
            const { radius, angleRange } = getDynamicParams();
            updateVisualArc(radius);

            const numSteps = steps.length;

            steps.forEach((step, index) => {
                  let localProgress = (progress * (numSteps - 1)) - index;

                  const angle = -localProgress * (angleRange / (numSteps - 1));
                  const radians = (angle - 90) * (Math.PI / 180);

                  const x = radius * Math.cos(radians);
                  const y = radius * Math.sin(radians) + radius;

                  step.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;

                  if (localProgress > -0.5 && localProgress < 0.5) {
                        step.classList.add('active');
                        if (descriptions[index]) descriptions[index].classList.add('active');
                  } else {
                        step.classList.remove('active');
                        if (descriptions[index]) descriptions[index].classList.remove('active');
                  }
            });
      }

      function update() {
            const diff = targetProgress - currentProgress;

            // Apply lerp
            if (Math.abs(diff) > 0.0001) {
                  currentProgress += diff * lerpFactor;
                  render(currentProgress);
            }

            requestAnimationFrame(update);
      }

      function handleScroll() {
            const rect = section.getBoundingClientRect();
            const sectionHeight = section.offsetHeight;
            const stickyHeight = window.innerHeight;

            const headerContainer = section.querySelector('.container');
            const headerHeight = headerContainer ? headerContainer.offsetHeight + 100 : 200;

            let progress = (-rect.top - headerHeight) / (sectionHeight - stickyHeight - headerHeight);
            targetProgress = Math.max(0, Math.min(1, progress));

            if (currentProgress === 0 && targetProgress !== 0) {
                  currentProgress = targetProgress;
            }
      }

      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', () => {
            handleScroll();
            render(currentProgress);
      });

      handleScroll();
      currentProgress = targetProgress;
      render(currentProgress);

      requestAnimationFrame(update);
})();


// ---------------------------------------------- Featured Works Slider ----------------------------------------------

$(document).ready(function () {
      $('.featured-works__slider').slick({
            dots: true,
            infinite: false,
            speed: 800,
            slidesToShow: 1,
            slidesToScroll: 1,
            prevArrow: $('.featured-works__arrow--prev'),
            nextArrow: $('.featured-works__arrow--next'),
            appendDots: $('.featured-works__dots-container'),
            autoplay: false,
            autoplaySpeed: 5000,
            pauseOnHover: false,
            responsive: [
                  {
                        breakpoint: 1240,
                        settings: {
                              slidesToShow: 1.3,
                              slidesToScroll: 1,
                              infinite: false
                        }
                  },
                  {
                        breakpoint: 992,
                        settings: "unslick"
                  }
            ]
      });
});


// ---------------------------------------------- Testimonials Slider ----------------------------------------------

$(document).ready(function () {
      var $testimonialsSlider = $('.testimonials__slider');
      var $current = $('.testimonials__current');
      var $total = $('.testimonials__total');

      $testimonialsSlider.on('init reInit', function (event, slick) {
            var i = 1;
            $current.text('01');
            $total.text(slick.slideCount < 10 ? '0' + slick.slideCount : slick.slideCount);
            $testimonialsSlider.addClass('is-first-slide');
      });

      $testimonialsSlider.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
            var i = nextSlide + 1;
            $current.text(i < 10 ? '0' + i : i);

            if (nextSlide === 0) {
                  $testimonialsSlider.addClass('is-first-slide');
            } else {
                  $testimonialsSlider.removeClass('is-first-slide');
            }
      });

      $testimonialsSlider.slick({
            dots: false,
            infinite: false,
            speed: 800,
            slidesToShow: 1,
            slidesToScroll: 1,
            prevArrow: $('.testimonials__arrow--prev'),
            nextArrow: $('.testimonials__arrow--next'),
            autoplay: false,
            autoplaySpeed: 6000,
            pauseOnHover: false,
            responsive: [
                  {
                        breakpoint: 1240,
                        settings: {
                              variableWidth: true,
                              centerMode: true
                        }
                  },
                  {
                        breakpoint: 992,
                        settings: "unslick"
                  }
            ]
      });
});


// ---------------------------------------------- Header Scroll Logic ----------------------------------------------

(function () {
      const header = document.querySelector('header');
      if (!header) return;

      let lastScrollTop = 0;
      const threshold = 100;

      window.addEventListener('scroll', function () {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Downward scroll
            if (scrollTop > lastScrollTop && scrollTop > threshold) {
                  header.classList.remove('header-up');
                  header.classList.add('header-sticky');
            }
            // Upward scroll
            else if (scrollTop < lastScrollTop) {
                  if (scrollTop > threshold) {
                        header.classList.add('header-up');
                        header.classList.add('header-sticky');
                  } else {
                        header.classList.remove('header-up');
                        header.classList.remove('header-sticky');
                  }
            }

            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
      }, false);
})();


// ---------------------------------------------- Achievements section counter animation ----------------------------------------------

(function () {
      var counters = document.querySelectorAll('.achievements-section__counter-number');
      var animationFrames = {};
      var animatingNow = false;

      function resetCounter(element) {
            var suffix = element.getAttribute('data-suffix') || '';
            element.textContent = '0' + suffix;
            if (animationFrames[element]) {
                  cancelAnimationFrame(animationFrames[element]);
                  animationFrames[element] = null;
            }
      }

      function animateCounter(element) {
            var target = parseFloat(element.getAttribute('data-counter'));
            var suffix = element.getAttribute('data-suffix') || '';
            var duration = 2200;
            var startTime = null;

            function updateCounter(timestamp) {
                  if (!startTime) startTime = timestamp;
                  var elapsed = timestamp - startTime;
                  var progress = Math.min(elapsed / duration, 1);
                  var easeOut = 1 - Math.pow(1 - progress, 3);
                  var current = Math.floor(0 + (target - 0) * easeOut);
                  element.textContent = current + suffix;
                  if (progress < 1) {
                        animationFrames[element] = requestAnimationFrame(updateCounter);
                  } else {
                        element.textContent = target + suffix;
                        animationFrames[element] = null;
                  }
            }
            animationFrames[element] = requestAnimationFrame(updateCounter);
      }

      function runAnimation() {
            if (animatingNow) return;
            animatingNow = true;
            counters.forEach(resetCounter);
            setTimeout(function () {
                  counters.forEach(animateCounter);
                  setTimeout(function () {
                        animatingNow = false;
                  }, 2400);
            }, 50);
      }

      function handleIntersection(entries) {
            entries.forEach(function (entry) {
                  if (entry.isIntersecting) {
                        runAnimation();
                  }
            });
      }

      if (counters.length > 0) {
            var section = document.querySelector('.achievements-section');
            if (section) {
                  var observer = new IntersectionObserver(handleIntersection, {
                        threshold: 0.1,
                        rootMargin: '100px 0px'
                  });
                  observer.observe(section);
            }
      }
})();


// ---------------------------------------------- Project Section Accordion ----------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
      const headers = document.querySelectorAll(
            ".services-accordion__item, .faq-accordion__item"
      );

      headers.forEach(function (header) {
            header.addEventListener("click", function () {
                  // Toggle for services accordion
                  const parentServices = this.closest(".services-accordion__item");
                  if (parentServices) {
                        parentServices.classList.toggle("is-open");
                  }

                  // Toggle for FAQ accordion
                  const parentFaq = this.closest(".faq-accordion__item");
                  if (parentFaq) {
                        parentFaq.classList.toggle("is-open");
                  }
            });
      });
});


// ---------------------------------------------- BUILDAXA Footer Text ----------------------------------------------

function fitText() {
      const el = document.querySelector('.footer-brand');
      if (!el) return;

      const parentWidth = el.parentElement.offsetWidth;

      if (window.matchMedia('(max-width: 480px)').matches) {
            el.style.fontSize = (window.innerWidth / 5.67) + "px";
      } else if (window.matchMedia('(max-width: 575px)').matches) {
            el.style.fontSize = (parentWidth / 5.37) + "px";
      } else if (window.matchMedia('(max-width: 767px)').matches) {
            el.style.fontSize = (parentWidth / 5.4) + "px";
      } else if (window.matchMedia('(max-width: 1024px)').matches) {
            el.style.fontSize = (parentWidth / 5.5) + "px";
      } else if (window.matchMedia('(max-width: 1240px)').matches) {
            el.style.fontSize = (parentWidth / 5.2) + "px";
      } else {
            el.style.fontSize = (parentWidth / 5.097) + "px";
      }
}

window.addEventListener('resize', fitText);
window.addEventListener('load', fitText);
