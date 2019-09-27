<template>
    <div v-bind:id="id" class="box_div">
        <p v-show="title" class="title" style="margin-top: 0px;">{{title}}</p>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'BaseDiv',
    props: {
        id: String,
        title: String,
    },
    computed: {
        
    },
    data: function() {
        return {}
    },
    mounted: function() {
    }
}
</script>


<style scoped>
.box_div {
    background-color: var(--vscode-editorGroupHeader-tabsBackground);
    border-radius: 2px;
    line-height: 20px;
    padding: 16px 17px 16px;
    overflow: hidden;
    margin-bottom: 1em;
    word-break: break-word;
}
.title {
    font-weight: 550;
}
</style>
