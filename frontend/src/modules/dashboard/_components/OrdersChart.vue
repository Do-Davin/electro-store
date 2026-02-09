<template>
  <div class="orders-chart" ref="chartRoot">
    <div class="chart-header">
      <div class="header-left">
        <h3>Order Analytics</h3>
        <div v-if="!loading && dataPoints.length > 0" class="summary-stats">
          <span class="stat-item">
            <span class="stat-label">Total:</span>
            <strong>{{ totalOrders }}</strong>
          </span>
          <span class="stat-divider">•</span>
          <span class="stat-item">
            <span class="stat-label">Peak:</span>
            <strong>{{ maxCount }}</strong>
          </span>
          <span class="stat-divider">•</span>
          <span class="stat-item">
            <span class="stat-label">Avg:</span>
            <strong>{{ avgOrders }}</strong>
          </span>
        </div>
      </div>

      <!-- Interval dropdown -->
      <div class="interval-dropdown" ref="dropdownRef">
        <button class="interval-btn" @click="dropdownOpen = !dropdownOpen">
          {{ intervalLabel }}
          <ChevronDown :size="14" />
        </button>
        <Transition name="dropdown">
          <div v-if="dropdownOpen" class="interval-menu">
            <button
              v-for="opt in intervalOptions"
              :key="opt.value"
              :class="['interval-option', { active: interval === opt.value }]"
              @click="selectInterval(opt.value)"
            >
              {{ opt.label }}
            </button>
          </div>
        </Transition>
      </div>
    </div>

    <div v-if="loading" class="chart-loading">
      <Loader2 class="animate-spin" :size="24" />
      <span>Loading chart...</span>
    </div>

    <div v-else-if="dataPoints.length === 0" class="chart-empty">
      <span>No order data available</span>
    </div>

    <div
      v-else
      class="chart-body"
      ref="scrollRef"
      @mousemove="onMouseMove"
      @mouseleave="onMouseLeave"
    >
      <svg
        :viewBox="`0 0 ${svgWidth} ${height}`"
        :width="svgWidth"
        :height="height"
        class="chart-svg"
        ref="svgRef"
      >
        <defs>
          <linearGradient id="areaGradientV" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="rgba(59, 130, 246, 0.3)" />
            <stop offset="100%" stop-color="rgba(59, 130, 246, 0.02)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <!-- Horizontal grid lines -->
        <line
          v-for="tick in yTicks"
          :key="'grid-' + tick"
          :x1="padding.left"
          :y1="yScale(tick)"
          :x2="svgWidth - padding.right"
          :y2="yScale(tick)"
          stroke="rgba(255,255,255,0.08)"
          stroke-width="1"
          stroke-dasharray="4,4"
        />

        <!-- Y-axis labels -->
        <text
          v-for="tick in yTicks"
          :key="'ylabel-' + tick"
          :x="padding.left - 12"
          :y="yScale(tick) + 4"
          text-anchor="end"
          fill="rgba(255,255,255,0.5)"
          font-size="12"
          font-weight="500"
          font-family="system-ui, -apple-system, sans-serif"
        >
          {{ tick }}
        </text>

        <!-- Area fill -->
        <path :d="areaPath" fill="url(#areaGradientV)" opacity="0.6" />

        <!-- Line -->
        <path
          :d="linePath"
          fill="none"
          stroke="rgb(59, 130, 246)"
          stroke-width="2.5"
          stroke-linejoin="round"
          stroke-linecap="round"
        />

        <!-- Data point dots -->
        <circle
          v-for="(pt, i) in controlPoints"
          :key="'dot-' + i"
          :cx="pt.x"
          :cy="pt.y"
          r="3"
          fill="white"
          stroke="rgb(59, 130, 246)"
          stroke-width="2"
          class="data-dot"
          :class="{ 'data-dot-hover': hoverIndex === i }"
        />

        <!-- Hover vertical line -->
        <line
          class="hover-el"
          :class="{ visible: hoverIndex >= 0 }"
          :x1="hoverX"
          :y1="padding.top"
          :x2="hoverX"
          :y2="height - padding.bottom"
          stroke="rgba(255,255,255,0.3)"
          stroke-width="1.5"
          stroke-dasharray="4,4"
        />

        <!-- Hover dot with glow -->
        <circle
          class="hover-el"
          :class="{ visible: hoverIndex >= 0 }"
          :cx="hoverX"
          :cy="hoverY"
          r="6"
          fill="rgb(59, 130, 246)"
          filter="url(#glow)"
        />
        <circle
          class="hover-el"
          :class="{ visible: hoverIndex >= 0 }"
          :cx="hoverX"
          :cy="hoverY"
          r="3"
          fill="white"
        />

        <!-- X-axis labels -->
        <text
          v-for="(label, i) in xLabels"
          :key="'xlabel-' + i"
          :x="label.x"
          :y="height - 10"
          text-anchor="middle"
          fill="rgba(255,255,255,0.5)"
          font-size="11"
          font-weight="500"
          font-family="system-ui, -apple-system, sans-serif"
        >
          {{ label.text }}
        </text>
      </svg>
    </div>

    <!-- Tooltip: outside scroll container, uses position:fixed -->
    <div
      class="chart-tooltip"
      :class="{ visible: hoverIndex >= 0 && tooltipData }"
      :style="tooltipStyle"
    >
      <div class="tooltip-date">{{ tooltipData?.label }}</div>
      <div class="tooltip-value">
        <span class="tooltip-dot"></span>
        <strong>{{ tooltipData?.count }}</strong>
        <span class="tooltip-unit">{{ tooltipData?.count === 1 ? 'order' : 'orders' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { Loader2, ChevronDown } from 'lucide-vue-next'
import axios from '@/lib/axios'

const loading = ref(true)
const allOrders = ref([])

// ─── Chart dimensions ───
const height = 340
const padding = { top: 20, right: 24, bottom: 36, left: 52 }
const MIN_POINT_SPACING = 70
const MIN_SVG_WIDTH = 800

const svgWidth = computed(() => {
  const n = dataPoints.value.length
  if (n <= 1) return MIN_SVG_WIDTH
  const needed = padding.left + padding.right + (n - 1) * MIN_POINT_SPACING
  return Math.max(MIN_SVG_WIDTH, needed)
})

// ─── Interval state ───
const interval = ref('day')
const dropdownOpen = ref(false)
const dropdownRef = ref(null)

const intervalOptions = [
  { value: 'hour', label: '1 Hour' },
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
]

const intervalLabel = computed(() =>
  intervalOptions.find(o => o.value === interval.value)?.label || 'Day'
)

function selectInterval(val) {
  interval.value = val
  dropdownOpen.value = false
}

function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    dropdownOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))

// ─── Hover state ───
const hoverIndex = ref(-1)
const svgRef = ref(null)
const scrollRef = ref(null)
const chartRoot = ref(null)
// Store tooltip viewport coords directly in mousemove for accuracy
const tipX = ref(0)
const tipY = ref(0)
// Cache last hover positions for smooth fade-out
const lastHoverX = ref(padding.left)
const lastHoverY = ref(height / 2)

const hoverX = computed(() => {
  if (hoverIndex.value < 0) return lastHoverX.value
  return xScale(hoverIndex.value)
})

const hoverY = computed(() => {
  if (hoverIndex.value < 0 || !dataPoints.value[hoverIndex.value]) return lastHoverY.value
  return yScale(dataPoints.value[hoverIndex.value].count)
})

watch([hoverX, hoverY], ([x, y]) => {
  if (hoverIndex.value >= 0) {
    lastHoverX.value = x
    lastHoverY.value = y
  }
})

function onMouseMove(e) {
  if (!svgRef.value || dataPoints.value.length === 0) return

  const svgRect = svgRef.value.getBoundingClientRect()
  const scaleX = svgWidth.value / svgRect.width
  const mouseX = (e.clientX - svgRect.left) * scaleX

  // Find nearest data point
  let nearest = 0
  let minDist = Infinity
  for (let i = 0; i < dataPoints.value.length; i++) {
    const dist = Math.abs(xScale(i) - mouseX)
    if (dist < minDist) {
      minDist = dist
      nearest = i
    }
  }

  if (mouseX >= padding.left - 30 && mouseX <= svgWidth.value - padding.right + 30) {
    hoverIndex.value = nearest

    // Compute viewport pixel position of the data point
    const ptX = xScale(nearest)
    const ptY = yScale(dataPoints.value[nearest].count)
    const pxPerSvgUnit = svgRect.width / svgWidth.value
    tipX.value = svgRect.left + ptX * pxPerSvgUnit
    tipY.value = svgRect.top + ptY * pxPerSvgUnit
  } else {
    hoverIndex.value = -1
  }
}

function onMouseLeave() {
  hoverIndex.value = -1
}

// ─── Fetch orders ───
onMounted(async () => {
  try {
    const res = await axios.get('/orders?limit=1000')
    allOrders.value = res.data?.data ?? []
  } catch {
    allOrders.value = []
  } finally {
    loading.value = false
    nextTick(() => {
      if (scrollRef.value) {
        scrollRef.value.scrollLeft = scrollRef.value.scrollWidth
      }
    })
  }
})

// ─── Helpers: local date string without timezone shifting ───
function toLocalDateStr(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function toLocalMonthStr(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

function toLocalHourStr(d) {
  return `${toLocalDateStr(d)}T${String(d.getHours()).padStart(2, '0')}`
}

function getISOWeek(d) {
  const tmp = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const dayNum = tmp.getDay() || 7
  tmp.setDate(tmp.getDate() + 4 - dayNum)
  const yearStart = new Date(tmp.getFullYear(), 0, 1)
  const weekNo = Math.ceil(((tmp - yearStart) / 86400000 + 1) / 7)
  return { year: tmp.getFullYear(), week: weekNo }
}

function toWeekStr(d) {
  const { year, week } = getISOWeek(d)
  return `${year}-W${String(week).padStart(2, '0')}`
}

// ─── Grouping key ───
function getKey(dateStr) {
  const d = new Date(dateStr)
  switch (interval.value) {
    case 'hour':  return toLocalHourStr(d)
    case 'day':   return toLocalDateStr(d)
    case 'week':  return toWeekStr(d)
    case 'month': return toLocalMonthStr(d)
    case 'year':  return String(d.getFullYear())
    default:      return toLocalDateStr(d)
  }
}

// ─── Modern date formatting ───
function formatLabel(key) {
  switch (interval.value) {
    case 'hour': {
      const [datePart, hourPart] = key.split('T')
      const d = new Date(datePart + 'T' + hourPart + ':00:00')
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
        ', ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    }
    case 'day': {
      const parts = key.split('-')
      const d = new Date(+parts[0], +parts[1] - 1, +parts[2])
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
    case 'week': {
      const [y, w] = key.split('-W')
      return `Week ${+w}, ${y}`
    }
    case 'month': {
      const [y, m] = key.split('-')
      const d = new Date(+y, +m - 1, 1)
      return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }
    case 'year': return key
    default: return key
  }
}

function formatXLabel(key) {
  switch (interval.value) {
    case 'hour': {
      const [, hourPart] = key.split('T')
      const h = +hourPart
      const suffix = h >= 12 ? 'PM' : 'AM'
      const h12 = h % 12 || 12
      return `${h12} ${suffix}`
    }
    case 'day': {
      const parts = key.split('-')
      const d = new Date(+parts[0], +parts[1] - 1, +parts[2])
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
    case 'week': {
      const [, w] = key.split('-W')
      return `W${+w}`
    }
    case 'month': {
      const [y, m] = key.split('-')
      const d = new Date(+y, +m - 1, 1)
      return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    }
    case 'year': return key
    default: return key
  }
}

// ─── Gap filling ───
function incrementKey(key) {
  switch (interval.value) {
    case 'hour': {
      const [datePart, hourPart] = key.split('T')
      const parts = datePart.split('-')
      const d = new Date(+parts[0], +parts[1] - 1, +parts[2], +hourPart)
      d.setHours(d.getHours() + 1)
      return toLocalHourStr(d)
    }
    case 'day': {
      const parts = key.split('-')
      const d = new Date(+parts[0], +parts[1] - 1, +parts[2])
      d.setDate(d.getDate() + 1)
      return toLocalDateStr(d)
    }
    case 'week': {
      const [y, w] = key.split('-W').map(Number)
      const jan4 = new Date(y, 0, 4)
      const dayOfWeek = jan4.getDay() || 7
      const monday = new Date(jan4)
      monday.setDate(jan4.getDate() - dayOfWeek + 1 + (w - 1) * 7)
      monday.setDate(monday.getDate() + 7)
      return toWeekStr(monday)
    }
    case 'month': {
      const [y, m] = key.split('-').map(Number)
      const d = new Date(y, m, 1)
      return toLocalMonthStr(d)
    }
    case 'year':
      return String(Number(key) + 1)
    default:
      return key
  }
}

// ─── Build data points ───
const dataPoints = computed(() => {
  if (allOrders.value.length === 0) return []

  const counts = {}
  allOrders.value.forEach(order => {
    if (!order.createdAt) return
    const k = getKey(order.createdAt)
    counts[k] = (counts[k] || 0) + 1
  })

  const keys = Object.keys(counts).sort()
  if (keys.length === 0) return []

  const filled = []
  let current = keys[0]
  const last = keys[keys.length - 1]
  let safety = 0

  while (current <= last && safety < 10000) {
    filled.push({ key: current, count: counts[current] || 0 })
    const next = incrementKey(current)
    if (next <= current) break
    current = next
    safety++
  }

  return filled
})

// ─── Summary statistics ───
const totalOrders = computed(() => {
  return dataPoints.value.reduce((sum, d) => sum + d.count, 0)
})

const avgOrders = computed(() => {
  if (dataPoints.value.length === 0) return 0
  return Math.round(totalOrders.value / dataPoints.value.length)
})

// ─── Y-axis ───
const maxCount = computed(() => {
  const max = Math.max(...dataPoints.value.map(d => d.count), 1)
  return Math.ceil(max / 2) * 2
})

const yTicks = computed(() => {
  const step = Math.max(1, Math.ceil(maxCount.value / 5))
  const ticks = []
  for (let i = 0; i <= maxCount.value + step; i += step) {
    ticks.push(i)
  }
  return ticks
})

const yMax = computed(() => yTicks.value[yTicks.value.length - 1] || 1)

function yScale(val) {
  const chartH = height - padding.top - padding.bottom
  return padding.top + chartH * (1 - val / yMax.value)
}

function xScale(index) {
  const chartW = svgWidth.value - padding.left - padding.right
  const n = dataPoints.value.length
  if (n <= 1) return padding.left + chartW / 2
  return padding.left + (index / (n - 1)) * chartW
}

// ─── Smooth Catmull-Rom spline ───
const controlPoints = computed(() =>
  dataPoints.value.map((d, i) => ({ x: xScale(i), y: yScale(d.count) }))
)

function catmullRomToBezier(pts) {
  if (pts.length < 2) return ''
  if (pts.length === 2) return `M${pts[0].x},${pts[0].y} L${pts[1].x},${pts[1].y}`

  const tension = 0.25
  let path = `M${pts[0].x},${pts[0].y}`

  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(pts.length - 1, i + 2)]

    const cp1x = p1.x + (p2.x - p0.x) * tension
    const cp1y = p1.y + (p2.y - p0.y) * tension
    const cp2x = p2.x - (p3.x - p1.x) * tension
    const cp2y = p2.y - (p3.y - p1.y) * tension

    path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`
  }

  return path
}

const linePath = computed(() => catmullRomToBezier(controlPoints.value))

const areaPath = computed(() => {
  const pts = controlPoints.value
  if (pts.length === 0) return ''
  const baseY = yScale(0)
  const line = catmullRomToBezier(pts)
  return `${line} L${pts[pts.length - 1].x},${baseY} L${pts[0].x},${baseY} Z`
})

// ─── X-axis labels ───
const xLabels = computed(() => {
  const pts = dataPoints.value
  if (pts.length === 0) return []

  const labelEvery = pts.length > 30 ? 3 : pts.length > 15 ? 2 : 1
  const labels = []

  for (let i = 0; i < pts.length; i += labelEvery) {
    labels.push({ x: xScale(i), text: formatXLabel(pts[i].key) })
  }

  const last = pts.length - 1
  if (labels.length === 0 || labels[labels.length - 1].x !== xScale(last)) {
    labels.push({ x: xScale(last), text: formatXLabel(pts[last].key) })
  }

  return labels
})

// ─── Tooltip ───
const lastTooltipData = ref(null)

const tooltipData = computed(() => {
  if (hoverIndex.value < 0 || hoverIndex.value >= dataPoints.value.length) return lastTooltipData.value
  const d = dataPoints.value[hoverIndex.value]
  return { label: formatLabel(d.key), count: d.count }
})

watch(tooltipData, (newData) => {
  if (newData) {
    lastTooltipData.value = newData
  }
})

const tooltipStyle = computed(() => {
  // Always return last known position so tooltip fades out in place
  const x = tipX.value
  const y = tipY.value
  const flipLeft = x > window.innerWidth - 220

  return {
    top: `${y - 56}px`,
    left: flipLeft ? 'auto' : `${x + 16}px`,
    right: flipLeft ? `${window.innerWidth - x + 16}px` : 'auto',
  }
})

watch(interval, () => {
  hoverIndex.value = -1
  nextTick(() => {
    if (scrollRef.value) {
      scrollRef.value.scrollLeft = scrollRef.value.scrollWidth
    }
  })
})
</script>

<style scoped>
.orders-chart {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 24px;
  color: white;
  overflow: hidden; /* prevent chart from causing page scroll */
  position: relative;
}

.chart-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 16px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chart-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin: 0;
}

.summary-stats {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-label {
  color: rgba(255, 255, 255, 0.5);
}

.stat-item strong {
  color: rgb(59, 130, 246);
  font-weight: 600;
}

.stat-divider {
  color: rgba(255, 255, 255, 0.2);
}

/* Interval dropdown */
.interval-dropdown {
  position: relative;
}

.interval-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: white;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.interval-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.25);
}

.interval-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: #0a2a4a;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  padding: 4px;
  z-index: 50;
  min-width: 130px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.interval-option {
  display: block;
  width: 100%;
  text-align: left;
  padding: 9px 14px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.15s;
}

.interval-option:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.interval-option.active {
  background: rgba(59, 130, 246, 0.2);
  color: rgb(59, 130, 246);
  font-weight: 600;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Loading / empty */
.chart-loading,
.chart-empty {
  height: 340px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
}

/* Scrollable chart area */
.chart-body {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  border-radius: 8px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
  cursor: crosshair;
}

.chart-body::-webkit-scrollbar {
  height: 6px;
}

.chart-body::-webkit-scrollbar-track {
  background: transparent;
}

.chart-body::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 3px;
}

.chart-body::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}

.chart-svg {
  display: block;
}

/* Data point dots */
.data-dot {
  transition: all 0.2s ease;
}

.data-dot-hover {
  r: 5;
  filter: drop-shadow(0 0 4px rgba(59, 130, 246, 0.6));
}

/* Hover elements: always rendered, toggled via opacity */
.hover-el {
  opacity: 0;
  pointer-events: none;
  transition: cx 0.1s ease-out, cy 0.1s ease-out, x1 0.1s ease-out, x2 0.1s ease-out, opacity 0.15s ease;
}

.hover-el.visible {
  opacity: 1;
}

/* Tooltip: always position:fixed so it never affects layout flow */
.chart-tooltip {
  position: fixed;
  pointer-events: none;
  background: rgba(10, 25, 47, 0.98);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 10px;
  padding: 12px 16px;
  min-width: 160px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  z-index: 9999;
  white-space: nowrap;
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.15s ease, transform 0.15s ease, top 0.1s ease-out, left 0.1s ease-out, right 0.1s ease-out;
}

.chart-tooltip.visible {
  opacity: 1;
  transform: translateY(0);
}

.tooltip-date {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 6px;
  font-weight: 500;
}

.tooltip-value {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
}

.tooltip-value strong {
  color: white;
  font-weight: 700;
}

.tooltip-unit {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  font-weight: 500;
}

.tooltip-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgb(59, 130, 246);
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
  flex-shrink: 0;
}
</style>
