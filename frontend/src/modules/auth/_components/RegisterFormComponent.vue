<template>
  <div class="register-form">
    <UsernameFieldComponent placeholder="Username" />
    <PasswordFieldComponent placeholder="Password"/>
    <PasswordFieldComponent placeholder="Password again"/>
    <AuthButtonComponent label="Sign Up" />
  </div>
</template>

<script setup>
import UsernameFieldComponent from './UsernameFieldComponent.vue';
import PasswordFieldComponent from './PasswordFieldComponent.vue';
import AuthButtonComponent from './AuthButtonComponent.vue';
</script>

<style>
.register-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  margin-top: 60px;
}
</style>
