<template>
  <page-header-wrapper>
    <!-- <div style="width: 100%;text-align: center;">
      <img v-if="showRecommend" src="@/assets/bookdb_logo_2.png" style="width: 250px;height: auto;margin-bottom: 5%;margin-top: 18%;border-radius: 5px;">
    </div> -->
    <a-card :bordered="false" class="ant-pro-components-search">
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
            <a-col :md="20">
              <a-form-item :wrapper-col="{ span: 24 }">
                <a-input-search v-model="query.keywords" placeholder="输入图书名称~" enter-button="Search" allowClear
                  size="large" @search="onSearch" />
              </a-form-item>
            </a-col>
            <a-col :md="4">
              <a-form-item>
                <a-select
                  ref="select"
                  v-model="query.order"
                  size="large"
                  allowClear
                  style="width: 140px; margin-left: 20px;"
                  @change="onSearch"
                >
                  <a-select-option value="popular">最受欢迎</a-select-option>
                  <a-select-option value="timeAsc">时间增序</a-select-option>
                  <a-select-option value="timeDesc">时间倒序</a-select-option>
                  <a-select-option value="random">随机排列</a-select-option>
                </a-select>
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

    <a-card style="margin-top: 24px;" :bordered="false">
      <a-list size="large" rowKey="id" class="project-list" :loading="loading" itemLayout="vertical" :dataSource="data">
        <a-list-item :key="item.id" slot="renderItem" slot-scope="item">
          <div class="readlist-items-vertical">
            <div class="readlist-item readlist_item--editors-choice" data-readlist_id="165858">
              <section class="readlist_item--editors-choice__label">Editor's Choice</section>
              <div class="header">
                <div class="title text-overflow">
                  <a :href="'/#/booklist/' + item.id" class="color-blue">{{ item.title }}</a>
                </div>
                <div class="readlist-info">
                  <div class="info-item author text-overflow">
                    <div class="info-item__content" data-tooltip="booklist-creator" :data-author="item.authorName"
                      data-original-title="" title="">
                      <a-icon type="user"/>
                      <span><a :href="'/#/booklists/user/' + item.authorId">{{ item.authorName }}</a></span>
                    </div>
                  </div>
                  <div class="info-item date">
                    <div class="info-item__content" data-tooltip="creation-date" title="" data-original-title="创建日期">
                      <a-icon type="calendar"/>
                      <span>{{ item.createTime }}</span>
                    </div>
                  </div>
                  <div class="break-mobile"></div>
                  <div class="info-item books-count">
                    <div class="info-item__content" data-tooltip="book-quantity" title="" data-original-title="书籍数量">
                      <a-icon type="book"/>
                      {{ item.bookCount }}
                    </div>
                  </div>
                  <div class="info-item views-count">
                    <div class="info-item__content" data-tooltip="views-quantity" title="" data-original-title="意见">
                      <a-icon type="eye"/>
                      {{ item.viewCount > 1000 ? (item.viewCount) / 1000 + 'k': item.viewCount }}
                    </div>
                  </div>
                  <div class="info-item comments-count _custom">
                    <div class="info-item__content" data-tooltip="comments-quantity" title=""
                      data-original-title="Comments">
                      <a-icon type="message"/>
                      <span>{{ item.commentCount }}</span>
                    </div>
                  </div>
                  <!-- <div class="info-item favorite-readlist _custom " data-tooltip="favorites-button" title=""
                    data-original-title="添加到收藏">
                    <img class="disabled" src="/img/icon-heart.svg">
                    <img class="enabled" src="/img/icon-heart-blue.svg">
                  </div> -->
                </div>
              </div>
              <div class="zlibrary-carousel">
                <div class="readlist-carousel-container carousel-container flickity-enabled is-draggable" tabindex="0">
                  <div class="flickity-viewport" style="height: 150px; touch-action: pan-y;overflow-x: auto;">
                    <div class="flickity-slider" style="left: 0px; transform: translateX(0%);">
                      <div v-for="(it, index) in item.items" :key="it.bookId" class="carousel-cell is-selected" :style="'position: absolute; left: ' + (index * 13.56) + '%;'">
                        <div class="carousel-cell-inner">
                          <a :href="'#' + it.book.href" target="_blank">
                            <div class="cover-wrapper">
                              <div class="checkBookDownloaded" :data-book_id="it.bookId">
                                <img class="cover lazy" alt=""
                                  :src="it.book.cover"
                                  style="border-width: 1px; display: inline;"
                                  :srcset="it.book.cover + ' 1x, ' + it.book.cover + ' 2x'">
                              </div>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="carousel-buttons carousel-buttons-inside">
                  <div class="carousel-left disabled">
                    <img src="@/assets/icon-arrow-triagle-right-gray.svg">
                  </div>
                  <!-- <div class="carousel-right">
                    <img src="@/assets/icon-arrow-triagle-right-gray.svg">
                  </div> -->
                </div>
              </div>
            </div>
          </div>
        </a-list-item>
        <div slot="footer" v-if="data.length > 0" style="text-align: center; margin-top: 16px;">
          <a-button v-if="loadMoreBtn" @click="loadMore" :loading="loadingMore">加载更多</a-button>
          <span v-else style="color: rgba(0, 0, 0, 0.45);font-size: 13px;">触碰到我的底线了，换个搜索条件吧~</span>
        </div>
      </a-list>
    </a-card>
    <a-back-top />
  </page-header-wrapper>
</template>

<script>
import { TagSelect, StandardFormRow, ArticleListContent } from '@/components'
import IconText from './components/IconText'
import VueMasonryWall from "vue-masonry-wall"
import { getBookList } from '@/api/book'

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
  data() {
    return {
      query: { pn: 1, keywords: '', order: 'timeAsc', language: '' },
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
  mounted() {
    this.buildYearList()
    this.getBookList()
  },
  methods: {
    handleChange(value) {
      console.log(`selected ${value}`)
    },
    onSearch() {
      this.query.pn = 1
      this.showRecommend = false
      this.getBookList()
    },
    getBookList() {
      this.loading = true
      getBookList(this.query).then(res => {
        var data = res.data
        if (data.length < 10) {
          this.loadMoreBtn = false
        } else {
          this.loadMoreBtn = true
        }
        
        this.data = this.query.pn == 1 ? data : this.data.concat(data)
        this.loading = false
        this.loadingMore = false
      })
    },
    goDetail(id) {
      this.$router.push({
        path: '/booklist/' + id,
        query: {
          t: +new Date()
        }
      })
    },
    getRecommendData() {
      console.log('getRecommendData...')
    },
    buildYearList() {
      this.yearList = []
      for (var i = 2023; i >= 1922; i--) {
        this.yearList.push(i)
      }
    },
    loadMore() {
      this.loadingMore = true
      this.query.pn++
      this.getBookList()
    },
    getText(str) {
      if (!str) {
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
@import '~ant-design-vue/lib/style/index';
.ant-pro-components-search {
  :deep(.ant-pro-tag-select .ant-tag) {
    margin-right: 24px;
    padding: 0 8px;
    font-size: 14px;
  }
  :deep(.ant-card-body) {
    padding-bottom: 0px;
  }
}
/deep/ .ant-pro-page-header-wrap-children-content {
  margin: 0;
}
/deep/ .ant-pro-grid-content.wide {
  max-width: 100%;
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

  .shadow-cover,
  .mini-shadow-cover,
  .micro-shadow-cover {
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

}

.container {
    /* min-width: 400px; */
}

.readlist-tabs {
    display: flex;
    height: 49px;
    margin-bottom: 40px;
}

.readlist-tabs .tab-item {
    flex: 1 1 auto;
    border-bottom: 3px solid #d9d9d9;
    justify-content: center;
    display: flex;
    align-items: center;
    text-decoration: none;
    font-size: 16px;
}

.readlist-tabs .tab-item:hover {
    color: #49afd0;
}

.readlist-tabs .tab-item.active {
    color: #49afd0;
    border-color: #49afd0;
}

.readlist-items-vertical .readlist-item {
    position: relative;
    background: #fff;
    padding: 20px;
    margin: 20px 0;
    border-radius: 8px;
    box-shadow: 4px 6px 8px #eee;
}

#searchResultBox .readlist-items-vertical {
    border: 2px solid #49AFD0;
    margin: 0 -1px;
}

#searchResultBox .readlist-items-vertical .readlist-item {
    margin: 0px;
    border-radius: 0px;
    box-shadow: none;
}

.readlist-item {
    --editor_choice-outline_color: @primary-color;
}

.readlist-item.hovered:not(.readlist_item--editors-choice) {
    --editor_choice-outline_color: #D9D9D9;
    box-shadow: 4px 6px 8px #eee,
        inset 0 0 0 2px var(--editor_choice-outline_color, lightgray) !important;
}

.readlist_item--editors-choice {
    box-shadow: 4px 6px 8px #eee,
        inset 0 0 0 2px var(--editor_choice-outline_color, @primary-color) !important;
}

.readlist_item--editors-choice__label {
    position: absolute;
    display: block;
    border-radius: 8px 0 0 0;
    left: 0;
    top: 0;
    color: var(--color-white, white);
    font-weight: 500;
    font-size: 85%;
    line-height: 18px;
    background-color: var(--editor_choice-outline_color, @primary-color);
    padding: 0 6px;
    user-select: none;
}

:not(.hovered)>.readlist_item--editors-choice__label.adminOnly {
    display: none;
}

.readlist-items-vertical .header {
    display: flex;
    margin-bottom: 20px;
}

.readlist-items-vertical .title {
    text-transform: uppercase;
    flex: 1 1 auto;
    font-size: 16px;
    font-weight: 500;
    padding-right: 20px;
}

.readlist-items-vertical .description {
    margin-bottom: 20px;
    word-break: break-all;
}

.readlist-items-vertical .zlibPageMybooklists__mainPlaceholder {
    padding-left: 0;
}

.readlist-info {
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
}

.readlist-view .readlist-info {
    display: block;
    margin: 10px 0;
    margin-right: 25px;
}

.readlist-view .readlist-info .info-item {
    float: left;
    margin: 10px 26px 10px 0;
    height: 20px;
}

.readlist-view .readlist-info .author {
    width: auto;
}

.readlist-view .readlist-info .date {
    width: auto;
}

.readlist-view .readlist-info .books-count {
    width: auto;
}

.readlist-view .readlist-info .views-count {
    width: auto;
}

.readlist-view .readlist-info .comments-count {
    width: auto;
}

.readlist-view._no-border-radius {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
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

.readlist-info .readlist-url {
    white-space: nowrap;
}

.readlist-info .readlist-url a {
    color: #8c8c8c;
}

.readlist-info .readlist-url a:hover {
    color: #337ab7;
}

.readlist-info .readlist-url .copy-icon {
    display: none;
}

.readlist-info .readlist-url .copy-icon img {
    width: 15px;
    margin-left: 8px;
}

.readlist-info .readlist-url .url-icon {
    color: #02b1d2;
    margin-right: 4px;
}

.readlist-info .readlist-url:hover .copy-icon {
    display: inline-block;
}

@media (max-width: 992px) {
    .readlist-items-vertical .header {
        display: block;
    }

    .readlist-info {
        margin-top: 12px;
    }

    .readlist-info .info-item {
        margin: 0 32px 0 0;
    }

    .readlist-info .info-item.favorite-readlist {
        position: absolute;
        position: absolute;
        top: 12px;
        right: 12px;
        margin: 0;
        width: auto;
    }
}

@media (max-width: 768px) {
    .readlist-items-vertical .header {
        display: block;
    }

    .readlist-info .info-item {
        margin: 12px 24px 0 0;
        width: 90px;
    }

    .readlist-info .author {
        width: 120px;
    }

    .readlist-info .date {
        width: 120px;
    }

    /*.readlist-info .books-count { width: 90px; }*/
    .paginator {
        width: auto;
    }
}

@media (max-width: 600px) {
    .readlist-info .info-item {
        width: auto;
    }

    .readlist-info .books-count {
        width: auto;
    }

    .readlist-info .break-mobile {
        height: 0;
    }

    .readlist-info .views-count:last-child {
        width: 112px;
    }

    .readlist-info .date {
        width: auto;
    }

    /* HACK: removes quirks in small screen tooltip placement inside booklists. (next 2 lines) */
    .tooltip.bottom {
        width: max-content;
    }

    .tooltip.bottom .tooltip-arrow {
        left: 50% !important
    }
}

.readlist-block-empty {
    background: #fff;
    border-radius: 8px;
    margin: 36px auto;
    text-align: center;
    font-size: 14px;
    line-height: 24px;
}

.readlist-block-empty .block-title {
    margin-top: 18px;
}

.readlist-block-empty-favorites {
    margin: 36px auto;
    text-align: center;
    font-size: 14px;
    line-height: 24px;
    max-width: 410px;
}

.readlist-block-empty-favorites .block-title {
    margin-top: 18px;
}
.zlibrary-carousel {
    position: relative;
}
.flickity-enabled.is-draggable {
    -webkit-tap-highlight-color: transparent;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.flickity-enabled {
    position: relative;
}
.flickity-enabled.is-draggable .flickity-viewport {
    cursor: move;
    cursor: -webkit-grab;
    cursor: grab;
}
.flickity-viewport {
    overflow: hidden;
    position: relative;
    height: 100%;
}
.flickity-slider {
    position: absolute;
    width: 100%;
    height: 100%;
}
.carousel-cell {
    margin-right: 7px;
    overflow: hidden;
}
.carousel-cell-inner {
    padding: 4px;
    width: 115px;
    height: 150px;
    border: 1px solid #ddd;
}
.carousel-cell-inner a {
    text-decoration: none;
}
.carousel-cell-inner .cover-wrapper {
    background: #fff;
    overflow: hidden;
    height: 100%;
}
.carousel-cell-inner img {
    width: 100%;
}
.carousel-buttons-inside .carousel-left.disabled {
    display: none;
}

.carousel-buttons-inside .carousel-left, .carousel-buttons-inside .carousel-right {
    position: absolute;
    width: 30px;
    height: 40px;
    box-shadow: 0 2px 8px rgb(0 0 0 / 45%);
    background: #fff;
    background-size: 10px 16px;
    margin: -12px 1px 0 1px;
    top: 50%;
    cursor: pointer;
}
</style>
