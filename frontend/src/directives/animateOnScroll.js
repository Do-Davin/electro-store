export default {
  mounted(el, binding) {
    const delay = binding.value?.delay || 0

    el.style.opacity = '0'
    el.style.transform = 'translateY(24px)'
    el.style.transition = `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'

          // Remove delay after animation
          setTimeout(() => {
            el.style.transition = ''
            el.style.transform = ''
            el.style.opacity = ''
          }, delay + 500)

          observer.unobserve(el)
        }
      },
      { threshold: 0.50 }
    )

    observer.observe(el)
  },
}
