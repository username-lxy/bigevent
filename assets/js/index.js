$(function() {
    // 用来设置进入之网页之后实现自动刷新功能
    (function() {
        // console.log(window.localStorage);
        // alert(window.localStorage);
        if (window.localStorage) {
            // console.log(1);
            if (!localStorage.getItem('firstLoad')) {
                // alert(1)
                localStorage['firstLoad'] = true;
                window.location.reload();
            } else
                localStorage.removeItem('firstLoad');
        }
    })();
    // 设置用户信息功能
    getUserInfo();
    // 实现退出功能
    $('.logout').on('click', function() {
        // 弹出提示框
        // var layer = layui.layer;
        layer.confirm('你真的要退出吗?要不要再考虑一下！', { icon: 3, title: '你舍得退出吗！！！' }, function(index) {
            // 当点击确定的时候，清除localStorage中的数据
            localStorage.removeItem('token');
            // 跳转到登陆页面
            location.href = '/login.html';
            layer.close(index);
        });
    })
});


// 获取用户信息
function getUserInfo() {
    // console.log(window);
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        success: function(res) {
            // console.log(res);
            if (res.status != 0) return layui.layer.msg('获取用户信息失败！');
            // 调用更改用户头像函数
            user(res.data);
        }
    });
}

// 更改用户头像
function user(user) {
    // console.log('调用了更新函数');
    // console.log(user);
    var name = user.nickname || user.username;
    // 修改欢迎的名字
    $('.welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 当昵称部位空时，显示真实头像
    if (user.user_pic !== null) {
        // console.log('11111');
        $('.text-avatar').hide();
        $('.layui-nav-img').attr('src', user.user_pic).show();
    } else {
        // 当昵称为空时，显示用户名的第一个字的大写
        var username = name.substr(0, 1).toUpperCase();
        $('.layui-nav-img').hide();
        // console.log(username);
        $('.text-avatar').html(username).show();
    }
}

//实现跳转
function father() {
    $('.a').addClass('layui-this').siblings().removeClass('layui-this');
}