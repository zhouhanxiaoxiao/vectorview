<template>
    <div class="language-select" style="color: white;display: inline-block;margin: 0 10px">
        <div class="btn-group btn-group-sm btn-group-toggle" data-toggle="buttons">
            <label class="btn btn-link active" style="color: white">
                <input type="radio" name="options" id="option1" checked @click="changeLanguage('zh')"> 中文
            </label>
            <span style="color: white;font-size: 20px">|</span>
            <label class="btn btn-link" style="color: white">
                <input type="radio" name="options" id="option3" @click="changeLanguage('en')"> English
            </label>
        </div>
    </div>
</template>

<script>
    export default {
        name: "language",
        methods:{
            changeLanguage:function (tar) {
                localStorage.setItem('local',tar);
                window.location.reload();
            }
        }
    }
</script>

<style scoped>

</style>