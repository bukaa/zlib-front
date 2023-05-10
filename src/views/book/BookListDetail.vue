<template>
  <page-header-wrapper :title="detail.title" :tab-active-key="tabActiveKey" @tabChange="handleTabChange">
    <template v-slot:content>
      <div class="article-profile-primary ">
        <div class="article-profile-bd">
          <!-- <h1 itemprop="name" class="article-title">{{detail.title}}</h1> -->
          <!-- <p itemprop="alternativeHeadline" class="subtitle" v-html="item.desc"></p> -->
          <div class="article-meta">
            <!-- <p class="" v-for="k in item.properties" :key="k">
                  <span class="label">{{ k }}</span>
                  <span class="labeled-text">
                    <span> {{ item.properties[k] }} </span>
                  </span>
                </p> -->
            <p class="desc">
              <span class="label"></span>
              <span class="labeled-text">
                <p style="width: 100%; line-height: 25px;" v-html="detail.desc"></p>
              </span>
            </p>

            <div class="readlist-info">
              <div class="info-item author text-overflow">
                <div class="info-item__content" data-tooltip="booklist-creator" :data-author="detail.authorName"
                  data-original-title="" title="">
                  <a-icon type="user" />
                  <span><a :href="'/#/booklists/user/' + detail.authorId">{{ detail.authorName }}</a></span>
                </div>
              </div>
              <div class="info-item date">
                <div class="info-item__content" data-tooltip="creation-date" title="" data-original-title="创建日期">
                  <a-icon type="calendar" />
                  <span>{{ detail.createTime }}</span>
                </div>
              </div>
              <div class="break-mobile"></div>
              <div class="info-item books-count">
                <div class="info-item__content" data-tooltip="book-quantity" title="" data-original-title="书籍数量">
                  <a-icon type="book" />
                  {{ detail.bookCount }}
                </div>
              </div>
              <div class="info-item views-count">
                <div class="info-item__content" data-tooltip="views-quantity" title="" data-original-title="意见">
                  <a-icon type="eye" />
                  {{ detail.viewCount > 1000 ? (detail.viewCount) / 1000 + 'k' : detail.viewCount }}
                </div>
              </div>
              <div class="info-item comments-count _custom">
                <div class="info-item__content" data-tooltip="comments-quantity" title="" data-original-title="Comments">
                  <a-icon type="message" />
                  <span>{{ detail.commentCount }}</span>
                </div>
              </div>

              <!-- <div id="readlist-private" class="info-item readlist-private hidden">
                <div class="info-item__content">
                  <img src="/img/icon-private-blue.svg">
                  个人的
                </div>
              </div> -->
              <!-- <div class="info-item favorite-readlist pull-right " style="margin: 8px 2px;"
                data-tooltip="favorites-button" title="" data-original-title="添加到收藏夹">
                <img class="disabled" src="/img/icon-heart.svg">
                <img class="enabled" src="/img/icon-heart-blue.svg">
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- actions -->
    <!-- <template v-slot:extra>
      <a-button-group style="margin-right: 4px;">
        <a-button v-if="readState == -1" @click="addRead"><a-icon type="plus-circle"/>加入阅读</a-button>
        <a-button v-if="readState == 0"><a-icon type="clock-circle"/>已加入阅读</a-button>
        <a-button v-if="readState == 1"><a-icon type="clock-circle"/>阅读中</a-button>
        <a-button v-if="readState == 2"><a-icon type="check-circle"/>已读完</a-button>
        <a-button style="margin-left: 5px;" v-if="readState == 0 || readState == 1 || readState == 2" @click="delRead()"><a-icon type="close-circle"/>删除</a-button>
      </a-button-group>
    </template> -->

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

    <!-- 推荐 -->
    <a-card class="readlist-books" style="margin-top: 24px;" :bordered="false" :tabList="operationTabList" :activeTabKey="operationActiveTabKey"
      @tabChange="(key) => { this.operationActiveTabKey = key }">
      <!-- <vue-waterfall-easy ref="waterfall" :imgsArr="recommendList" :height="1200" :imgWidth="150" @scrollReachBottom="getRecommendData"></vue-waterfall-easy> -->
      <vue-masonry-wall :items="bookListItems" :options="{ width: 200, padding: 12 }" :ssr="{ columns: 5 }"
        @append="getItemData">
        <template v-slot:default="{ item }">
          <!-- <div class="cover-item" @click="goDetail('/#' + item.book.href)">
            <img :src="item.book.cover" />
          </div> -->
          <div id="book_10992986" :data-id="item.bookId" data-book_id="5663427" class="item j-spellingBook">
            <div class="cover-container checkBookDownloaded" data-book_id="5663427" data-isbn="">
              <div class="z-book-cover covered"><img
                  :src="item.book.cover"
                  class="cover btn-viewbook-open"></div>
            </div>
            <div class="item-info">
              <div class="title">
                <a :href="'#' + item.book.href" target="_blank">{{ item.book.title }}</a>
                <a-icon type="select" style="font-size: 12px;margin-left: 4px;" />
              </div>
              <div class="author">{{ item.book.author }}</div>
              <div class="footer">
                <div class="format"><span class="book-property__extension">{{ item.book.extension }}</span>, {{ item.book.filesizeString }}</div>
              </div>
            </div>
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
import { getBookListDetail, getBookListItems } from '@/api/book'
import IconText from '../../components/IconText'
import IconSelector from '../../components/IconSelector'
import VueMasonryWall from "vue-masonry-wall"

export default {
  name: 'Advanced',
  mixins: [baseMixin],
  components: {
    IconText,
    IconSelector,
    VueMasonryWall
  },
  data() {
    return {
      id: '',
      tabActiveKey: 'detail',
      operationTabList: [
        {
          key: '1',
          tab: '书单列表'
        }
      ],
      operationActiveTabKey: '1',
      readState: -2,
      detail: {},
      bookListItems: [],
      showFileVisible: false,
      fileUrl: '',
      fileViewUrl: '',
      query: { pn: 1 },
      itemLoading: false,
      toEnd: false
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        'agree': '成功',
        'reject': '驳回'
      }
      return statusMap[status]
    },
    statusTypeFilter(type) {
      const statusTypeMap = {
        'agree': 'success',
        'reject': 'error'
      }
      return statusTypeMap[type]
    }
  },
  created() {
    const id = (this.$route.params && this.$route.params.id1) + '/' + (this.$route.params && this.$route.params.id2)
    this.id = id
    this.query.bookListId = id
    this.fetchDetail(id)
    this.getItemData(id)
  },
  methods: {
    handleTabChange(key) {
      console.log('')
      this.tabActiveKey = key
    },
    fetchDetail(id) {
      this.loading = true
      getBookListDetail(id).then(res => {
        console.log('res', res)
        var d = res.data
        this.detail = d
        this.loading = false
      })
    },
    getBookListItems() {
      if (this.itemLoading) {
        return
      }
      this.itemLoading = true
      getBookListItems(this.query).then(res => {
        console.log('res', res)
        if (res.data.length == 0) {
          this.toEnd = true
        }
        var data = res.data || []
        this.bookListItems = this.bookListItems.concat(data)
        this.itemLoading = false
        this.query.pn++
      }).catch(err => {
        this.itemLoading = false
      })
    },
    getItemData() {
      if (this.toEnd) {
        return
      }
      this.getBookListItems()
    },
    goDetail(url) {
      let routeUrl = this.$router.resolve({
        path: url,
        query: { t: +new Date() }
      });
      window.open(routeUrl.href, '_blank');
    }
  }
}
</script>

<style lang="less" scoped>
.readlist-info {
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
}

.readlist-info .info-item {
  margin: 0 6px 0 0;
  color: #8c8c8c;
  font-size: 12px;
  line-height: 14px;
  align-self: center;
  display: flex;
}

.readlist-info .info-item a {
  color: #8c8c8c;
}

.readlist-info .info-item a:hover {
  color: #49afd0;
}

.readlist-info .info-item img {
  vertical-align: text-top;
  margin-right: 5px;
}

.readlist-info .info-item .info-item__content {
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  height: 20px;
}

.readlist-info .info-item._custom {
  height: auto;
}

.readlist-info .info-item .info-item__content i {
  color: #49AFD0;
  font-size: 15px;
  margin-right: 5px;
}

.readlist-info .favorite-readlist {
  cursor: pointer;
  opacity: 0.7;
  margin-right: 2px;
}

.readlist-info .favorite-readlist:hover {
  opacity: 1;
}

.readlist-info .favorite-readlist.hovered,
.readlist-info .favorite-readlist.active {
  color: #49afd0;
  opacity: 1;
}

.readlist-info .favorite-readlist img {
  width: 21px;
  margin-top: 1px;
}

.readlist-info .favorite-readlist.active img.enabled {
  display: inline-block;
  opacity: 1;
}

.readlist-info .favorite-readlist.active img.disabled {
  display: none;
}

.readlist-info .favorite-readlist img.enabled {
  display: none;
}

.readlist-info .favorite-readlist img.disabled {
  display: inline-block;
  opacity: 0.7;
}

.readlist-info .author {
  margin-right: 36px;
}

.readlist-info .date {
  width: 130px;
}

.readlist-info .books-count {
  width: 70px;
}

.readlist-info .views-count {
  width: 70px;
  margin-right: 0;
}

.readlist-info .comments-count {
  width: 60px;
  margin-right: 0;
}

.readlist-info .comments-count a {
  text-decoration: none;
}

.readlist-info .comments-count span {
  text-decoration: underline;
}

.readlist-info .views-count:last-child {
  width: auto;
}

.readlist-info .readlist-private {
  margin-left: 32px;
}

.readlist-books .item {
    float: left;
    background: #f3f3f3;
    border-radius: 8px;
    font-size: 16px;
    line-height: 22px;
    font-weight: 500;
    border: 1px solid #eee;
    margin-bottom: 10px;
}
.readlist-books .item .cover-container {
    min-height: 200px;
    max-height: 300px;
    min-width: 155px;
    overflow: hidden;
    padding: 2px 2px 0;
}
.z-book-cover {
    position: relative;
}
.readlist-books .item .cover {
    width: 100%;
    border: 2px solid #eee;
    border-bottom: none;
}
.readlist-books .item .btn-viewbook-open {
    cursor: pointer;
}
.z-book-precover img, .z-book-cover img {
    border-radius: 0 2px 2px 0;
    border: none !important;
    padding: 0 !important;
}
.readlist-books .item .item-info {
    padding: 10px 6px;
    border-radius: 0 0 8px 8px;
}
.readlist-books .item .title a {
    color: #434343;
    text-decoration: none;
    font-size: 14px;
    text-decoration: underline;
}
.readlist-books .item .title .external-link-icon {
    margin-left: 2px;
}
.readlist-books .item .author {
    font-size: 12px;
    color: #8c8c8c;
    margin-top: 12px;
    line-height: 1.5;
}
.readlist-books .item .footer {
    color: #8c8c8c;
    overflow: hidden;
    margin-top: 12px;
}
.readlist-books .item .footer .format {
    float: left;
    font-size: 12px;
}
.book-property__extension {
    text-transform: uppercase;
}

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

.cover {
  position: relative;
  border-radius: 4px;
  background: url(https://static.arkread.com/ark/pics/app/default-cover.c6741b44.png) center center/100% auto;
}

.shadow-cover,
.mini-shadow-cover,
.micro-shadow-cover {
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

.cover-item>img {
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
  height: 98% !important;
}

.mobile {
  .detail-layout {
    margin-left: unset;
  }

  .text {}

  .status-list {
    text-align: left;
  }
}</style>
