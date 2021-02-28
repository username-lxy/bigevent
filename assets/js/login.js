$(function() {
    // 设置登陆、注册的显示与隐藏
    $('.register').hide();
    $('.login_reg').click(function() {
        $('.register').show();
        $('.login').hide();
    });
    $('.reg').click(function() {
        $('.login').show();
        $('.register').hide();
    });

    // 对表单进行正则验证
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        username: function(value) {
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }
        },
        pasw: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repasw: function(value) {
            if ($('.reg-form [name=password]').val() != value) {
                return '您两次输入的密码不一样，请重新弄输入';
            }
        }
    });

    // 监听登陆事件
    $('.login-form').on('submit', function(e) {
        e.preventDefault();
        const data = {
            username: $('.login-form [name=username]').val(),
            password: $('.login-form [name=password]').val(),
        }
        $.post('http://ajax.frontend.itheima.net/api/login', data,
            function(res) {
                if (res.status != 0) return layer.msg(res.message);
                layer.msg('登陆成功！');
                // console.log(res.token);
                localStorage.setItem('Authorization', res.token);
                location.href = '/index.html';
            })
    });

    // 表单注册模块,发送请求
    $('.reg-form').on('submit', function(e) {
        e.preventDefault();
        var data = {
            username: $('.reg-form .ipt-user').val(),
            password: $('.reg-form [name=password]').val()
        }
        $.post("http://ajax.frontend.itheima.net/api/reguser", data,
            function(res) {
                // 判断是否注册成功
                if (res.status != 0) return layer.msg(res.message);
                // 注册成功
                layui.layer.msg('注册成功，请直接登陆');
                $('.reg').click();
                // 优化用户体验，当注册成功之后，获取注册的username/password直填入登陆页面里面
                $('.login-form [name=username]').val(data.username);
                $('.login-form [name=password]').val(data.password);
            },
        );
    })
})