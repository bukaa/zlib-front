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
  import axios from 'axios';

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
      // checkStatus() {
      //   let retryCount = 3  // 默认重试3次
      //   const check = () => {
      //     fetch('http://file.361cn.com')
      //       .then(() => {
      //         this.status = 'success'
      //       })
      //       .catch((e) => {
      //         alert(JSON.stringify(e))
      //         if (retryCount > 0) {  // 还有重试次数
      //           retryCount--     
      //           setTimeout(check, 100)  // 100毫秒后重试
      //         } else {
      //           this.status = 'fail'
      //         }
      //       })
      //   }
      //   check()  
      // }
      checkStatus() {
        const api = axios.create({
          timeout: 1000
        })
        let retries = 2
        // window.fileHost = 'http://10.242.108.0:6677/'
        // 默认值
        window.fileHost = 'http://cdn.361cn.com/'
        // 试试ip
        var tempFileHost = 'http://10.242.108.0:6677/'
        const ping = () => {
          api.get(tempFileHost + 'book/hello?t=' + (new Date().getTime()))
            .then(res => {
              console.log('book_host=>' + tempFileHost, res.data)
              this.status = 'success'
              window.fileHost = tempFileHost
            })
            .catch(err => {
              retries--
              if (retries > 0) {
                setTimeout(ping, 50)
              } else {
                api.get(window.fileHost + 'book/hello?t=' + (new Date().getTime()))
                  .then(res => {
                    console.log('book_host=>' + window.fileHost, res.data)
                    this.status = 'success'
                })
              }
            })
        }
        ping()
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