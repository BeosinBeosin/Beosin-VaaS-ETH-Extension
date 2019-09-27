<template>
    <button v-bind:id="id" v-bind:class="{londing: isLoading, disabled: isDisabled}" v-on:click="click">
        {{i_title}}
        <slot></slot>
    </button>
</template>

<script>
import { setInterval, clearInterval } from 'timers';
export default {
    name: 'Button',
    props: {
        id: String,
        title: String,
        state: String,
    },
    data: function() {
        return {
            i_title: this.title,
            timer: undefined,
            i_state: this.state,
            isNormal: true,
            isLoading: false,
            isDisabled: false,
        }
    },
    computed: {
        // isNormal: function() {
        //     return this.state === 'normal';
        // },
        // isLoading: function() {
        //     return this.state === 'loading';
        // },
        // isDisabled: function() {
        //     return this.state === 'disabled';
        // },
    },
    methods: {
        click: function() {
            if (this.isNormal) {
                this.$emit('click', this);
            }
        }
    },
    watch: {
        state(val) {
            if (val === 'loading') {
                if (this.isLoading || this.isDisabled) {return;}
                this.isNormal = false;
                this.isLoading = true;
                this.isDisabled = false;
            } else if (val === 'disabled') {
                if (this.isDisabled) {return;}
                this.isNormal = false;
                this.isLoading = false;
                this.isDisabled = true;
            } else {
                if (this.isNormal) {return;}
                this.isNormal = true;
                this.isLoading = false;
                this.isDisabled = false;
            }
        },
        isLoading(val) {
            if (this.disabled) {return;}
            if (val && this.timer) {return;}
            if (val) {
                let txt = `.`;
                this.timer = setInterval(() => {
                    txt = txt.length === 6 ? `.` : `${txt}.`
                    this.i_title = txt;
                }, 500);
                this.i_title = txt;
            } else {
                if (this.timer) {
                    clearInterval(this.timer);
                    this.timer = undefined;
                }
                this.i_title = this.title;
            }
        }
    },
}
</script>

<style scoped>
button {
    font-size: 12px;
    font-weight: 500;
    color: var(--vscode-button-foreground);
    background-color: var(--vscode-button-background);
    border-radius: 2px;
    line-height: 25px;
    height: 25px;
    width: 100%;
    border: 0px;
    outline: none;
    outline-color: rgba(255,255,255,0);
    margin-bottom: 1em;
    cursor: pointer;
}
button:hover {
    background-color: var(--vscode-button-hoverBackground);
}
button.londing {
    cursor: wait;
}
button.londing:hover {
    background-color: var(--vscode-button-background);
}
button.disabled {
    background-color: var(--vscode-editorGroupHeader-tabsBackground);
    cursor: default;
}
button.disabled:hover {
    background-color: var(--vscode-editorGroupHeader-tabsBackground);
}
</style>