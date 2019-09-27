<template>
    <input class="text_input" v-on="inputListeners" v-bind:value="value" v-bind:type="type" v-bind:placeholder="placeholder" :readonly="isReadOnly" >
</template>

<script>
export default {
    name: 'Input',
    model: {
        prop: 'value',
        event: 'input'
    },
    props: {
        id: String,
        title: String,
        type: 'text',
        placeholder: String,
        value: String,
        isReadOnly: false, 
    },
    data: function() {
        return {}
    },
    methods: {
        click: function() {
            this.$emit('click', this);
        },
        input: function() {
            this.$emit('input', this);
        }
    },
    computed: {
        // https://cn.vuejs.org/v2/guide/components-custom-events.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BB%84%E4%BB%B6%E7%9A%84-v-model
        inputListeners: function () {
            var vm = this
            // `Object.assign` 将所有的对象合并为一个新对象
            return Object.assign({},
                // 我们从父级添加所有的监听器
                this.$listeners,
                // 然后我们添加自定义监听器，
                // 或覆写一些监听器的行为
                {
                    // 这里确保组件配合 `v-model` 的工作
                    input: function (event) {
                        vm.$emit('input', event.target.value)
                    }
                }
            )
        }
    },
    mounted() {
        
    }
}
</script>

<style scoped>
.text_input {
    border: 1px solid var(--vscode-activityBar-background);
    border-radius: 2px;
    height: 20px;
    line-height: 20px;
    width: 99%;
    padding-left: 1%;
    color: var(--vscode-editor-background);
    margin-bottom: 6px;
}
</style>

