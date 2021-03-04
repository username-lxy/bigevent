$(function() {
    var index = null;
    var indexEdit = null;
    initArtList();
    // console.log(1111);
    // 监听点击添加类别事件，弹出添加框
    $('#addName').on('click', function() {
        // console.log(1);
        index = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#addNewArt').html()
        });
    })

    // 监听添加事件，添加类别
    // 由于form表单是动态创建的，在点击添加的时候，需要用事件代理
    $('body').on('submit', '.btnAddArt', function(e) {
        e.preventDefault();
        console.log(1);
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) return layui.layer.msg('添加文章失败');
                initArtList();
                layui.layer.msg(res.message);
            }
        })
    })

    // 监听编辑事件,点击编辑，弹出对话框
    $(' tbody').on('click', '#edit', function(e) {
        // console.log(1);
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#editArt').html()
        });
        // 根据id将对应的得值渲染到表格中
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + $(this).attr('data-id'),
            success: function(res) {
                console.log(res);
                var form = layui.form;
                form.val('formEdit', res.data);
            }
        })
    })

    // 确认修改文章
    $('body').on('submit', '#btnEditArt', function(e) {
        e.preventDefault();
        console.log(1);
        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) return layui.layer.msg('更新数据失败');
                layui.layer.msg('更新数据成功！');
                layer.close(indexEdit);
                initArtList();
            }
        })
    })

    // 删除文章
    $('tbody').on('click', '#delete', function() {
        console.log(1);
        const id = $(this).siblings('button').attr('data-id');
        layer.confirm('确定删除？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                type: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) return layui.layer.msg(res.message);
                    layui.layer.msg('删除文章分类成功！');
                    initArtList();
                }
            })
            layer.close(index);
        });

    })

    // 获取文章列表，并渲染数据
    function initArtList() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) return layui.layer.msg('文章列表获取失败');
                // 渲染文章数据,用模板引擎
                var artList = template('artList', res); // 传入一个数据对象
                // 将模板引擎的数据展示到HTML中
                $('tbody').html(artList);
                // 关闭弹出层
                layer.close(index);
            }
        });
    }
})