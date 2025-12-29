<template>
  <Navbar />

  <div class="card mt-6 px-6">
    <DataView :value="products" :layout="layout">
      <!-- ===== Switch Layout Button ===== -->
      <template #header>
        <div class="flex justify-end mb-3">
          <SelectButton v-model="layout" :options="options" :allowEmpty="false">
            <template #option="{ option }">
              <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']" />
            </template>
          </SelectButton>
        </div>
      </template>

      <!-- ===== LIST VIEW ===== -->
      <template #list="slotProps">
        <div class="flex flex-col">
          <div
            v-for="(item, index) in slotProps.items"
            :key="index"
          >
            <div
              class="flex flex-col sm:flex-row sm:items-center p-6 gap-4"
              :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }"
            >
              <div class="md:w-40">
                <img
                  class="w-full rounded"
                  :src="item.imageUrl"
                  :alt="item.name"
                />
              </div>

              <div class="flex justify-between items-center flex-1 gap-6">
                <div>
                  <span class="text-sm text-gray-500">
                    {{ item.category?.name }}
                  </span>
                  <div class="text-lg font-medium mt-1">
                    {{ item.name }}
                  </div>
                </div>

                <div class="flex flex-col items-end gap-4">
                  <span class="text-xl font-semibold">
                    ${{ Number(item.price).toFixed(2) }}
                  </span>

                  <div class="flex gap-2">
                    <Button icon="pi pi-heart" variant="outlined" />
                    <Button
                      icon="pi pi-shopping-cart"
                      label="Buy Now"
                      class="flex-auto whitespace-nowrap"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- ===== GRID VIEW ===== -->
      <template #grid="slotProps">
        <div class="grid grid-cols-12 gap-4">
          <div
            v-for="(item, index) in slotProps.items"
            :key="index"
            class="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3 p-2"
          >
            <div
              class="p-4 border rounded bg-white flex flex-col"
            >
              <div class="flex justify-center rounded p-3">
                <img
                  class="rounded w-full"
                  :src="item.imageUrl"
                  :alt="item.name"
                  style="max-width: 250px"
                />
              </div>

              <div class="pt-4">
                <span class="text-sm text-gray-500">
                  {{ item.category?.name }}
                </span>

                <div class="text-lg font-medium mt-1">
                  {{ item.name }}
                </div>

                <div class="flex flex-col gap-4 mt-4">
                  <span class="text-xl font-semibold">
                    ${{ Number(item.price).toFixed(2) }}
                  </span>

                  <div class="flex gap-2">
                    <Button
                      icon="pi pi-shopping-cart"
                      label="Buy Now"
                      severity="primary"
                      class="flex-auto whitespace-nowrap"
                    />
                    <Button icon="pi pi-heart" variant="outlined" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </DataView>
  </div>
</template>

<script>
import axios from "axios";
import DataView from 'primevue/dataview'
import SelectButton from 'primevue/selectbutton'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Navbar from "@/components/Navbar.vue";

export default {
  components: {
    Navbar,
    DataView,
    SelectButton,
    // eslint-disable-next-line vue/no-reserved-component-names
    Button,
    // eslint-disable-next-line vue/no-unused-components
    Tag
  },

  data() {
    return {
      products: [],
      layout: "grid",
      options: ["list", "grid"],
    };
  },

  async mounted() {
    await this.fetchProducts();
  },

  methods: {
    async fetchProducts() {
      const res = await axios.get("/products", {
        params: { page: 1, limit: 12 }
      });

      // backend returns: data[]
      this.products = res.data.data;
    },

    getSeverity(product) {
      // If don’t have inventoryStatus in backend,
      // just force INSTOCK for now
      if (!product.inventoryStatus) return "success";

      switch (product.inventoryStatus) {
        case "INSTOCK":
          return "success";
        case "LOWSTOCK":
          return "warn";
        case "OUTOFSTOCK":
          return "danger";
        default:
          return null;
      }
    },
  },
};
</script>

