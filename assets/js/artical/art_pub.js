$(function() {
    getArtList();
    initEditor();
    // 动态获取文章分类的列表
    function getArtList() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) return layui.layer.msg('文章列表获取失败');
                // 用模板引擎将文章列表渲染到下拉框中
                var artList = template('artList', res);
                $('[name=cate_id]').html(artList);
                // 更新表单模块的数据
                var form = layui.form;
                form.render();
            }
        });
    }

    // 定义图片区域的js
    // 1. 初始化图片裁剪器
    var $image = $('#image');
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };
    // 3. 初始化裁剪区域
    $image.cropper(options);

    // 为选择图片绑定事件
    $('#selectImg').on('click', function() {
        $('#selectFile').click();
    })

    $('#selectFile').on('change', function(e) {
        // console.log(e);
        // 1、拿到用户选择的文件
        if (e.target.files.length == 0) return layui.layer.msg('请选择图片');
        var file = e.target.files[0];
        // console.log(file);
        // 2、根据文件创建一个对应的url地址
        var newImgURL = URL.createObjectURL(file);
        // 3、先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });

    // 定义发布文章的状态
    var artState = '已发布';
    $('#draft').on('click', function() {
        artState = '草稿';
    })

    // 用formData对象来发送数据
    $('#postForm').on('submit', function(e) {
        e.preventDefault();
        var fm = $('#postForm')[0];
        var fd = new FormData(fm);
        // 向FormData对象中追加元素
        fd.append('state', artState);
        // console.log(artState);
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                // console.log(blob);
                addPost(fd);
            });
    })

    // 添加文章，发送ajax
    function addPost(fd) {
        $.ajax({
            type: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) return layui.layer.msg('发布文章失败');
                // 发布成功后，在1秒后设置跳转
                layui.layer.msg(res.message, {
                    icon: 1,
                    time: 1000 //秒关闭（如果不配置，默认是3秒）
                }, function() {
                    // 清空表单内容并跳转页面
                    // console.log(parent);
                    // parent.$(window.parent.document).find('.a').toggleClass('layui-this').siblings('dd');
                    document.getElementById('postForm').reset();
                    location.href = '/artical/art_list.html';
                    window.parent.father();
                });
            }
        });
    }

})