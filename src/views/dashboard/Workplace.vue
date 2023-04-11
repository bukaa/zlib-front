<template>
  <page-header-wrapper>
    <template v-slot:content>
      <div class="page-header-content">
        <div class="avatar">
          <a-avatar size="large" :src="currentUser.avatar" />
        </div>
        <div class="content">
          <div class="content-title">
            {{ timeFix }}，{{ user.name }}<span class="welcome-text">，{{ welcome }}</span>
          </div>
          <div>一分耕耘，一分收获！</div>
        </div>
      </div>
    </template>
    <template v-slot:extraContent>
      <div class="extra-content">
        <div class="stat-item">
          <a-statistic title="阅读中" :value="1" />
        </div>
        <div class="stat-item">
          <a-statistic title="已完成" :value="8" suffix="/ 50" />
        </div>
        <div class="stat-item">
          <a-statistic title="总书籍数" :value="2223" />
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
            <a slot="extra">全部项目</a>
            <div>
              <a-card-grid class="project-card-grid" :key="i" v-for="(item, i) in projects">
                <a-card :bordered="false" :body-style="{ padding: 0 }" @click="goDetail(item.id)">
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
                              <a v-for="au in item.authorList" :key="au" class="author-item" :href="'/search?q=' + item.au"> {{au}}  </a>
                            </span>
                          </p>
                          <p class="category">
                            <span class="label">类别</span>
                            <span class="labeled-text">
                              <span itemprop="genre"> 出版 / 虚构 </span>
                            </span>
                          </p>
                          <p class="">
                            <span class="label">出版社</span>
                            <span class="labeled-text">
                              <span> 北京日报出版社</span>&nbsp;/&nbsp;<span>2023-02</span>
                            </span>
                          </p>
                          <!-- <p class="">
                            <span class="label">摘要 </span>
                            <span class="labeled-text">
                              <span v-html="item.desc"></span>
                            </span>
                          </p> -->
                          <!-- <p class="">
                            <span class="label">ISBN</span>
                            <span class="labeled-text">
                              <a href="https://book.douban.com/subject/36136689/" title="9787547744048" itemprop="isbn">9787547744048</a>
                            </span>
                          </p> -->
                        </div>
                      </div>
                  </div>
                </a-card>
              </a-card-grid>
            </div>
          </a-card>

          <a-card :loading="loading" title="动态" :bordered="false">
            <a-list>
              <a-list-item :key="index" v-for="(item, index) in activities">
                <a-list-item-meta>
                  <a-avatar slot="avatar" size="small" :src="item.user.avatar" />
                  <div slot="title">
                    <span>{{ item.user.nickname }}</span
                    >&nbsp; 在&nbsp;<a href="#">{{ item.project.name }}</a
                    >&nbsp; <span>{{ item.project.action }}</span
                    >&nbsp;
                    <a href="#">{{ item.project.event }}</a>
                  </div>
                  <div slot="description">{{ item.time }}</div>
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
            title="XX 指数"
            style="margin-bottom: 24px"
            :loading="radarLoading"
            :bordered="false"
            :body-style="{ padding: 0 }"
          >
            <div style="min-height: 400px;">
              <!-- :scale="scale" :axis1Opts="axis1Opts" :axis2Opts="axis2Opts"  -->
              <radar :data="radarData" />
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
      radarData: []
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

    getRoleList().then(res => {
      // console.log('workplace -> call getRoleList()', res)
    })

    getServiceList().then(res => {
      // console.log('workplace -> call getServiceList()', res)
    })
  },
  mounted () {
    this.getProjects()
    this.getActivity()
    this.getTeams()
    this.initRadar()
  },
  methods: {
    getProjects () {
      // this.$http.get('/list/search/projects').then(res => {
      //   this.projects = res.result && res.result.data
      //   this.projects = this.projects.slice(0, 3)
      //   console.log(this.projects)
      //   this.loading = false
      // })
      this.projects = [
        {
          "id": "11959979/6d4f06",
          "name": "围城 出版七十周年纪念版",
          "author": "钱锺书",
          "interestScore": "5.0",
          "qualityScore": "5.0",
          "commentsInfo": "36",
          "desc": "围城故事发生于1920到1940年代。主角方鸿渐是个从中国南方乡绅家庭走出的青年人，迫于家庭压力与同乡周家女子订亲。但在其上大学期间，周氏患病早亡。准岳父周先生被方所写的唁电感动，资助他出国求学。\n<br>方鸿渐在欧洲游学期间，不理学业。为了给家人一个交待，方于毕业前购买了虚构的“克莱登大学”的博士学位证书，并随海外学成的学生回国。在船上与留学生鲍小姐相识并热恋，但被鲍小姐欺骗感情。同时也遇见了大学同学苏文纨。\n<br>到达上海后，在已故未婚妻父亲周先生开办的银行任职。此时，方获得了同学苏文纨的青睐，又与苏的表妹唐晓芙一见钟情，整日周旋于苏、唐二人之间，期间并结识了追求苏文纨的赵辛楣。方最终与苏、唐二人感情终结，苏嫁与诗人曹元朗，而赵也明白方并非其情敌，从此与方惺惺相惜。方鸿渐逐渐与周家不和。\n<br>抗战开始，方家逃难至上海的租界。在赵辛楣的引荐下，与赵辛楣、孙柔嘉、顾尔谦、李梅亭几人同赴位于内地的三闾大学任教。由于方鸿渐性格等方面的弱点，陷入了复杂的人际纠纷当中。后与孙柔嘉订婚，并离开三闾大学回到上海。在赵辛楣的帮助下，方鸿渐在一家报馆任职，与孙柔嘉结婚。\n<br>婚后，方鸿渐夫妇与方家、孙柔嘉姑母家的矛盾暴露并激化。方鸿渐辞职并与孙柔嘉吵翻，逐渐失去了生活的希望。",
          "cover": "https://zlibrary.tk/covers299/books/b0/10/e0/b010e077deeb642a16ae00fe8a7abf45.jpg",
          "properties": {
            "种类": "Fiction",
            "年": "2017",
            "出版社": "人民文学出版社",
            "语言": "chinese",
            "页": "377",
            "ISBN 10": "7020127894",
            "ISBN 13": "9787020127894",
            "文件": "EPUB, 764 KB"
          },
          "state": 1,
          "fileState": 1,
          "authorList": [
            "钱锺书"
          ],
          "categoryList": [
            "Fiction"
          ]
        },
        {
          "name": "人类简史：从动物到上帝（完整版）",
          "author": "哈拉里·尤瓦尔·诺亚·哈拉里 林俊宏",
          "interestScore": "5.0",
          "qualityScore": "5.0",
          "commentsInfo": "12",
          "desc": "<p>《人类简史：从动物到上帝》是尤瓦尔·赫拉利创作的历史类著作，于2012年首次出版。</p>\n<p>作者讲述了人类从石器时代至21世纪的演化与发展史，并将人类历史分为四个阶段：认知革命、农业革命、人类的融合统一与科学革命。</p>",
          "cover": "https://zlibrary.tk/covers299/books/a1/66/bd/a166bd6a2d70459a72a65614f25d06ad.jpg",
          "properties": {
            "种类": "History - World History",
            "年": "2014",
            "出版社": "中信出版社",
            "语言": "chinese",
            "页": "417",
            "ISBN 10": "7508660757",
            "ISBN 13": "9787508660752",
            "系列": "开放历史系列",
            "文件": "EPUB, 2.12 MB"
          },
          "state": 1,
          "fileState": 1,
          "authorList": [
            "哈拉里·尤瓦尔·诺亚·哈拉里",
            "林俊宏"
          ],
          "categoryList": [
            "History - World History"
          ]
        }
        // {
        //   "name": "非暴力沟通",
        //   "author": "Marshall Rosenberg 阮胤华",
        //   "interestScore": "5.0",
        //   "qualityScore": "5.0",
        //   "commentsInfo": "12",
        //   "desc": "<p>马歇尔•卢森堡博士发现了一种沟通方式，依照它来谈话和聆听，能使人们情意相通，和谐相处，这就是“非暴力沟通”。</p>\n<p>做为一个遵纪守法的好人，也许我们从来没有把谈话和“暴力”扯上关系。不过如果稍微留意一下现实生活中的谈话方式，并且用心体会各种谈话方式给我们的不同感受，我们一定会发现，有些话确实伤人！言语上的指责、嘲讽、否定、说教以及任意打断、拒不回应、随意出口的评价和结论给我们带来的情感和精神上的创伤甚至比肉体的伤害更加令人痛苦。这些无心或有意的语言暴力让人与人变得冷漠、隔膜、敌视。</p>\n<p>非暴力沟通能够：</p>\n<p>? 疗愈内心深处的隐秘伤痛；</p>\n<p>? 超越个人心智和情感的局限性；</p>\n<p>? 突破那些引发愤怒、沮丧、焦虑等负面情绪的思维方式；</p>\n<p>? 用不带伤害的方式化解人际间的冲突；</p>",
        //   "cover": "https://zlibrary.tk/covers299/books/41/3a/ae/413aaeb5f110f3d2836dec86cb5c3f3a.jpg",
        //   "properties": {
        //     "种类": "Psychology - Psychology - Theory, History & Research",
        //     "年": "2016",
        //     "出版社": "华夏出版社",
        //     "语言": "chinese",
        //     "页": "190",
        //     "ISBN 10": "7508095227",
        //     "ISBN 13": "9787508095226",
        //     "文件": "MOBI , 825 KB"
        //   },
        //   "fileState": 1,
        //   "authorList": [
        //     "Marshall Rosenberg",
        //     "阮胤华"
        //   ],
        //   "categoryList": [
        //     "Psychology - Psychology - Theory, History & Research"
        //   ]
        // }
      ]
      this.loading = false
    },
    goDetail (id) {
      this.$router.push({
        path: '/book/' + id,
        query: {
          t: +new Date()
        }
      })
    },
    getActivity () {
      this.$http.get('/workplace/activity').then(res => {
        this.activities = res.result
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
    line-height: 1.2;
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
