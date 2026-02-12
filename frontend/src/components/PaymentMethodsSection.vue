<script setup>
  import { Lock } from 'lucide-vue-next';
  import { h } from 'vue';

  const VisaIcon = () => h('svg', {
    viewBox: '0 0 152 50',
    class: 'h-10 w-auto',
    xmlns: 'http://www.w3.org/2000/svg'
  }, [
    h('rect', { width: '152', height: '50', rx: '8', fill: '#1434CB' }),
    h('text', {
      x: '76',
      y: '33',
      'font-family': 'Arial, sans-serif',
      'font-size': '24',
      'font-weight': 'bold',
      fill: '#FFFFFF',
      'text-anchor': 'middle'
    }, 'VISA')
  ]);

  const MasterCardIcon = () => h('svg', {
    viewBox: '0 0 180 50',
    class: 'h-10 w-auto',
    xmlns: 'http://www.w3.org/2000/svg'
  }, [
    h('rect', { width: '180', height: '50', rx: '8', fill: '#1A1F36' }),
    h('circle', { cx: '66', cy: '25', r: '15', fill: '#EB001B' }),
    h('circle', { cx: '88', cy: '25', r: '15', fill: '#F79E1B' }),
    h('path', {
      d: 'M77 13.4a14.93 14.93 0 0 0 0 23.2 14.93 14.93 0 0 0 0-23.2z',
      fill: '#FF5F00'
    }),
    h('text', {
      x: '140',
      y: '29',
      'font-family': 'Arial, sans-serif',
      'font-size': '11',
      'font-weight': '600',
      fill: '#FFFFFF',
      'text-anchor': 'middle'
    }, 'mastercard')
  ]);

  const KhQrIcon = () => h('svg', {
    viewBox: '0 0 152 50',
    class: 'h-10 w-auto',
    xmlns: 'http://www.w3.org/2000/svg'
  }, [
    h('rect', { width: '152', height: '50', rx: '8', fill: '#E41E26' }),
    h('text', {
      x: '76',
      y: '33',
      'font-family': 'Arial, sans-serif',
      'font-size': '20',
      'font-weight': 'bold',
      fill: '#FFFFFF',
      'text-anchor': 'middle'
    }, 'KHQR')
  ]);

  const ApplePayIcon = () => h('svg', {
    viewBox: '0 0 152 50',
    class: 'h-10 w-auto',
    xmlns: 'http://www.w3.org/2000/svg'
  }, [
    h('rect', { width: '152', height: '50', rx: '8', fill: '#1A1F36' }),
    h('g', { transform: 'translate(30, 8) scale(0.7)', fill: '#FFFFFF' }, [
      h('path', {
        d: 'M19.1 10.6c-1.1 1.3-2.8 2.3-4.5 2.1-.2-1.7.6-3.5 1.6-4.6 1.1-1.3 3-2.2 4.4-2.2.2 1.8-.5 3.5-1.5 4.7zm1.5 2.4c-2.5-.1-4.6 1.4-5.8 1.4-1.2 0-3-1.4-5-1.3-2.6.1-4.9 1.5-6.2 3.8-2.7 4.6-.7 11.4 1.9 15.2 1.3 1.9 2.8 3.9 4.8 3.9 1.9-.1 2.7-1.2 5-1.2 2.3 0 3 1.2 5 1.2 2.1 0 3.4-1.9 4.7-3.8 1.5-2.2 2.1-4.3 2.1-4.4 0-.1-4.1-1.6-4.1-6.1 0-3.8 3.1-5.6 3.2-5.7-1.7-2.6-4.4-2.9-5.3-3h-.3z'
      })
    ]),
    h('text', {
      x: '93',
      y: '32',
      'font-family': 'Arial, sans-serif',
      'font-size': '18',
      'font-weight': '600',
      fill: '#FFFFFF',
      'text-anchor': 'middle'
    }, 'Pay')
  ]);

  const payments = [
    { name: "Visa", icon: VisaIcon },
    { name: "MasterCard", icon: MasterCardIcon },
    { name: "KhQr", icon: KhQrIcon },
    { name: "Apple Pay", icon: ApplePayIcon },
  ]
</script>

<template>
  <section class="w-full py-16 bg-white dark:bg-[#000000]">
    <div class="max-w-6xl mx-auto px-6">

      <h2 class="text-3xl font-bold text-primary text-center mb-6">
        Secure & Convenient Payment Methods
      </h2>

      <p class="text-center text-secondary mb-10">
        We support trusted global payment gateways to
        ensure safe and seamless checkout.
      </p>

      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
      >
        <div
          v-for="(item, i) in payments"
          :key="i"
          class="flex flex-col items-center justify-center border rounded-xl p-6
                 bg-white dark:bg-[#111111]
                 shadow-md transition-all duration-300 ease-out
                 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]
                 hover:-translate-y-1 hover:scale-[1.02]
                 hover:border-primary/50 hover:bg-white/90
                 dark:hover:bg-[#1a1a1a]"
        >
          <div class="h-10 mb-3 flex items-center justify-center">
            <component :is="item.icon" />
          </div>
          <span class="font-semibold text-gray-800 dark:text-white">
            {{ item.name }}
          </span>
        </div>
      </div>

      <p class="text-center mt-8 text-sm text-gray-500 dark:text-gray-300 flex items-center justify-center gap-2">
        <Lock class="text-primary w-4 h-4" />
        <span>Your payment information is encrypted and protected.</span>
      </p>

    </div>
  </section>
</template>
