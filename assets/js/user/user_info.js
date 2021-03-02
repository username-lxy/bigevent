$(function() {
    getInitUserInfo();
    var form = layui.form;
    form.verify({
        nickname: function(value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }
            if (value.length >= 6) {
                return '请输入1~6位用户昵称';
            }
        }
    })

    // 提交修改时，更新用户，监听表单的提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                // 修改失败时返回
                if (res.status != 0) return layui.layer.msg(res.message);
                // 1、修改成功时,提示用户修改信息成功
                layui.layer.msg('恭喜您，修改信息成功！');
                // 2、左侧导航栏中对应的头新，昵称也要做响应的改变
                // 调用父页面的中方法
                console.log(window);
                console.log(window.parent);
                window.parent.getUserInfo();
            }
        })
    })

    // 点击重置时，重置用户信息
    $('.btn-reset').on('click', function(e) {
        // 取消reset的默认行为，因为reset会将整个表单的内容全部清空
        e.preventDefault();
        // 直接调用获取信息的函数，并进行渲染
        getInitUserInfo();
    })
})

// 初始化用户的基本信息
function getInitUserInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        success: function(res) {
            console.log(res);
            if (res.status != 0) return layui.layer.msg(res.message);
            // 将用户信息渲染到页面中
            userInfo(res.data);
        }
    });
}

// 将用户信息渲染到基本资料中
function userInfo(user) {
    var form = layui.form;
    // form.val('filter', object) layui的这个模块可以直接给表单进行赋值
    // filter是给哪个表单赋值，object是信息，根据获取的信息的属性，对应表单里的name，可以直接给对应的name进行赋值
    form.val('userInfo_form', user); // 对表单进行数据的赋值
    // console.log(user);
}