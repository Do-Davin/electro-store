<template>
  <div class="mx-auto mt-4" style="max-width: 1200px">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column - Profile Card -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Profile Card -->
        <div class="profile-card relative overflow-hidden rounded-2xl bg-[#111111] border border-white/[0.06]">
          <!-- Accent Banner -->
          <div class="h-24 bg-gradient-to-br from-primary to-primary/70"></div>

          <!-- Avatar -->
          <div class="flex flex-col items-center -mt-14 px-6 pb-6">
            <div class="relative group">
              <div v-if="hasAvatar" class="w-24 h-24 rounded-full overflow-hidden border-[3px] border-[#111111] shadow-lg ring-2 ring-primary/10">
                <img
                  :src="avatarSrc"
                  alt=""
                  class="w-full h-full object-cover"
                />
              </div>
              <div v-else class="w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20 border-[3px] border-[#111111] shadow-lg ring-2 ring-primary/10">
                <User :size="40" class="text-primary/60" />
              </div>
              <button
                class="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
              >
                <Camera :size="20" class="text-white" />
              </button>
            </div>

            <!-- Name & Email -->
            <h2 class="mt-3 text-lg font-semibold text-white tracking-tight">
              {{ user.firstName }} {{ user.lastName }}
            </h2>
            <p class="text-sm text-gray-400 mt-0.5">{{ user.email }}</p>

            <!-- Member Badge -->
            <div class="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <Clock :size="14" />
              Member since {{ user.memberSince }}
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="bg-[#111111] rounded-2xl border border-white/[0.06] p-5">
          <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Info</h4>
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <div class="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Phone :size="16" class="text-blue-400" />
              </div>
              <div class="min-w-0">
                <p class="text-xs text-gray-400">Phone</p>
                <p class="text-sm font-medium text-gray-200 truncate">{{ user.phone }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="flex-shrink-0 w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <MapPin :size="16" class="text-emerald-400" />
              </div>
              <div class="min-w-0">
                <p class="text-xs text-gray-400">Location</p>
                <p class="text-sm font-medium text-gray-200 truncate">{{ user.address.city }}, {{ user.address.country }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="flex-shrink-0 w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <Calendar :size="16" class="text-violet-400" />
              </div>
              <div class="min-w-0">
                <p class="text-xs text-gray-400">Date of Birth</p>
                <p class="text-sm font-medium text-gray-200 truncate">{{ user.dateOfBirth }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Profile Details -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Personal Information -->
        <div class="bg-[#111111] rounded-2xl border border-white/[0.06] p-6">
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <User :size="16" class="text-primary" />
              </div>
              <h3 class="text-base font-semibold text-white">Personal Information</h3>
            </div>
            <button
              v-if="!isEditing"
              @click="isEditing = true"
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-primary bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer"
            >
              <Edit :size="14" />
              Edit Profile
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
            <!-- First Name -->
            <div class="form-group">
              <label class="block text-xs font-medium text-gray-400 mb-1.5">First Name</label>
              <input
                v-model="user.firstName"
                :disabled="!isEditing"
                type="text"
                class="profile-input"
                :class="{ 'profile-input--active': isEditing }"
              />
            </div>

            <!-- Last Name -->
            <div class="form-group">
              <label class="block text-xs font-medium text-gray-400 mb-1.5">Last Name</label>
              <input
                v-model="user.lastName"
                :disabled="!isEditing"
                type="text"
                class="profile-input"
                :class="{ 'profile-input--active': isEditing }"
              />
            </div>

            <!-- Phone -->
            <div class="form-group">
              <label class="block text-xs font-medium text-gray-400 mb-1.5">Phone Number</label>
              <input
                v-model="user.phone"
                :disabled="!isEditing"
                type="tel"
                class="profile-input"
                :class="{ 'profile-input--active': isEditing }"
              />
            </div>

            <!-- Gender -->
            <div class="form-group">
              <label class="block text-xs font-medium text-gray-400 mb-1.5">Gender</label>
              <select
                v-model="user.gender"
                :disabled="!isEditing"
                class="profile-input"
                :class="{ 'profile-input--active': isEditing }"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <!-- Date of Birth -->
            <div class="form-group">
              <label class="block text-xs font-medium text-gray-400 mb-1.5">Date of Birth</label>
              <input
                v-model="user.dateOfBirth"
                :disabled="!isEditing"
                type="date"
                class="profile-input"
                :class="{ 'profile-input--active': isEditing }"
              />
            </div>
          </div>
        </div>

        <!-- Address Information -->
        <div class="bg-[#111111] rounded-2xl border border-white/[0.06] p-6">
          <div class="flex items-center gap-2.5 mb-5">
            <div class="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <MapPin :size="16" class="text-emerald-400" />
            </div>
            <h3 class="text-base font-semibold text-white">Address Information</h3>
          </div>

          <div class="grid grid-cols-1 gap-4">
            <!-- Street Address -->
            <div class="form-group">
              <label class="block text-xs font-medium text-gray-400 mb-1.5">Street Address</label>
              <input
                v-model="user.address.street"
                :disabled="!isEditing"
                type="text"
                class="profile-input"
                :class="{ 'profile-input--active': isEditing }"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- City -->
              <div class="form-group">
                <label class="block text-xs font-medium text-gray-400 mb-1.5">City</label>
                <input
                  v-model="user.address.city"
                  :disabled="!isEditing"
                  type="text"
                  class="profile-input"
                  :class="{ 'profile-input--active': isEditing }"
                />
              </div>

              <!-- State -->
              <div class="form-group">
                <label class="block text-xs font-medium text-gray-400 mb-1.5">State/Province</label>
                <input
                  v-model="user.address.state"
                  :disabled="!isEditing"
                  type="text"
                  class="profile-input"
                  :class="{ 'profile-input--active': isEditing }"
                />
              </div>

              <!-- PostCode -->
              <div class="form-group">
                <label class="block text-xs font-medium text-gray-400 mb-1.5">PostCode</label>
                <input
                  v-model="user.address.postCode"
                  :disabled="!isEditing"
                  type="text"
                  class="profile-input"
                  :class="{ 'profile-input--active': isEditing }"
                />
              </div>
            </div>

            <!-- Country -->
            <div class="form-group">
              <label class="block text-xs font-medium text-gray-400 mb-1.5">Country</label>
              <input
                v-model="user.address.country"
                :disabled="!isEditing"
                type="text"
                class="profile-input"
                :class="{ 'profile-input--active': isEditing }"
              />
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div v-if="isEditing" class="flex items-center gap-3">
          <button
            @click="saveProfile"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 cursor-pointer"
          >
            <Check :size="16" />
            Save Changes
          </button>
          <button
            @click="cancelEdit"
            class="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 text-gray-300 rounded-xl text-sm font-medium hover:bg-white/5 transition-all cursor-pointer"
          >
            <X :size="16" />
            Cancel
          </button>
        </div>

        <!-- Account Settings -->
        <div class="bg-[#111111] rounded-2xl border border-white/[0.06] p-6">
          <div class="flex items-center gap-2.5 mb-5">
            <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Settings :size="16" class="text-gray-400" />
            </div>
            <h3 class="text-base font-semibold text-white">Account Settings</h3>
          </div>

          <div class="flex flex-wrap gap-3">
            <button class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-gray-300 text-sm font-medium hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer">
              <Lock :size="16" />
              Change Password
            </button>
            <button class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/10 hover:border-red-500/30 transition-all cursor-pointer">
              <Trash2 :size="16" />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import {
  Camera,
  Clock,
  Phone,
  MapPin,
  Calendar,
  User,
  Edit,
  Check,
  X,
  Settings,
  Lock,
  Trash2
} from 'lucide-vue-next'

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

// Computed property for avatar display
const avatarSrc = computed(() => user.avatar || '')
const hasAvatar = computed(() => !!user.avatar && user.avatar !== '/users/default-avatar.png')

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
.profile-input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: #0a0a0a;
  color: #f0f0f0;
  font-size: 0.875rem;
  line-height: 1.25rem;
  transition: all 0.2s ease;
  outline: none;
}

.profile-input:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.profile-input--active {
  background-color: #111111;
  border-color: rgba(255, 255, 255, 0.2);
}

.profile-input--active:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(255, 140, 66, 0.1);
}

.profile-card {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
</style>
