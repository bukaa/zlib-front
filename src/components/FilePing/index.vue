<template>
    <div style="display: inline;">
      <span 
        v-if="status === 'success'"
        class="green-dot"
      ></span>
      <span
        v-else
        class="red-dot"
      ></span>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FilePing',
    data() {
      return {
        status: ''
      }
    },
    mounted() {
      this.checkStatus()
    },
    methods: {
      checkStatus() {
        fetch('http://file.361cn.com')
          .then(() => {
            this.status = 'success'
          })
          .catch(() => {
            this.status = 'fail'
          })
      }
    }
  }
  </script>
  
  <style>
  .green-dot {
    display: inline-block;
    width: 10px; 
    height: 10px;
    border-radius: 50%;
    background-color: #8bc34a;
  }
  
  .red-dot {
    display: inline-block;
    width: 10px; 
    height: 10px;
    border-radius: 50%;
    background-color: #ff6f60;
  }
  </style>