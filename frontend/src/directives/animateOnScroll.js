export default {
  mounted(el, binding) {
    const delay = binding.value?.delay || 0

    el.style.opacity = '0'
    el.style.transform = 'translateY(16px)'
    el.style.transition = `opacity 0.3s ease ${delay}ms, transform 0.3s ease ${delay}ms`

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'

          // Remove inline styles after animation completes
          setTimeout(() => {
            el.style.transition = ''
            el.style.transform = ''
            el.style.opacity = ''
          }, delay + 300)

          observer.unobserve(el)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px 80px 0px' }
    )

    observer.observe(el)
  },
}
