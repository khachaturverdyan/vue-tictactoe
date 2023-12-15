<template>
  <h1>Register</h1>
  <el-form
    ref="registerForm"
    :model="registerForm"
    :rules="registerFormRules"
    label-width="120px"
  >
    <el-form-item label="Name" prop="name">
      <el-input v-model="registerForm.name"></el-input>
    </el-form-item>

    <el-form-item label="Email" prop="email">
      <el-input v-model="registerForm.email"></el-input>
    </el-form-item>

    <el-form-item label="Password" prop="password">
      <el-input v-model="registerForm.password" type="password"></el-input>
    </el-form-item>

    <el-form-item label="Confirm Password" prop="password">
      <el-input v-model="registerForm.confirmPassword" type="password"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button class="registerbutton" type="primary" @click="submitForm">Register</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {ElButton, ElForm, ElFormItem, ElInput} from 'element-plus';
import axios from 'axios';
export default {
  data() {
    return {
      registerForm: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      registerFormRules: {
        name: [
          { required: true, message: 'Please enter your name', trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'Please enter your email', trigger: 'blur' },
          { type: 'email', message: 'Please enter a valid email address', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: 'Please enter a password', trigger: 'blur' },
          { min: 8, message: 'Password length should be at least 8 characters', trigger: 'blur' }
        ],
        passwordConfirm: [
          { required: true, message: 'Please confirm your password', trigger: 'blur' },
          { validator: this.validateConfirmPassword, trigger: 'blur' }
        ]
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
    validateConfirmPassword(rule, value, callback) {
    if (value === this.registerForm.password) {
      console.log('Vue validation is all correct')
    } else {
      callback(new Error('The passwords do not match')); 
    }
  },
    async submitForm() {
      try {
        await this.$refs.registerForm.validate(); 
        const response = await axios.post('http://127.0.0.1:8000/signup', {
          name: this.registerForm.name,
          email: this.registerForm.email,
          password: this.registerForm.password,
          passwordConfirm: this.registerForm.confirmPassword,
        });

        console.log('Registration successful:', response.data);
      } catch (error) {
        console.log('Registration failed:', error);
      }
    }
  }
};
</script>


<style scoped>
.registerbutton {
  margin-top: 15px;
}
</style>