export default {
  // 1.定义元素数据
  props: {
    stickyName: { // 元素名
      type: String,
      require: true,
      default: 'stickyElement'
    }
  },
  data() {
    return {
      elementHeight: 100, // 元素高度
      elementId: null, // 唯一标识
      elementRef: null, // 引用获取
      isFixes: false
    }
  },
  mounted() {
    // 挂在时注册元素
    this.$nextTick(() => {
      this.registerElement()
    })
  },
  beforeDestroy() {
    this.unregisterElement()
  },
  computed: {
    // 计算获取元素状态
    getElementState() {
      // 传入id以查找对应id的固定状态
      const state = this.$store.getters['sticky/getElementState'](this.elementId)
      return state
    },
    isStickyFixed() {
      return this.getElementState.isFixed || false
    }
  },
  methods: {
    // 获取元素的引用
    getElement() {
      // 将元素引用存到数据
      return this.$refs.stickyElement
    },
    // 获取元素位置
    getElementPosition() {
      // 拿到元素
      const element = this.getElement()
      // 获取元素顶部距离视口顶部的偏移量
      const rect = element.getBoundingClientRect()
      // 获取页面滚动的偏移量
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      // 元素相对视口的偏移量和页面滚动的偏移量互相抵消 得到一个固定的值 元素偏移量
      return rect.top + scrollTop
    },
    // 注册元素
    registerElement() {
      this.$nextTick(() => {
        // 拿到元素偏移量
        const offsetTop = this.getElementPosition()
        // 生成id
        const id = `${this.stickyName}-${Date.now()}`
        this.elementId = id
        // 调用action传递给store
        this.$store.dispatch('sticky/registerElement', {
          id: id,
          name: this.stickyName,
          height: this.elementHeight,
          offsetTop: offsetTop,
          isFixed: false
        })
      })
    },
    // 注销元素
    unregisterElement() {
      this.$store.dispatch('sticky/unregisterElement', this.elementId)
    }
  }
}
