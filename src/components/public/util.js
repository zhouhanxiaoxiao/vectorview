import {Message as $message} from "iview"
import i18n from "@/i18n";
import $axios from "axios";

var util = {
    casLoginUrl : "http://119.90.33.35:8065/?service=",
    casOutUrl : "http://119.90.33.35:8065/logout",
    webCenter : "http://119.90.33.35:8064/#/",
    isNull: function (obj) {
        if (obj == null) {
            return true;
        }
        if (obj == undefined) {
            return true;
        }
        if (obj === "" ) {
            return true
        }
        if (obj.length == 0) {
            return true;
        }
        return false;
    },
    success : function (str){
        $message.success(i18n.t(str));
    },
    error : function (str){
        $message.error(i18n.t(str));
    },
    downLoad: function (postData, url, fileName) {
        $axios({
            url: url,
            data: postData,
            method: 'post',
            responseType: 'blob'
        }).then(function (res) {
            let data = res.data;
            if (!data) {
                return
            }
            let url = window.URL.createObjectURL(new Blob([data]))
            let a = document.createElement('a')
            a.style.display = 'none'
            a.href = url
            a.setAttribute('download', fileName);
            document.body.appendChild(a)
            a.click() //执行下载
            window.URL.revokeObjectURL(a.href)
            document.body.removeChild(a)
        })
    },
}
export default util;