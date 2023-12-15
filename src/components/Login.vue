<template>
    <h1>Login</h1>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginFormRules"
      label-width="120px"
    >
      <el-form-item label="Email" prop="email">
        <el-input v-model="loginForm.email"></el-input>
      </el-form-item>
  
      <el-form-item label="Password" prop="password">
        <el-input v-model="loginForm.password" type="password"></el-input>
      </el-form-item>
  
      <el-form-item>
        <el-button class="login-button" type="primary" @click="submitForm">Login</el-button>
      </el-form-item>
    </el-form>
  </template>
  
  <script>
  import { ElButton, ElForm, ElFormItem, ElInput } from 'element-plus';
  import axios from 'axios';
  
  export default {
    data() {
      return {
        loginForm: {
          email: '',
          password: '',
        },
        loginFormRules: {
          email: [
            { required: true, message: 'Please enter your email', trigger: 'blur' },
            { type: 'email', message: 'Please enter a valid email address', trigger: ['blur', 'change'] }
          ],
          password: [
            { required: true, message: 'Please enter a password', trigger: 'blur' }
          ],
        }
      };
    },
    components: {
      ElButton,
      ElForm,
      ElFormItem,
      ElInput
    },
    methods: {
      async submitForm() {
        try {
          await this.$refs.loginForm.validate();
          const response = await axios.post('http://127.0.0.1:8000/login', {
            email: this.loginForm.email,
            password: this.loginForm.password,
          });
  
          console.log('Login successful:', response.data);
          this.$store.dispatch('loginUser', {token: response.data.token, user: response.data.user})
          .then(() => {
            this.$router.push({ name: 'Game' });
          })
          .catch((error => {
            console.error('Login failed:', error)
          }))


        } catch (error) {
          console.log('Login failed:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .login-button {
    margin-top: 15px;
  }
  </style>
  