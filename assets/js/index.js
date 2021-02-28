$(function() {
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
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        success: function(res) {
            console.log(res);
            if (res.status != 0) return layui.layer.msg('获取用户信息失败！');
            // 更改用户头像
            user(res.data);
        }
    });
}

// 更改用户头像
function user(user) {
    var name = user.nickname || user.username;
    // 修改欢迎的名字
    $('.welcome').html('欢迎 ' + name);
    // 当昵称部位空时，显示真实头像
    if (user.user_pic != null) {
        $('.text-avatar').hide();
        $('.layui-nav-img').prop('src', user.user_pic);
    } else {
        // 当昵称为空时，显示用户名的第一个字的大写
        var username = user.username.substr(0, 1).toUpperCase();
        $('.layui-nav-img').hide();
        console.log(username);
        $('.text-avatar').html(username).show();
    }
}