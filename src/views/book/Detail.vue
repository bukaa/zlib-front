<template>
  <page-header-wrapper
    title="图书详情"
    :tab-active-key="tabActiveKey"
    @tabChange="handleTabChange"
  >
    <template v-slot:content>
      <div class="article-profile-primary ">
          <div class="cover shadow-cover">
            <img :src="item.cover" :alt="item.name" itemprop="image" loading="lazy">
          </div>
          <div class="article-profile-bd">
            <h1 itemprop="name" class="article-title">{{item.name}}</h1>
            <!-- <p itemprop="alternativeHeadline" class="subtitle" v-html="item.desc"></p> -->
            <div class="article-meta">
              <meta itemprop="bookFormat" content="http://schema.org/EBook">
              <link itemprop="author" href="#author">
                <p class="author">
                  <span class="label">作者</span>
                  <span class="labeled-text">
                    <a v-for="au in item.authorList" :key="au" class="author-item" :href="'/#/list/search-list?q=' + au"> {{au}}</a>
                  </span>
                </p>
                <ul class="ant-list-item-action" style="overflow: hidden; zoom: 1; margin-top: 15px;">
                  <li><icon-text type="star-o" :text="item.interestScore || 0" /></li>
                  <li><icon-text type="like-o" :text="item.qualityScore || 0" /></li>
                  <li><icon-text type="message" :text="item.commentsInfo || 0" /></li>
                </ul>
                <div style="overflow: hidden; zoom: 1; margin-top: 15px;">
                  <div class="bookDetailsBox" v-if="deviceType !== 'Mobile'">
                    <div v-for="(v, k, index) in item.properties" :key="k" class="bookProperty" :style="index % 2 == 0 ? 'width: 40%': '60%'">
                      <div class="property_label">{{ k }}:</div>
                      <div class="property_value ">
                        {{ v }}
                      </div>
                    </div>       
                  </div>
                </div>
                <!-- <p class="" v-for="k in item.properties" :key="k">
                  <span class="label">{{ k }}</span>
                  <span class="labeled-text">
                    <span> {{ item.properties[k] }} </span>
                  </span>
                </p> -->
                <p class="desc">
                  <span class="label"></span>
                  <span class="labeled-text">
                    <a-popover placement="top">
                      <template #content>
                        <p style="width: 980px; line-height: 25px; background-color:cornsilk;" v-html="item.desc"></p>
                      </template>
                      <template #title>
                        <span>简介：</span>
                      </template>
                      <span v-html="item.descText"></span>
                    </a-popover>
                  </span>
                </p>
              </div>
            </div>
        </div>
    </template>

    <!-- actions -->
    <template v-slot:extra>
      <a-button-group style="margin-right: 4px;">
        <a-button v-if="readState == -1" @click="addRead"><a-icon type="plus-circle"/>加入阅读</a-button>
        <a-button v-if="readState == 0"><a-icon type="clock-circle"/>已加入阅读</a-button>
        <a-button v-if="readState == 1"><a-icon type="clock-circle"/>阅读中</a-button>
        <a-button v-if="readState == 2"><a-icon type="check-circle"/>已读完</a-button>
        <a-button style="margin-left: 5px;" v-if="readState == 0 || readState == 1 || readState == 2" @click="delRead()"><a-icon type="close-circle"/>删除</a-button>
        <!-- <a-popconfirm
          title="确定删除当前书籍吗?"
          ok-text="Yes"
          cancel-text="No"
          @confirm="delBook"
          @cancel="cancel"
        >
        <a-button style="margin-left: 5px;"><a-icon type="delete"/>删除图书</a-button>
        </a-popconfirm> -->
      </a-button-group>
    </template>

    <!-- <template v-slot:extraContent>
      <a-row class="status-list">
        <a-col :xs="12" :sm="12">
          <div class="text">状态</div>
          <div class="heading">待审批</div>
        </a-col>
        <a-col :xs="12" :sm="12">
          <div class="text">订单金额</div>
          <div class="heading">¥ 568.08</div>
        </a-col>
      </a-row>
    </template> -->

    <a-card v-if="item.fileState == 1" style="margin-top: 24px" :bordered="false" title="">
      <a-button type="primary" ghost size="default" @click="downloadFile(item.id)">
        <icon-text type="download" text=""/> 下载({{item.fileDesc}})
        <file-ping style="margin-left: 5px;"/>
      </a-button>
      <a-button v-if="item.fileDesc && item.fileDesc.indexOf('EPUB') != -1" type="primary" ghost size="default" style="margin-left: 12px;" @click="showDrawer(item.id)">
        <icon-text type="read" text=""/> 阅读
        <file-ping style="margin-left: 5px;"/>
      </a-button>
      <a-button v-if="item.fileState == 1 && item.fileDesc && item.fileDesc.indexOf('PDF') != -1" type="primary" ghost size="default" style="margin-left: 12px;" @click="showDrawer(item.id)">
        <icon-text type="read" text=""/> 查看
        <file-ping style="margin-left: 5px;"/>
      </a-button>
      <!-- <a-button v-if="item.fileState == 1 && item.fileDesc && (item.fileDesc.indexOf('MOBI') != -1 || item.fileDesc.indexOf('AZW') != -1 || item.fileDesc.indexOf('AZW3') != -1)" type="primary" ghost size="default" style="margin-left: 50px;" @click="convert(item.id)">
        <icon-text type="read" text=""/> 转换后阅读
      </a-button> -->
    </a-card>

    <a-drawer :width="(deviceType === 'Pad' || deviceType === 'Mobile') ? '100%': '70%'" placement="right" :closable="true" :visible="showFileVisible" height="100%" @close="showFileVisible = false">
      <h3 style="text-align: center;">{{ item.name }}</h3>
      <iframe id='previewPdf' v-if="item.fileDesc && 
        (item.fileDesc.indexOf('EPUB') != -1 
          || item.fileDesc.indexOf('PDF') != -1 
          || item.fileDesc.indexOf('MOBI') != -1 
          || item.fileDesc.indexOf('AZW') != -1 
          || item.fileDesc.indexOf('AZW3') != -1)" 
        :src="fileViewUrl" height="100%" width="100%">
      </iframe>
    </a-drawer>

    <!-- 推荐 -->
    <a-card
      style="margin-top: 24px;"
      :bordered="false"
      :tabList="operationTabList"
      :activeTabKey="operationActiveTabKey"
      @tabChange="(key) => {this.operationActiveTabKey = key}"
    > 
      <!-- <vue-waterfall-easy ref="waterfall" :imgsArr="recommendList" :height="1200" :imgWidth="150" @scrollReachBottom="getRecommendData"></vue-waterfall-easy> -->
      <!-- <vue-masonry-wall :items="recommendList" :options="{width: 180, padding: 12}" :ssr="{columns: 7}" @append="getRecommendData"> -->
      <vue-masonry-wall :items="recommendList" :options="(deviceType === 'Pad' || deviceType === 'Mobile') ? {width: 100, padding: 4}: {width: 180, padding: 12}" :ssr="(deviceType === 'Pad' || deviceType === 'Mobile') ? {columns: 15}: {columns: 7}" @append="getRecommendData">
        <template v-slot:default="{item}">
          <div class="cover-item" @click="goDetail(item.url)">
            <img :src="item.cover"/>
          </div>
        </template>
      </vue-masonry-wall>
    </a-card>
    <!-- <a-card>
      <icon-selector></icon-selector>
    </a-card> -->
    <a-back-top />
  </page-header-wrapper>
</template>

<script>
import { baseMixin } from '@/store/app-mixin'
import { getReadState, addRead, doRead, delRead } from '@/api/read'
import { getBookDetail, delBook, convert } from '@/api/book'
import IconText from '../../components/IconText'
import IconSelector from '../../components/IconSelector'
import VueMasonryWall from "vue-masonry-wall"
import { FilePing } from '@/components'

export default {
  name: 'Advanced',
  mixins: [baseMixin],
  components: {
    IconText,
    IconSelector,
    VueMasonryWall,
    FilePing
  },
  data () {
    return {
      id: '',
      tabActiveKey: 'detail',
      operationTabList: [
        {
          key: '1',
          tab: '您可能会感兴趣'
        }
      ],
      operationActiveTabKey: '1',
      readState: -2,
      item: {},
      recommendList: [],
      showFileVisible: false,
      fileUrl: '',
      fileViewUrl: '',
      deviceType: ''
    }
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        'agree': '成功',
        'reject': '驳回'
      }
      return statusMap[status]
    },
    statusTypeFilter (type) {
      const statusTypeMap = {
        'agree': 'success',
        'reject': 'error'
      }
      return statusTypeMap[type]
    }
  },
  created() {
    this.deviceType = this.getPlatform()
    var id1 = this.$route.params.id1
    var id2 = this.$route.params.id2
    var id = ''
    if(id1 && id2) {
      id = id1 + '/' + id2
    } else {
      id = id1.replace('_', '/')
    }
    this.fetchDetail(id)
    this.getReadState(id)
    this.id = id
  },
  methods: {
    handleTabChange (key) {
      console.log('')
      this.tabActiveKey = key
    },
    fetchDetail(id) {
      getBookDetail(id).then(res => {
        console.log('res', res)
        var d = res.data
        if(!d || d.deleted) {
          this.$router.push({
            path: '/exception/404'
          })
          return
        }
        if(d.properties) {
          for(var k in d.properties) {
            if(k.indexOf('出版社') != -1) {
              d.pub = d.properties[k]
            } else if(k.indexOf('年') != -1) {
              d.year = d.properties[k]
            } else if(k.indexOf('文件') != -1 || k.indexOf('File') != -1) {
              d.fileDesc = d.properties[k]
              d.fileExt = d.fileDesc.trim().split(",")[0].trim().toLowerCase()
            }
          }
        }
        if(!d.authorList && d.author) {
          d.authorList = [d.author]
        }
        d.descText = this.getText(d.desc)
        this.item = d
        this.loading = false
        this.getRecommendList(id)
      })
    },
    getReadState(id) {
      getReadState(id).then(res => {
        this.readState = res.data
      })
    },
    addRead() {
      addRead(this.id, {}).then(res => {
        this.readState = 0
      })
    },
    doRead() {
      doRead(this.id, {}).then(res => {
        if(!res || !res.data || res.data == -1) {
          return
        }
        this.readState = 1
      })
    },
    delRead() {
      delRead(this.id, {}).then(res => {
        this.readState = -1
      })
    },
    delBook() {
      delBook(this.id).then(res => {
        this.$notification['success']({
          message: '提示',
          description: '操作成功...',
          duration: 8
        })
      }).catch(err => {
        this.$notification['error']({
          message: '提示',
          description: '图书删除失败，请联系管理员',
          duration: 8
        })
      })
    },
    cancel() {},
    getRecommendList (id) {
      this.$http.get('/zlib/recommend/' + id).then(res => {
        console.log('res', res)
        var data = res.data || []
        this.recommendList = data
      })
    },
    getRecommendData() {
      console.log('getRecommendData...')
    },
    goDetail (url) {
      let routeUrl = this.$router.resolve({
        path: url,
        query: {t: +new Date()}
      });
      window.open(routeUrl.href, '_blank');
    },
    downloadFile(id) {
      var fileName = this.item.id.replace('/', '_') + '.' + this.item.fileExt
      var fileUrl = window.fileHost + 'book/' + this.item.id.substring(0, 2) + '/' + this.item.id.substring(2, 4) + '/' + fileName
      console.log('fileUrl ==>' + fileUrl)
      window.open(fileUrl, '_blank')
    },
    showDrawer(id) {
      // var fileUrl = '/zlib/download/' + this.item.id + '.' + this.item.fileExt
      var fileName = this.item.id.replace('/', '_') + '.' + this.item.fileExt
      let path = process.env.VUE_APP_PUBLIC_PATH.endsWith('/') ? process.env.VUE_APP_PUBLIC_PATH: process.env.VUE_APP_PUBLIC_PATH + '/'
      var fileUrl = window.fileHost + 'book/' + this.item.id.substring(0, 2) + '/' + this.item.id.substring(2, 4) + '/' + fileName
      this.showFileVisible = true
      if(this.item.fileDesc.indexOf('PDF') != -1) {
        this.fileViewUrl = '/lib/pdfViewer/web/viewer.html?file=' + fileUrl + "?source%3Dview"
      } else {
        this.fileViewUrl = path + 'lib/ePubViewer/index.html?' + fileUrl + "?source=view"
      }
      this.doRead()
    },
    convert() {
      convert(this.item.id).then(res => {
        if(res.data && res.data > 0) {
          this.showDrawer()
        } else {
          this.$notification['error']({
            message: '提示',
            description: '图书转换失败，请联系管理员',
            duration: 8
          })
        }
      }).catch(err => {
        this.$notification['error']({
          message: '提示',
          description: '图书转换异常，请联系管理员',
          duration: 8
        })
      })
    },
    getText(str) {
      if(!str) {
        return
      }
      let words = str.replace(/<[^<>]+>/g, "").replace(/&nbsp;/gi, " ");
      return words
    }
  }
}
</script>

<style lang="less" scoped>
  .article-profile-primary {
    /* display: flex; */
    padding-bottom: 13px;
  }
  .bookDetailsBox {
    zoom: 1;
    overflow: hidden;
  }
  .bookDetailsBox div.bookProperty {
    float: left;
    width: 50%;
    font-size: 10pt;
    margin-bottom: 10px;
  }
  .bookDetailsBox div.bookProperty .property_label {
    float: left;
    color: #888;
    font-size: 10pt;
    display: block;
  }
  .bookDetailsBox div.bookProperty .property_value {
    display: block;
    margin-left: 100px;
  }
  .article-profile-primary .cover {
    flex-shrink: 0;
    min-height: 200px;
  }
  .article-profile-primary .cover {
      margin-right: 25px;
      width: 180px;
      height: auto;
      float: left;
  }
  .article-profile-primary .author-item {
    margin-left: 8px;
  }
  .cover {
      position: relative;
      border-radius: 4px;
      background: url(https://static.arkread.com/ark/pics/app/default-cover.c6741b44.png) center center/100% auto;
  }
  .shadow-cover, .mini-shadow-cover, .micro-shadow-cover {
      box-shadow: 1px 1px 3px 0 rgb(0 0 0 / 20%);
  }
  .cover img {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    opacity: 1;
    transition: opacity .5s ease-in;
  }
  img {
    max-width: 100%;
    border: none;
    vertical-align: middle;
    -ms-interpolation-mode: bicubic;
  }
  .article-profile-primary .article-profile-bd {
    flex-grow: 1;
  }
  .article-title {
    font-weight: bold;
    font-size: 20px;
  }
  .desc {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-height: 25px;
    -webkit-box-orient: vertical;
  }
  .app-article p {
    margin-bottom: 0;
  }
  p {
    font-size: 14px;
    line-height: 1.2;
  }
  .detail-layout {
    margin-left: 44px;
  }
  .text {
    color: rgba(0, 0, 0, .45);
  }

  .heading {
    color: rgba(0, 0, 0, .85);
    font-size: 20px;
  }

  .no-data {
    color: rgba(0, 0, 0, .25);
    text-align: center;
    line-height: 64px;
    font-size: 16px;

    i {
      font-size: 24px;
      margin-right: 16px;
      position: relative;
      top: 3px;
    }
  }
  .cover-item {
    overflow: hidden;
    border-radius: 4px;
    width: 100%;
    background: #F5F5F5;
    cursor: pointer;
  }
  .cover-item > img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    line-height: 0;
    display: block;
  }
  /deep/ .ant-pro-page-header-wrap-children-content {
    margin: 24px 0px 0;
  }
  /deep/ .ant-pro-grid-content.wide {
    max-width: 100%;
  }
  /deep/ .ant-drawer-body {
    height: 100% !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
    padding-bottom: 0 !important;
    padding-top: 10px !important
  }

  .mobile {
    .detail-layout {
      margin-left: unset;
    }
    .text {

    }
    .status-list {
      text-align: left;
    }
  }
</style>
