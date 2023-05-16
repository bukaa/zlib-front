<template>
  <div>
    <!-- <div style="width: 100%;text-align: center;">
      <img v-if="showRecommend" src="@/assets/bookdb_logo_2.png" style="width: 250px;height: auto;margin-bottom: 5%;margin-top: 18%;border-radius: 5px;">
    </div> -->
    <a-card :bordered="false" class="ant-pro-components-tag-select">
      <a-form :form="form" layout="inline">
        <!-- <standard-form-row title="类目" block style="padding-bottom: 11px;">
          <a-form-item>
            <tag-select hideCheckAll mode="combobox" v-model="query.category" @change="handleCategoryChange">
              <tag-select-option v-for="c in categoryList" :key="c" :value="c" style="cursor: pointer;">{{ c }}</tag-select-option>
            </tag-select>
          </a-form-item>
        </standard-form-row> -->

        <standard-form-row title="" grid>
          <a-row>
            <a-col :md="24">
              <a-form-item :wrapper-col="{ span: 24 }">
                <a-input-search
                  v-model="query.keywords"
                  placeholder="输入书名，作者，出版社搜索~"
                  enter-button="Search"
                  allowClear
                  size="large"
                  @search="onSearch"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </standard-form-row>

        <!-- <standard-form-row title="" grid last>
          <a-row :gutter="16">
            <a-col :xs="24" :sm="24" :md="12" :lg="10" :xl="8">
              <a-form-item label="年份：" :wrapper-col="{ xs: 24, sm: 24, md: 12 }">
                <a-select v-model="query.year" allowClear showSearch placeholder="年份" style="max-width: 200px; width: 100%;">
                  <a-select-option v-for="y in yearList" :key="y" :value="y">{{y}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="10" :xl="8">
              <a-form-item label="语言：" :wrapper-col="{ xs: 24, sm: 24, md: 12 }">
                <a-select v-model="query.language" allowClear showSearch placeholder="语言" style="max-width: 200px; width: 100%;">
                  <a-select-option value="chinese">中文</a-select-option>
                  <a-select-option value="english">英文</a-select-option>
                  <a-select-option value="japanese">日文</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </standard-form-row> -->
      </a-form>
    </a-card>

    <!-- 推荐 -->
    <a-card
      v-if="showRecommend"
      style="margin-top: 24px;"
      :bordered="false"
      class="project-list"
      :tabList="operationTabList"
      :activeTabKey="operationActiveTabKey"
      @tabChange="(key) => {this.operationActiveTabKey = key}"
    > 
      <!-- <vue-waterfall-easy ref="waterfall" :imgsArr="recommendList" :height="1200" :imgWidth="150" @scrollReachBottom="getRecommendData"></vue-waterfall-easy> -->
      <vue-masonry-wall :items="recommendList" :options="{width: 225, padding: 12}" :ssr="{columns: 2}" @append="getRecommendData">
        <template v-slot:default="{item}">
          <div class="cover-item" @click="goDetail(item.id)">
            <img :src="item.cover"/>
          </div>
        </template>
      </vue-masonry-wall>
    </a-card>

    <a-card v-if="!showRecommend" style="margin-top: 24px;" :bordered="false">
      <a-list
        size="large"
        rowKey="id"
        class="project-list"
        :loading="loading"
        itemLayout="vertical"
        :dataSource="data"
      >
        <a-list-item :key="item.id" slot="renderItem" slot-scope="item" @click="goDetail(item.id)">
          <template slot="actions">
            <icon-text type="star-o" :text="item.interestScore || 0" />
            <icon-text type="like-o" :text="item.qualityScore || 0" />
            <icon-text type="message" :text="item.commentsInfo || 0" />
          </template>
          <a-list-item-meta>
            <template slot="description">
              <div class="article-profile-section article-profile-primary ">
                <div class="cover shadow-cover">
                  <img :src="item.cover" :alt="item.name" itemprop="image">
                </div>
                <div class="article-profile-bd">
                  <h1 itemprop="name" class="article-title">{{item.name}}</h1>
                  <!-- <p itemprop="alternativeHeadline" class="subtitle" v-html="item.desc"></p> -->
                  <div class="article-meta">
                    <meta itemprop="bookFormat" content="http://schema.org/EBook">
                    <link itemprop="author">
                      <p class="author">
                        <span class="label"></span>
                        <span class="labeled-text">
                          <a v-for="au in item.authorList" :key="au" class="author-item"> {{au}}  </a>
                        </span>
                      </p>
                      <p class="category">
                        <span class="label"></span>
                        <span class="labeled-text">
                          <span v-for="au in item.categoryList" :key="au" class="author-item" :href="'/category?q=' + au"> {{au}}  </span>
                        </span>
                      </p>
                      <!-- <p class="">
                        <span class="label">ISBN</span>
                        <span class="labeled-text">
                          <span itemprop="genre"> - </span>
                        </span>
                      </p> -->
                      <p class="">
                        <span class="label"></span>
                        <span class="labeled-text">
                          <span> {{ item.pub }}</span>&nbsp;/&nbsp;<span>{{ item.year }}</span>&nbsp;/&nbsp;<span>{{ item.fileDesc }}</span>
                        </span>
                      </p>
                      <p class="">
                        <!-- <span class="label"></span> -->
                        <span class="labeled-text" :title="item.descTips">
                          <span>{{item.desc}}</span>
                        </span>
                      </p>
                      
                    </div>
                  </div>
              </div>
            </template>
          </a-list-item-meta>
        </a-list-item>
        <div slot="footer" v-if="data.length > 0" style="text-align: center; margin-top: 16px;">
          <a-button v-if="loadMoreBtn" @click="loadMore" :loading="loadingMore">加载更多</a-button>
          <span v-else style="color: rgba(0, 0, 0, 0.45);font-size: 13px;">触碰到我的底线了，换个搜索条件吧~</span>
        </div>
      </a-list>
    </a-card>
    <a-back-top />
  </div>
</template>

<script>
import { TagSelect, StandardFormRow, ArticleListContent } from '@/components'
import IconText from './components/IconText'
import VueMasonryWall from "vue-masonry-wall"

const TagSelectOption = TagSelect.Option

export default {
  components: {
    TagSelect,
    TagSelectOption,
    StandardFormRow,
    ArticleListContent,
    IconText,
    VueMasonryWall
  },
  data () {
    return {
      query: {pn: 1, keywords: '', year: '', language: ''},
      loading: true,
      loadingMore: false,
      loadMoreBtn: true,
      data: [],
      yearList: [],
      form: this.$form.createForm(this),
      categoryList: ['Fiction', 'History', 'Society', 'Children\'s Books', 'Psychology', 'Biography', 'Erotica', 'Crime'],
      showRecommend: true,
      recommendList: [],
      operationTabList: [
        {
          key: '1',
          tab: '为您推荐'
        }
      ],
      operationActiveTabKey: '1'
    }
  },
  mounted () {
    this.buildYearList()
    this.getRecommendList()
    // this.getList()
  },
  methods: {
    handleChange (value) {
      console.log(`selected ${value}`)
    },
    onSearch() {
      this.query.pn = 1
      this.showRecommend = false
      this.getList()
    },
    getList () {
      this.$http.get('/zlib/find', {params: this.query}).then(res => {
        console.log('res', res)
        var data = res.data
        data.forEach(d => {
          d.desc = this.getText(d.desc)
          if(d.desc && d.desc.length > 120) {
            d.descTips = d.desc 
            d.desc = d.desc.substr(0, 120) + '...'
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
        })
        if(data.length < 10) {
          this.loadMoreBtn = false
        } else {
          this.loadMoreBtn = true
        }
        this.data = this.query.pn == 1 ? data: this.data.concat(data)
        this.loading = false
        this.loadingMore = false
      })
    },
    goDetail (id) {
      let routeUrl = this.$router.resolve({
        path: '/book/' + id,
        query: {
          t: +new Date()
        }
      })
      window.open(routeUrl.href, '_blank')
    },
    getRecommendList (id) {
      this.$http.get('/zlib/recommend').then(res => {
        console.log('res', res)
        var data = res.data || []
        this.recommendList = data
      })
    },
    getRecommendData() {
      console.log('getRecommendData...')
    },
    buildYearList() {
      this.yearList = []
      for(var i = 2023; i >= 1922; i--) {
        this.yearList.push(i)
      }
    },
    loadMore () {
      this.loadingMore = true
      this.query.pn++
      this.getList()
    },
    getText(str) {
      if(!str) {
        return
      }
      let words = str.replace(/<[^<>]+>/g, "").replace(/&nbsp;/gi, " "); //这里是去除标签
      return words //这里是去除空格
    },
    handleCategoryChange(e) {
      debugger
    }
  }
}
</script>

<style lang="less" scoped>
.ant-pro-components-tag-select {
  :deep(.ant-pro-tag-select .ant-tag) {
    margin-right: 24px;
    padding: 0 8px;
    font-size: 14px;
  }
}

.project-list {
  .article-profile-primary {
    /* display: flex; */
    padding-bottom: 10px;
  }
  .article-profile-primary .cover {
    flex-shrink: 0;
  }
  .article-profile-primary .cover {
      margin-right: 20px;
      width: 110px;
      height: auto;
      float: left;
      margin-right: 13px;
  }
  .cover {
      position: relative;
      border-radius: 4px;
      background: url(https://static.arkread.com/ark/pics/app/default-cover.c6741b44.png) center center/100% auto;
  }
  .shadow-cover, .mini-shadow-cover, .micro-shadow-cover {
      box-shadow: 1px 1px 3px 0 rgb(0 0 0 / 20%);
      min-height: 136px;
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
    font-size: 15px;
  }
  .desc {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  .app-article p {
    margin-bottom: 0;
  }
  p {
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 6px;
  }
  .card-title {
    font-size: 0;
    a {
      color: rgba(0, 0, 0, 0.85);
      margin-left: 12px;
      line-height: 24px;
      height: 24px;
      display: inline-block;
      vertical-align: top;
      font-size: 14px;

      &:hover {
        color: #1890ff;
      }
    }
  }

  .card-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }

  .project-item {
    display: flex;
    margin-top: 8px;
    overflow: hidden;
    font-size: 12px;
    height: 20px;
    line-height: 20px;

    a {
      color: rgba(0, 0, 0, 0.45);
      display: inline-block;
      flex: 1 1 0;

      &:hover {
        color: #1890ff;
      }
    }

    .datetime {
      color: rgba(0, 0, 0, 0.25);
      flex: 0 0 auto;
      float: right;
    }
  }

  .ant-card-meta-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }
  /deep/ .ant-list-item-action {
    margin-top: -10px;
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
}

.list-articles-trigger {
  margin-left: 12px;
}
</style>
