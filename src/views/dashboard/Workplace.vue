<template>
  <page-header-wrapper>
    <template v-slot:content>
      <div class="page-header-content">
        <div class="avatar">
          <a-avatar size="large" :src="currentUser.avatar" />
        </div>
        <div class="content">
          <div class="content-title">
            {{ timeFix }}，{{ user.name }}
          </div>
          <div>一分耕耘，一分收获！</div>
        </div>
      </div>
    </template>
    <template v-slot:extraContent>
      <div class="extra-content">
        <div class="stat-item">
          <a-statistic title="阅读中" :value="countData.reading" />
        </div>
        <div class="stat-item">
          <a-statistic title="已完成" :value="countData.completed" :suffix="'/ ' + countData.target" />
        </div>
        <div class="stat-item">
          <a-statistic title="总书籍数" :value="countData.total" />
        </div>
      </div>
    </template>

    <div>
      <a-row :gutter="24">
        <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card
            class="project-list"
            :loading="loading"
            style="margin-bottom: 24px;"
            :bordered="false"
            title="进行中的项目"
            :body-style="{ padding: 0 }"
          >
            <a slot="extra" @click="goCenter">全部项目</a>
            <a-list>
              <a-card-grid class="project-card-grid" :key="i" v-for="(item, i) in projects">
                <a-card :bordered="false" :body-style="{ padding: 0 }" @click="goDetail(item.id)">
                  <div class="article-profile-primary ">
                    <div class="cover shadow-cover" style="cursor: pointer;">
                      <img :src="item.cover" :alt="item.name" itemprop="image" loading="lazy">
                    </div>
                    <div class="article-profile-bd" style="padding-top: 5px;">
                      <h1 itemprop="name" class="article-title">{{item.name}}</h1>
                      <!-- <p itemprop="alternativeHeadline" class="subtitle" v-html="item.desc"></p> -->
                      <div class="article-meta">
                        <meta itemprop="bookFormat" content="http://schema.org/EBook">
                        <link itemprop="author" href="#author">
                          <p class="author">
                            <span class="label"></span>
                            <span class="labeled-text">
                              <a v-for="au in item.authorList" :key="au" class="author-item" :href="'/#/list/search-list?q=' + au"> {{au}}  </a>
                            </span>
                          </p>
                          <!-- <p class="category">
                            <span class="label"></span>
                            <span class="labeled-text">
                              <span class="ellipsis" itemprop="genre"> {{ item.properties && item.properties.种类 }} </span>
                            </span>
                          </p> -->
                          <p class="">
                            <span class="label"></span>
                            <span class="labeled-text">
                              <span> {{ item.properties && item.properties.出版社 }}</span>&nbsp;/&nbsp;<span>{{ item.properties && item.properties.年 }}</span>
                            </span>
                          </p>
                          <!-- <p class="">
                            <span class="label"></span>
                            <span class="labeled-text">
                              <span> {{ item.properties && item.properties.语言 }}</span>&nbsp;/&nbsp;<span>{{ item.properties && item.properties.文件 }}</span>
                            </span>
                          </p> -->
                        </div>
                      </div>
                  </div>
                </a-card>
              </a-card-grid>
            </a-list>
          </a-card>

          <a-card :loading="newBookLoading" title="动态" :bordered="false">
            <a slot="extra" @click="getActivity" style="margin-right: 15px;">刷新</a>
            <a slot="extra" @click="goSearchBook">全部图书</a>
            <a-list>
              <a-list-item :key="index" v-for="(item, index) in activities">
                <a-list-item-meta>
                  <a-avatar slot="avatar" @click="goDetail(item.id)" shape="square" size="default" style="width: 40px;height: auto;cursor: pointer;" :src="item.cover" />
                  <div slot="title">
                    <span style="font-weight: bold;font-size: 15px;cursor: pointer;" @click="goDetail(item.id)">{{ item.name }}</span>
                    &nbsp; <a v-for="au in item.authorList" :key="au" class="author-item" :href="'/#/list/search-list?q=' + au"> {{au}}  </a>
                    &nbsp; <a href="#" style="color: rgba(0, 0, 0, 0.45);line-height: 22px;">{{ item.categorys }}</a>
                    <br>
                    <span>{{ item.properties.File }}</span>
                  </div>
                  <div slot="description">{{ item.updateTime | moment }}</div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-card>
        </a-col>
        <a-col
          style="padding: 0 12px"
          :xl="8"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24">
          <a-card
            title="天气 指数"
            style="margin-bottom: 24px"
            :bordered="false"
            :body-style="{ padding: 0 }"
          >
            <div style="text-align: center;margin-top: 10px;">
              <iframe allowtransparency="true" frameborder="0" width="290" height="96" scrolling="no" src="//tianqi.2345.com/plugin/widget/index.htm?s=1&z=1&t=0&v=0&d=2&bd=0&k=&f=&ltf=009944&htf=cc0000&q=1&e=1&a=1&c=54511&w=290&h=96&align=center"></iframe>
            </div>
          </a-card>
          <a-card :loading="loading" title="团队" :bordered="false">
            <div class="members">
              <a-row>
                <a-col :span="12" v-for="(item, index) in teams" :key="index">
                  <a>
                    <a-avatar size="small" :src="item.avatar" />
                    <span class="member">{{ item.name }}</span>
                  </a>
                </a-col>
              </a-row>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </page-header-wrapper>
</template>

<script>
import { timeFix } from '@/utils/util'
import { mapState } from 'vuex'
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import { Radar } from '@/components'

import { getRoleList, getServiceList } from '@/api/manage'

import { findBook } from '@/api/book'
import { findLastRead, getReadCount } from '@/api/read'

const DataSet = require('@antv/data-set')

export default {
  name: 'Workplace',
  components: {
    PageHeaderWrapper,
    Radar
  },
  data () {
    return {
      timeFix: timeFix(),
      avatar: '',
      user: {},

      projects: [],
      loading: true,
      newBookLoading: false,
      radarLoading: true,
      activities: [],
      teams: [],

      // data
      axis1Opts: {
        dataKey: 'item',
        line: null,
        tickLine: null,
        grid: {
          lineStyle: {
            lineDash: null
          },
          hideFirstLine: false
        }
      },
      axis2Opts: {
        dataKey: 'score',
        line: null,
        tickLine: null,
        grid: {
          type: 'polygon',
          lineStyle: {
            lineDash: null
          }
        }
      },
      scale: [
        {
          dataKey: 'score',
          min: 0,
          max: 80
        }
      ],
      axisData: [
        { item: '引用', a: 70, b: 30, c: 40 },
        { item: '口碑', a: 60, b: 70, c: 40 },
        { item: '产量', a: 50, b: 60, c: 40 },
        { item: '贡献', a: 40, b: 50, c: 40 },
        { item: '热度', a: 60, b: 70, c: 40 },
        { item: '引用', a: 70, b: 50, c: 40 }
      ],
      radarData: [],
      countData: {
        target: 50
      }
    }
  },
  computed: {
    ...mapState({
      nickname: state => state.user.nickname,
      welcome: state => state.user.welcome
    }),
    currentUser () {
      return {
        name: 'Serati Ma',
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
      }
    },
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {
    this.user = this.userInfo
    this.avatar = this.userInfo.avatar

    // getRoleList().then(res => {
    //   // console.log('workplace -> call getRoleList()', res)
    // })

    // getServiceList().then(res => {
    //   // console.log('workplace -> call getServiceList()', res)
    // })
  },
  mounted () {
    this.findLastRead()
    this.getReadCount()
    this.getActivity()
    // this.getTeams()
    // this.initRadar()
  },
  methods: {
    findLastRead() {
      findLastRead().then(res => {
        this.projects = res.data
        this.loading = false
      })
    },
    getReadCount() {
      getReadCount().then(res => {
        this.countData = res.data
      })
    },
    goDetail (id) {
      this.$router.push({
        path: '/book/' + id,
        query: {
          t: +new Date()
        }
      })
    },
    goSearchBook() {
      this.$router.push({
        path: '/list/search-list?ty=search',
        query: {
          t: +new Date()
        }
      })
    },
    goCenter() {
      this.$router.push({
        path: '/account/center'
      })
    },
    getActivity () {
      this.newBookLoading = true
      findBook({pn: 1}).then(res => {
        this.newBookLoading = false
        var data = res.data
        if(data && data.length > 10) {
          data = data.slice(0,6)
        }
        data.forEach(e => {
          e.categorys = e.categoryList && e.categoryList.join(', ')
        })
        this.activities = data
      }).catch(err => {
        this.newBookLoading = false
      })
    },
    getTeams () {
      this.$http.get('/workplace/teams').then(res => {
        this.teams = res.result
      })
    },
    initRadar () {
      this.radarLoading = true

      this.$http.get('/workplace/radar').then(res => {
        const dv = new DataSet.View().source(res.result)
        dv.transform({
          type: 'fold',
          fields: ['个人', '团队', '部门'],
          key: 'user',
          value: 'score'
        })

        this.radarData = dv.rows
        this.radarLoading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import './Workplace.less';

.project-list {
  .article-profile-primary {
    /* display: flex; */
    padding-bottom: 13px;
  }
  .article-profile-primary .cover {
    flex-shrink: 0;
  }
  .article-profile-primary .cover {
      margin-right: 20px;
      width: 100px;
      height: auto;
      float: left;
      margin-right: 13px;
  }
  .cover {
      width: 110px;
      height: 165px;
      position: relative;
      border-radius: 4px;
      background: url(https://static.arkread.com/ark/pics/app/default-cover.c6741b44.png) center center/100% auto;
  }
  .shadow-cover, .mini-shadow-cover, .micro-shadow-cover {
      box-shadow: 1px 1px 3px 0 rgb(0 0 0 / 20%);
      min-height: 145px;
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
    font-size: 16px;
    cursor: pointer;
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
    line-height: 1;
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
}

.item-group {
  padding: 20px 0 8px 24px;
  font-size: 0;

  a {
    color: rgba(0, 0, 0, 0.65);
    display: inline-block;
    font-size: 14px;
    margin-bottom: 13px;
    width: 25%;
  }
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.members {
  a {
    display: block;
    margin: 12px 0;
    line-height: 24px;
    height: 24px;

    .member {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      line-height: 24px;
      max-width: 100px;
      vertical-align: top;
      margin-left: 12px;
      transition: all 0.3s;
      display: inline-block;
    }

    &:hover {
      span {
        color: #1890ff;
      }
    }
  }
}
.project-card-grid {
  width: 50%;
  height: 200px;
}
.mobile {
  .project-list {
    .project-card-grid {
      width: 100%;
      height: 250px;
    }
  }

  .more-info {
    border: 0;
    padding-top: 16px;
    margin: 16px 0 16px;
  }

  .headerContent .title .welcome-text {
    display: none;
  }
}
/deep/ .ant-pro-page-header-wrap-children-content {
  margin: 24px 0px 0;
}
/deep/ .ant-pro-grid-content.wide {
  max-width: 100%;
}
</style>
