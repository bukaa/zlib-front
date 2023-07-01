<template>
  <a-list
    size="large"
    rowKey="id"
    :loading="loading"
    itemLayout="vertical"
    :dataSource="data"
  >
    <a-list-item :key="item.addTime" slot="renderItem" slot-scope="item">
      <template slot="actions">
        <div style="display: inline-block;">
          <icon-text style="margin-right: 15px;" type="star-o" :text="item.interestScore || 0" />
          <icon-text style="margin-right: 15px;" type="like-o" :text="item.qualityScore || 0" />
          <icon-text type="message" :text="item.commentsInfo || 0" />
        </div>
      </template>
      <div style="width: 100%; display: inline-block;">
        <div style="width: 100px; float: left;">
          <a :href="'#/book/' + item.id">
            <img style="width: 80px;cursor: pointer;" :src="item.cover">
          </a>
        </div>
        <div style="overflow: hidden;">
          <a-list-item-meta>
            <a slot="title" :href="'#/book/' + item.id">{{ item.name }}</a>
            <template slot="description">
              <span>
                <a-tag>{{ item.author }}</a-tag>
                <a-tag>{{ item.categoryStr }}</a-tag>
              </span>
            </template>
          </a-list-item-meta>
          <div v-if="item.properties" style="margin-top: -3px;margin-bottom: 7px;">
            <span>{{ item.properties['出版社'] }}</span>
          </div>
          <div class="extra">
            <em>{{ item.addTime | moment }}</em>
          </div>
        </div>
      </div>
    </a-list-item>
    <div slot="footer" v-if="data.length > 0" style="text-align: center; margin-top: 16px;">
      <a-button @click="loadMore" :loading="loadingMore">加载更多</a-button>
    </div>
  </a-list>
</template>

<script>
import { ArticleListContent } from '@/components'
import IconText from '@/views/list/search/components/IconText'
import { findReadHistory } from '@/api/read'

export default {
  name: 'ReadHistory',
  components: {
    IconText,
    ArticleListContent
  },
  data () {
    return {
      loading: true,
      loadingMore: false,
      data: [],
      listQuery: {page: 1}
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      findReadHistory(this.listQuery).then(res => {
        console.log('res', res)
        res.data.forEach(d => {
          if(d.categoryList && d.categoryList.length > 0) {
            d.categoryStr = d.categoryList.join()
          }
        })
        this.data = this.data.concat(res.data)
      }).finally(() => {
        this.loading = false
        this.loadingMore = false
      })
    },
    loadMore () {
      this.loadingMore = true
      this.listQuery.page++
      this.getList()
    }
  }
}
</script>

<style scoped>

</style>
