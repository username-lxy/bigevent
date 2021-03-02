$(function() {
    // 对用户输入的密码进行校验
    var form = layui.form;
    form.verify({
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 判断两次的密码输入的是否一致
        newPwd: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新密码和旧密码相同！'
            }
        },
        // 判断旧密码与新密码是否一样
        rePwd: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码输入的不一样';
            }
        }
    })

    // 监听表单的提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) return layui.layer.msg(res.message);
                // 1、提示用户更改密码成功
                // 2、更改成功之后，清空表单的内容
                $('.btn-reset').click();
                layer.msg(res.message + '！3秒后将自动跳转重新登录', {
                    icon: 1,
                    time: 3000 //2秒关闭（如果不配置，默认是3秒）
                }, function() {
                    //do something
                    localStorage.removeItem('token');
                    window.parent.location.href = '/login.html';
                });
            }
        })
    })
})