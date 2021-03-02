$(function() {
    getimg();

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    // 更换剪裁的图片,监听点击上传的事件
    $('.chooseImage').on('click', function(e) {
        e.preventDefault();
        // 模仿用户点击上传文件的操作
        $('#newImage').click();
    })


    // 给file的input框绑定change事件
    $('#newImage').on('change', function(e) {
        // 通过e.target.files得到用户选择的图片
        // console.log(e.target.files.length);

        // 判断用户是否上传图片
        if (e.target.files.length === 0) return layui.layer.msg('请选择要上传的图片');
        // 拿到用户选择的文件
        var file = e.target.files[0];
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file);
        // 先销毁旧的裁剪区域， 再重新设置图片路径， 之后再创建新的裁剪区域：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 为确定按钮绑定事件
    $('.layui-btn-danger').on('click', function() {
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
            // console.log(dataURL);
        $.ajax({
            type: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                console.log(res);
                if (res.status !== 0) return layui.layer.msg('更新用户头像失败');
                // 重新渲染用户的头像
                console.log(window.parent);
                window.parent.getUserInfo();
                getimg();
                layui.layer.msg('更换头像成功！');
            }
        })
    })
})

// 获取用户信息，把更改头像的图片改成用户当前的头像

function getimg() {
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        success: function(res) {
            console.log(res);
            if (res.status !== 0) return layui.layer.msg('用户信息获取失败')
                // 如果用户有头像，就用用户当前的头像
            if (res.data.user_pic !== null) {
                $('.cropper-box img').prop('src', res.data.user_pic);
                $('.img-preview img').prop('src', res.data.user_pic);
            }
        }
    })
}