<template>
  <div class="bg-white rounded-lg shadow-sm p-6 mx-auto mt-4" style="max-width: 1200px">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column - Profile Card -->
      <div class="lg:col-span-1">
        <div class="bg-slate-50 rounded-xl p-6 text-center">
          <!-- Avatar -->
          <div class="relative inline-block mb-4">
            <img
              :src="user.avatar"
              alt="Profile"
              class="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
            />
            <button
              class="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </button>
          </div>

          <!-- Name & Email -->
          <h2 class="text-xl font-bold text-slate-800">{{ user.firstName }} {{ user.lastName }}</h2>
          <p class="text-sm text-slate-500 mt-1">{{ user.email }}</p>

          <!-- Member Since -->
          <div class="mt-4 pt-4 border-t border-slate-200">
            <p class="text-xs text-slate-400">Member since</p>
            <p class="text-sm font-medium text-slate-600">{{ user.memberSince }}</p>
          </div>
        </div>
      </div>

      <!-- Right Column - Profile Details -->
      <div class="lg:col-span-2">
        <!-- Personal Information -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-slate-800">Personal Information</h3>
            <button
              v-if="!isEditing"
              @click="isEditing = true"
              class="text-sm text-primary hover:underline font-medium"
            >
              Edit
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- First Name -->
            <div>
              <label class="block text-xs text-slate-400 mb-1">First Name</label>
              <input
                v-model="user.firstName"
                :disabled="!isEditing"
                type="text"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-primary disabled:bg-slate-50 disabled:cursor-not-allowed"
              />
            </div>

            <!-- Last Name -->
            <div>
              <label class="block text-xs text-slate-400 mb-1">Last Name</label>
              <input
                v-model="user.lastName"
                :disabled="!isEditing"
                type="text"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-primary disabled:bg-slate-50 disabled:cursor-not-allowed"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-xs text-slate-400 mb-1">Email Address</label>
              <input
                v-model="user.email"
                :disabled="!isEditing"
                type="email"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-primary disabled:bg-slate-50 disabled:cursor-not-allowed"
              />
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-xs text-slate-400 mb-1">Phone Number</label>
              <input
                v-model="user.phone"
                :disabled="!isEditing"
                type="tel"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-primary disabled:bg-slate-50 disabled:cursor-not-allowed"
              />
            </div>

            <!-- Gender -->
            <div>
              <label class="block text-xs text-slate-400 mb-1">Gender</label>
              <select
                v-model="user.gender"
                :disabled="!isEditing"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-primary disabled:bg-slate-50 disabled:cursor-not-allowed"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <!-- Date of Birth -->
            <div>
              <label class="block text-xs text-slate-400 mb-1">Date of Birth</label>
              <input
                v-model="user.dateOfBirth"
                :disabled="!isEditing"
                type="date"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-primary disabled:bg-slate-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <!-- Address Information -->
        <div class="mb-8">
          <h3 class="text-lg font-semibold text-slate-800 mb-4">Address Information</h3>

          <div class="grid grid-cols-1 gap-4">
            <!-- Street Address -->
            <div>
              <label class="block text-xs text-slate-400 mb-1">Street Address</label>
              <input
                v-model="user.address.street"
                :disabled="!isEditing"
                type="text"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-primary disabled:bg-slate-50 disabled:cursor-not-allowed"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- City -->
              <div>
                <label class="block text-xs text-slate-400 mb-1">City</label>
                <input
                  v-model="user.address.city"
                  :disabled="!isEditing"
                  type="text"
                  class="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-primary disabled:bg-slate-50 disabled:cursor-not-allowed"
                />
              </div>

              <!-- State -->
              <div>
                <label class="block text-xs text-slate-400 mb-1">State/Province</label>
                <input
                  v-model="user.address.state"
                  :disabled="!isEditing"
                  type="text"
                  class="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-primary disabled:bg-slate-50 disabled:cursor-not-allowed"
                />
              </div>

              <!-- Zip Code -->
              <div>
                <label class="block text-xs text-slate-400 mb-1">Zip Code</label>
                <input
                  v-model="user.address.zipCode"
                  :disabled="!isEditing"
                  type="text"
                  class="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-primary disabled:bg-slate-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <!-- Country -->
            <div>
              <label class="block text-xs text-slate-400 mb-1">Country</label>
              <input
                v-model="user.address.country"
                :disabled="!isEditing"
                type="text"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-primary disabled:bg-slate-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div v-if="isEditing" class="flex items-center gap-3">
          <button
            @click="saveProfile"
            class="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Save Changes
          </button>
          <button
            @click="cancelEdit"
            class="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>

        <!-- Account Actions -->
        <div class="pt-6 border-t border-slate-100 mt-6">
          <h3 class="text-lg font-semibold text-slate-800 mb-4">Account Settings</h3>
          <div class="flex flex-wrap gap-3">
            <button class="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Change Password
            </button>
            <button class="px-4 py-2 border border-red-200 text-red-500 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18"/>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              </svg>
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const isEditing = ref(false)

const originalUser = {
  firstName: 'Vong',
  lastName: 'Tath',
  email: 'vong.tath@example.com',
  phone: '+855 762 147 429',
  gender: 'male',
  dateOfBirth: '2005-06-20',
  avatar: '/users/default-avatar.png',
  memberSince: 'January 2024',
  address: {
    street: 'No. 128, Street 271',
    city: 'Phnom Penh',
    state: 'Khan Sen Sok',
    zipCode: '12000',
    country: 'Cambodia',
  },
}

const user = reactive({ ...originalUser, address: { ...originalUser.address } })

const saveProfile = () => {
  // Here you would typically send the data to the backend
  console.log('Saving profile:', user)
  isEditing.value = false
}

const cancelEdit = () => {
  // Reset to original values
  Object.assign(user, originalUser)
  user.address = { ...originalUser.address }
  isEditing.value = false
}
</script>

<style scoped>
</style>
