// 固定元素混入
export default {
  props: {
    // 固定元素的名称
    stickyName: {
      type: String,
      required: true,
      default: 'stickyElement'
    },
    // 固定元素的高度
    stickyHeight: {
      type: Number,
      default: 100 // vh
    },
    // 固定元素的偏移量
    stickyOffset: {
      type: Number,
      default: 80 // px
    }
  },

  // 混入的数据
  data() {
    return {
      stickyId: null, // 固定元素的唯一标识
      elementRef: null // 存储固定元素的引用 混入在多个组件中都要使用
    }
  },

  mounted() {
    // 等到DOM渲染完成 注册固定元素
    this.$nextTick(() => {
      this.registerToStore()
    })
  },

  beforeDestroy() {
    if (this.stickyId) {
      this.$store.dispatch('sticky/unregisterElement', this.stickyId)
    }
  },

  computed: {
    // 1. 获取当前元素的固定状态
    // 组件内直接用 this.isStickyFixed 就能拿到 true/false
    isStickyFixed() {
      const Tag = this.elementState.isFixed || false
      if (Tag) this.fixedTag = Tag
      return Tag
      // const Tag = this.fixedTag = this.elementState.isFixed || false
      // return Tag
    },

    // 2. 从 Store 获取当前组件的状态对象
    elementState() {
      if (!this.stickyId) return {}
      return this.$store.getters['sticky/getElementState'](this.stickyId)
    }
  },

  methods: {
    // 1.获取固定元素
    getElementRef() {
      // 组件必须传递stickyElement
      return this.$refs.stickyElement
    },

    // 2.获取元素的位置
    getElementOffsetTop() {
      // 先获取固定元素的引用
      const element = this.getElementRef()
      // 再获取元素的位置
      if (!element) {
        console.warn('固定元素不存在')
        return 0
      }
      // 使用 getBoundingClientRect 获取相对于视口的位置
      const rect = element.getBoundingClientRect()
      // 计算相对于文档顶部的位置
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      return rect.top + scrollTop
    },

    // 3.注册固定元素
    registerToStore() {
      this.$nextTick(() => {
        // // --- 核心逻辑：计算绝对位置 ---
        // // 获取元素距离文档顶部的绝对距离 (scrollY + rect.top)
        // // 这里获取的是初始位置，一旦固定后这个位置就不准了，所以只注册一次
        // // 调用
        // const rect = el.getBoundingClientRect()
        // const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        // // 元素的绝对位置，到视口顶部的距离
        // const offsetTop = rect.top + scrollTop
        const offsetTop = this.getElementOffsetTop()

        // 生成 ID
        const id = `${this.stickyName}-${Date.now()}`

        // 发送 action 给 store
        this.$store.dispatch('sticky/registerElement', {
          id: id,
          name: this.stickyName,
          offsetTop: offsetTop, // 存入 store
          height: this.stickyHeight,
          // stickyOffset: this.stickyOffset,
          isFixed: false
        }).then((registeredId) => {
          this.stickyId = registeredId // 保存 ID 供后续查找状态
        })
      })
    }

    // 4.销毁固定元素
    // unregisterElement() {
    //   if (this.stickyId) {
    //     // 1.调用actions注销元素
    //     this.$store.dispatch('sticky/unregisterElement', this.stickyId)

    //     // 2.将stickyId和elementRef重置为null
    //     this.stickyId = null
    //     this.elementRef = null
    //   }
    // },

    // 5.更新固定元素的位置
    // updatePosition() {
    //   if (this.stickyId) {
    //     const newOffsetTop = this.getElementOffsetTop()
    //     this.$store.commit('sticky/UPDATE_ELEMENT_POSITION', {
    //       id: this.stickyId,
    //       offsetTop: newOffsetTop
    //     })
    //   }
    // }
  }
}
